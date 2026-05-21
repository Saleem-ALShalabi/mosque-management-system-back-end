import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ) { }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { username: dto.username },
        });

        if (!user) throw new UnauthorizedException('Invalid credentials');

        if (!user.isActive) throw new UnauthorizedException('Account is disabled');

        const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');

        const token = await this.jwt.signAsync({
            sub: user.id,
            role: user.role,
        });

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
            }
        }
    }
}
