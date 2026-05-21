import { createZodDto } from "nestjs-zod";
import { z } from 'zod';

const CreateChildSchema = z.object({
    name: z.string().min(2),
    username: z.string().min(3),
    password: z.string().min(6),
    birthYear: z.number().int().min(2000).max(new Date().getFullYear()),
    classId: z.string().uuid(),
    parentUsername: z.string().min(3).optional(),
});

export class CreateChildDto extends createZodDto(CreateChildSchema) { }