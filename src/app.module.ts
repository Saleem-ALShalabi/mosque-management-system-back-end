import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClassModule } from './class/class.module';
import { SubjectModule } from './subject/subject.module';
import { LessonModule } from './lesson/lesson.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ClassModule,
    SubjectModule,
    LessonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
