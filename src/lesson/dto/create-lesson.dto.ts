import { createZodDto } from "nestjs-zod";
import { z } from 'zod';
const createLessonSchema = z.object({
    subjectId: z.string().uuid(),
    title: z.string().min(3),
    pdfUrl: z.string().url(),
    order: z.number().int().positive()
});
export class createLessonDto extends createZodDto(createLessonSchema) { }