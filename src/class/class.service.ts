import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { ta, tr } from 'zod/v4/locales';
import { assignChildrenDto } from './dto/assign-children.dto';
import { changeClassDto } from './dto/change-class.dto';

@Injectable()
export class ClassService {
    constructor(private prisma: PrismaService) { }

    async createClass(dto: CreateClassDto) {
        const teacher = await this.prisma.user.findUnique({
            where: { username: dto.teacherUsername }
        });
        if (!teacher) throw new NotFoundException('Teacher not found!');
        if (teacher?.role !== 'teacher')
            throw new BadRequestException('User isn\'t teacher!');
        const teacherId = teacher.id;
        const createdClass = await this.prisma.class.create({
            data: {
                name: dto.name,
                teacherId,
                academicYear: dto.academicYear
            },
        });
        return createdClass;
    }

    async getAllClass() {
        return this.prisma.class.findMany({
            select: {
                name: true,
                academicYear: true,
                teacher: {
                    select: {
                        name: true
                    },
                },
                _count: {
                    select: {
                        children: true,
                    }
                },
            }
        });
    }

    async assignChildrenToClass(classId: string, dto: assignChildrenDto) {
        const targetClass = await this.prisma.class.findUnique({ where: { id: classId } });
        if (!targetClass)
            throw new NotFoundException('Class not found!');
        const childUsers = await this.prisma.user.findMany({
            where: {
                username: { in: dto.childrenUsernames },
                role: 'child'
            },
            include: {
                childAccount: true
            }
        });
        if (childUsers.length !== dto.childrenUsernames.length)
            throw new BadRequestException('One or more usernames are invalid or do not belong to a child account');
        const childTableIds = childUsers.map((user) => user.childAccount?.id).filter((id): id is string => id !== undefined);
        return this.prisma.child.updateMany({
            where: {
                id: { in: childTableIds },
            },
            data: {
                classId,
            },
        });
    }

    async getClassById(classId: string) {
        const targetClass = await this.prisma.class.findUnique({
            where: { id: classId },
            include: { children: true },
        });
        if (!targetClass)
            throw new NotFoundException('Class not found!');
        return targetClass;
    }

    async changeClassById(classId: string, dto: changeClassDto) {
        const { name, teacherUsername, academicYear } = dto;
        let teacherId: string | undefined = undefined;
        if (teacherUsername) {
            const teacherUser = await this.prisma.user.findUnique({
                where: { username: teacherUsername }
            });
            if (!teacherUser)
                throw new NotFoundException('Teacher not found!')
            if (teacherUser.role !== 'teacher')
                throw new BadRequestException('User isn\'t a teacher!');
            teacherId = teacherUser.id;
        }
        return this.prisma.class.update({
            where: { id: classId },
            data: {
                name,
                teacherId,
                academicYear,
            }
        });
    }

    async deleteClassById(classId: string) {
        return this.prisma.class.delete({
            where: { id: classId },
        });
    }

}
