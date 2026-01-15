import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../features/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: any) => {
                    return request?.cookies?.auth_token;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'secretKey',
        });
    }

    async validate(payload: any) {
        const user = await this.usersService.findOne(payload.sub);
        if (!user) {
            throw new UnauthorizedException();
        }
        return { id: user._id.toString(), name: user.name, email: user.email };
    }
}
