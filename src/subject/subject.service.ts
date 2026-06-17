import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createSubjectDto } from './dto/create-subject.dto';
import { updateSubjectDto } from './dto/update-subject.dto';


@Injectable()
export class SubjectService {
    constructor(private prisma: PrismaService) { }

    async createSubject(dto: createSubjectDto) {

        return this.prisma.subject.create({
            data: {
                classId: dto.classId,
                teacherId: dto.teacherId,
                title: dto.title,
                attendancePoints: dto.attendancePoints
            },
        });
    }

    async changeSubjectById(subjectId: string, dto: updateSubjectDto) {
        return this.prisma.subject.update({
            where: { id: subjectId },
            data: {
                classId: dto.classId,
                teacherId: dto.teacherId,
                title: dto.title,
                attendancePoints: dto.attendancePoints
            }
        });
    }

    async endSubject(subjectId: string) {
        return this.prisma.subject.update({
            where: { id: subjectId },
            data: {
                endDate: new Date(),
                isActive: false
            }
        });
    }

}
