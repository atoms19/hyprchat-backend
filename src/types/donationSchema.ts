import { z } from 'zod';


export const donnationSchema = z.object({
	 amount: z.coerce.number().positive(),
    message: z.string().max(500).optional(),
	 phone: z.string().regex(/^\d{10}$/, "Invalid phone number format"),
	 username: z.string().max(100)
})
