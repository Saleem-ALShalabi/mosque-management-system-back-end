import { createZodDto } from "nestjs-zod";
import { z } from 'zod';

const assignChildrenSchema = z.object({
    childrenUsernames: z.array(z.string().min(1, 'Username can\'t be empty')).min(1).max(50),
});

export class assignChildrenDto extends createZodDto(assignChildrenSchema) { }