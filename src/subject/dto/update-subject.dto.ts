import { createZodDto } from "nestjs-zod";
import { z } from 'zod';
const updateSubjectSchema = z.object({
    classId: z.string().uuid().optional(),
    teacherId: z.string().uuid().optional(),
    title: z.string().min(3).optional(),
    attendancePoints: z.number().int().min(1).optional()
});
export class updateSubjectDto extends createZodDto(updateSubjectSchema) { }