import { createZodDto } from "nestjs-zod";
import { z } from 'zod';

const LoginSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
});

export class LoginDto extends createZodDto(LoginSchema) { }