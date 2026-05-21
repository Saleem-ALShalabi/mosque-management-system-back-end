import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { tr } from 'zod/v4/locales';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { CreateParentDto } from './dto/create-parent.dto';
import { CreateChildDto } from './dto/create-child.dto';
import { AssignParentDto } from './dto/assign-parent.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    private async checkUsernameExists(username: string) {
        const existing = await this.prisma.user.findUnique({
            where: { username },
        });
        if (existing) throw new ConflictException('Username already Exists!');
    }

    async createTeacher(dto: CreateTeacherDto) {
        await this.checkUsernameExists(dto.username);
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                username: dto.username,
                email: dto.email,
                passwordHash,
                role: 'teacher'
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
        return user;
    }

    async createParent(dto: CreateParentDto) {
        await this.checkUsernameExists(dto.username);
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                username: dto.username,
                email: dto.email,
                passwordHash,
                role: 'parent'
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
        return user;
    }

    async createChild(dto: CreateChildDto) {
        await this.checkUsernameExists(dto.username);
        const classExists = await this.prisma.class.findUnique({
            where: { id: dto.classId },
        });
        if (!classExists) throw new NotFoundException('Class not found!');
        let parentId: string | undefined;
        if (dto.parentUsername) {
            const parent = await this.prisma.user.findUnique({
                where: { username: dto.parentUsername },
            });
            if (!parent) throw new NotFoundException('Parent not found!');
            if (parent.role !== 'parent') throw new BadRequestException('Provided user is not a parent!');
            parentId = parent.id;
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const result = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name: dto.name,
                    username: dto.username,
                    passwordHash,
                    role: 'child',
                },
            });
            const child = await tx.child.create({
                data: {
                    userId: user.id,
                    classId: dto.classId,
                    parentId,
                    name: dto.name,
                    birthYear: dto.birthYear,
                },
            });
            return { user, child };
        });
        return {
            id: result.user.id,
            name: result.user.name,
            username: result.user.username,
            role: result.user.role,
            birthYear: result.child.birthYear,
            classId: result.child.classId,
            parentId: result.child.parentId,
            totalPoints: result.child.totalPoints,
            createdAt: result.user.createdAt,
        };
    }

    async assignParent(childUserId: string, dto: AssignParentDto) {
        const child = await this.prisma.child.findUnique({ where: { userId: childUserId } });
        if (!child) throw new NotFoundException('Child not found!');
        const parent = await this.prisma.user.findUnique({
            where: { username: dto.parentUsername },
        });
        if (!parent) throw new NotFoundException('Parent not found!');
        if (parent.role !== 'parent')
            throw new BadRequestException('User provided not a parent!');
        await this.prisma.child.update({
            where: { userId: childUserId },
            data: { parentId: parent.id },
        });
        return { message: 'Parent assigned successfully' };
    }

    async getAllUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            }
        });
    }

    async getUserById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
                childAccount: {
                    select: {
                        birthYear: true,
                        classId: true,
                        parentId: true,
                        totalPoints: true,
                        photoUrl: true,
                    },
                },
            },
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async resetPassword(userId: string, dto: ResetPasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) throw new NotFoundException('User not found!');
        const passwordHash = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });
        return { message: 'Password reset successfully' };
    }

    async toggleActive(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found!');
        await this.prisma.user.update({
            where: { id: userId },
            data: { isActive: !user.isActive }
        });
        return { message: `User ${user.isActive ? 'deactivated' : 'activated'} successfully!` };
    }

}
