
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
        return result.user;
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
        return await this.authService.register(createUserDto);

    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('auth_token');
        return { message: 'Logged out successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
