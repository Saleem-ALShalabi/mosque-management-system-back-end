import { createZodDto } from "nestjs-zod";
import { z } from 'zod';
const createSubjectSchema = z.object({
    classId: z.string().uuid(),
    teacherId: z.string().uuid(),
    title: z.string().min(3, "Subject name must be more than 3 letters"),
    attendancePoints: z.number().int().min(1).optional(),
});
export class createSubjectDto extends createZodDto(createSubjectSchema) { };