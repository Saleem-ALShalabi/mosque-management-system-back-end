import { Body, Controller, UseGuards, Post, Get, Param, Patch } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersService } from './users.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { CreateParentDto } from './dto/create-parent.dto';
import { CreateChildDto } from './dto/create-child.dto';
import { AssignParentDto } from './dto/assign-parent.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Post('teacher')
    createTeacher(@Body() dto: CreateTeacherDto) {
        return this.userService.createTeacher(dto);
    }

    @Post('parent')
    createParent(@Body() dto: CreateParentDto) {
        return this.userService.createParent(dto);
    }

    @Post('child')
    createChild(@Body() dto: CreateChildDto) {
        return this.userService.createChild(dto);
    }

    @Patch(':id/assign-parent')
    assignParent(@Param('id') id: string, @Body() dto: AssignParentDto) {
        return this.userService.assignParent(id, dto);
    }

    @Get()
    getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get(':id')
    getUserById(@Param('id') id: string) {
        return this.userService.getUserById(id);
    }

    @Patch(':id/reset-password')
    resetPassword(@Param('id') id: string, @Body() dto: ResetPasswordDto) {
        return this.userService.resetPassword(id, dto);
    }

    @Patch(':id/toggle-active')
    toggleActive(@Param('id') id: string) {
        return this.userService.toggleActive(id);
    }

}
