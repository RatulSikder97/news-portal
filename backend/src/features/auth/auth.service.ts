
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);

        console.log(user, await bcrypt.hashSync(pass, 10));

        if (user && (await bcrypt.compare(pass, user.password))) {
            return user;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.getTokens(user._id, user.email);
    }

    async register(userDto: CreateUserDto) {
        const newUser = await this.usersService.create(userDto);
        return this.getTokens(newUser._id, newUser.email);
    }

    async logout(userId: string) {
        await this.usersService.updateRefreshToken(userId, null);
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = await this.jwtService.verifyAsync(
                refreshToken,
                { secret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key' }
            );
            const user = await this.usersService.findByIdAndRefreshToken(payload.sub, refreshToken);
            if (!user) throw new UnauthorizedException('Access Denied');

            return this.getTokens(user._id, user.email);
        } catch (e) {
            throw new UnauthorizedException('Invalid or Expired Refresh Token');
        }
    }

    async getTokens(userId: string, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                { sub: userId, email },
                { secret: process.env.JWT_SECRET || 'your_secret_key', expiresIn: '15m' },
            ),
            this.jwtService.signAsync(
                { sub: userId, email },
                { secret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key', expiresIn: '7d' },
            ),
        ]);

        await this.usersService.updateRefreshToken(userId, refreshToken);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: { _id: userId, email } // Minimal info, mostly for ID if needed immediately
        };
    }
}
