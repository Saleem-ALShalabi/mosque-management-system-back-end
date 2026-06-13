import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const CreateTeacherSchema = z.object({
    name: z.string().min(2),
    username: z.string().min(3),
    password: z.string().min(6),
    email: z.string().email().optional(),
});

export class CreateTeacherDto extends createZodDto(CreateTeacherSchema) { }