
import { Controller, Request, Post, UseGuards, Body, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from '../users/dto/user.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.login(loginDto);
        res.cookie('auth_token', result.access_token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: 'lax',
            path: '/',
            maxAge: 3600 * 1000 // 1 hour
        });
        return { data: result.user };
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.register(createUserDto);
        // Usually register doesn't auto-login in some flows, but here we can return the user.
        // If register should auto-login, we need the token. AuthService.register currently returns User, not token.
        // For consistency with previous flow, let's just return the user. 
        // If we want auto-login, we'd need to change AuthService to return token on register too.
        // Assuming user logs in after register for now, or if AuthService changes return type.
        // Current AuthService.register returns User.

        // Wait, if I want to set cookie on register, I need a token.
        // Does AuthService.register return a token? 
        // Let's check AuthService. I'll assume for now it just returns User and user must login.
        return { data: result };
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('auth_token');
        return { message: 'Logged out successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return { data: req.user };
    }
}
