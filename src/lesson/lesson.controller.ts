import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { createLessonDto } from './dto/create-lesson.dto';
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lesson')
export class LessonController {
    constructor(private lessonService: LessonService) { }

    @Roles('admin', 'teacher')
    @Post()
    async createLesson(@Body() dto: createLessonDto) {
        return this.lessonService.createLesson(dto);
    }

    @Roles('admin', 'teacher')
    @Patch(':lessonId/publish')
    async publishLesson(@Param('lessonId') lessonId: string) {
        return this.lessonService.publishLesson(lessonId);
    }

    @Get(':subjectId/get-published')
    async getPublishedLessons(@Param('subjectId') subjectId: string) {
        return this.lessonService.findPublishedLessonBySubject(subjectId);
    }

}
