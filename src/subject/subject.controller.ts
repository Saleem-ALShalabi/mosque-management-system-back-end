import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { createSubjectDto } from './dto/create-subject.dto';
import { updateSubjectDto } from './dto/update-subject.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subject')
export class SubjectController {
    constructor(private subjectService: SubjectService) { }

    @Roles('admin', 'teacher')
    @Post()
    createSubject(@Body() dto: createSubjectDto) {
        return this.subjectService.createSubject(dto);
    }

    @Roles('admin')
    @Patch(':subjectId')
    updateSubjectById(@Param('subjectId') subjectId: string, @Body() dto: updateSubjectDto) {
        return this.subjectService.changeSubjectById(subjectId, dto);
    }

    @Roles('admin', 'teacher')
    @Patch(':subjectId/end')
    endSubject(@Param('subjectId') subjectId: string) {
        return this.subjectService.endSubject(subjectId);
    }

}
