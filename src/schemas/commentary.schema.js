import { z } from "zod";

export const commentarySchema = z.object({
    commentary_text: z.string({required_error: "El comentarioario es requerido"}).min(1).max(50),
});
