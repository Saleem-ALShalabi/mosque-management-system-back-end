import { createZodDto } from "nestjs-zod";
import { z } from 'zod';

const ResetPasswordSchema = z.object({
    newPassword: z.string().min(6),
});

export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) { }