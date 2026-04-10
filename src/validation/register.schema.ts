import { z } from 'zod'
import { isEmailExist } from '../services/users.service'


const EmailSchema =
    z.string()
        .email("Email is not valid")
        .refine(async (email) => {
            const existingUser = await isEmailExist(email)
            return !existingUser
        }, {
            message: "Email already exists",
            path: ["email"]
        })

const PasswordSchema = z
    .string()
    .min(3, { message: "Password must be as least 3 characters" })
    .max(12, { message: "Password can not exceed 20 characters" })

export const RegisterSchema = z.object({
    name: z.string().trim().min(1, { message: "name can't be empty" }),
    username: z.string().trim().min(1, { message: "username can't be empty" }),
    email: EmailSchema,
    password: PasswordSchema,
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "confirmed password is incorrect",
    path: ['confirmPassword']
})

export type TRegisterSchema = z.infer<typeof RegisterSchema>