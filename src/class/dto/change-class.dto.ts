import { createZodDto } from "nestjs-zod";
import { z } from 'zod';
const changeClassSchema = z.object({
    name: z.string().min(3, 'Name must be 3 letters at least').optional(),
    teacherUsername: z.string().min(3).optional(),
    academicYear: z.number().int().min(2000).optional()
});

export class changeClassDto extends createZodDto(changeClassSchema) { }