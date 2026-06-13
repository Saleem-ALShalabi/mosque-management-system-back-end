import { createZodDto } from "nestjs-zod";
import { z } from 'zod';

const CreateClassSchema = z.object({
    name: z.string().min(2),
    teacherUsername: z.string().min(2),
    academicYear: z.number().int().min(2000),
});

export class CreateClassDto extends createZodDto(CreateClassSchema) { }