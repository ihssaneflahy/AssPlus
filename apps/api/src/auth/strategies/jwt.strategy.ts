import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') ?? '',
    });
  }

  async validate(payload: { sub: string; login: string; role: string; agenceId: string | null }) {
    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.actif) throw new UnauthorizedException();
    return { id: user.id, login: user.login, role: user.role, agenceId: user.agenceId };
  }
}
