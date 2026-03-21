import { z } from "zod"

/*const panSchema = z.string()
  .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format") // e.g. ABCDE1234F

const gstSchema = z.string()
  .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST format")

const ifscSchema = z.string()
  .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC format")
*/
const bankSchema = z.object({
  accountNumber: z.string().min(8).max(18),
  accountHolder: z.string().min(2),
  ifsc: z.string(),
})

const upiSchema = z.object({
  upiId: z.string()//.regex(/^[\w.\-]{3,}@[a-zA-Z]{3,}$/, "Invalid UPI ID"),
})

export const kycSchema = z.object({
    accountHolder: z.string().min(2),
	 upiVpa:z.string().min(3),
 })

