import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class LessonService {
    constructor(private prisma: PrismaService) { }

    async createLesson(dto: createLessonDto) {
        return this.prisma.lesson.create({
            data: {
                subjectId: dto.subjectId,
                title: dto.title,
                pdfUrl: dto.pdfUrl,
                order: dto.order,
                isVisible: false
            }
        });
    }

    async publishLesson(lessonId: string) {
        return this.prisma.lesson.update({
            where: { id: lessonId },
            data: { isVisible: true }
        });
    }

    async findPublishedLessonBySubject(subjectId: string) {
        return this.prisma.lesson.findMany({
            where: {
                subjectId: subjectId,
                isVisible: true
            },
            orderBy: {
                order: 'asc'
            }
        });
    }

}
