import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';

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

}
