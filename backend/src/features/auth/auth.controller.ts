
import { Controller, Request, Post, UseGuards, Body, Get, Res, UnauthorizedException, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from '../users/dto/user.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.login(loginDto);
        this.setCookies(res, result.access_token, result.refresh_token);
        return {
            message: 'Login successful',
            access_token: result.access_token,
            refresh_token: result.refresh_token
        };
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.register(createUserDto);
        this.setCookies(res, result.access_token, result.refresh_token);
        return {
            message: 'Registration successful',
            access_token: result.access_token,
            refresh_token: result.refresh_token
        };
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Request() req, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['refresh_token'] || req.body.refresh_token;
        if (!refreshToken) throw new UnauthorizedException('Refresh token not found');

        const result = await this.authService.refreshTokens(refreshToken);
        this.setCookies(res, result.access_token, result.refresh_token);
        return {
            message: 'Token refreshed',
            access_token: result.access_token,
            refresh_token: result.refresh_token
        };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Request() req, @Res({ passthrough: true }) res: Response) {
        // We try to get user from request if guard middleware attached user, 
        // but here we might not have it if token expired. 
        // We can try decoding token or just clear cookies. 
        // Ideally we invalidate in DB too.
        // For simplicity and robustness, we check cookie.

        /* 
           If access token is valid, req.user is populated by JwtStrategy.
           If access token expired, we might be hitting logout? 
           Usually logout requires auth.
        */
        const userId = req.user?._id || req.user?.id;
        if (userId) {
            await this.authService.logout(userId);
        }

        res.clearCookie('auth_token');
        res.clearCookie('refresh_token');
        return { message: 'Logged out successfully' };
    }

    private setCookies(res: Response, accessToken: string, refreshToken: string) {
        res.cookie('auth_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 15 * 60 * 1000 // 15 mins
        });
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 3600 * 1000 // 7 days
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
