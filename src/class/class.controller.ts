import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';
import { assignChildrenDto } from './dto/assign-children.dto';
import { changeClassDto } from './dto/change-class.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('class')
export class ClassController {
    constructor(private classService: ClassService) { }

    @Roles('admin')
    @Post()
    createClass(@Body() dto: CreateClassDto) {
        return this.classService.createClass(dto);
    }

    @Roles('admin')
    @Get()
    getAllClass() {
        return this.classService.getAllClass();
    }

    @Roles('admin')
    @Post(':classId/children')
    assignChildren(@Param('classId') classId: string, @Body() dto: assignChildrenDto) {
        return this.classService.assignChildrenToClass(classId, dto);
    }

    @Roles('admin')
    @Get(':classId')
    getClassById(@Param('classId') classId: string) {
        return this.classService.getClassById(classId);
    }

    @Roles('admin')
    @Patch(':classId/update')
    updateClassById(@Param('classId') classId: string, @Body() dto: changeClassDto) {
        return this.classService.changeClassById(classId, dto);
    }

    @Roles('admin')
    @Delete(':classId')
    deleteClassById(@Param('classId') classId: string) {
        return this.classService.deleteClassById(classId);
    }

}
