import { createZodDto } from "nestjs-zod";
import { z } from 'zod';

const AssignParentSchema = z.object({
    parentUsername: z.string().min(3),
});

export class AssignParentDto extends createZodDto(AssignParentSchema) { }