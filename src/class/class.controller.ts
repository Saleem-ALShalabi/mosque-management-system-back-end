import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('class')
export class ClassController {
    constructor(private classService: ClassService) { }

    @Roles('admin')
    @Post()
    createClass(@Body() dto: CreateClassDto) {
        return this.classService.createClass(dto);
    }
}
