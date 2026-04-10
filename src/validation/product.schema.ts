import * as z from "zod";

export const ProductSchema = z.object({
    name: z.string().trim().min(1),
    price: z.string()
        .transform((val) => (val === "" ? 0 : Number(val)))
        .refine((num) => num > 0, {
            message: "Price is required"
        }),
    detailDesc: z.string().trim().min(1),
    shortDesc: z.string().trim().min(1),
    quantity: z.string()
        .transform((val) => (val === "" ? 0 : Number(val)))
        .refine((num) => num > 0, {
            message: "At least 1 is required"
        }),
    brand: z.string().trim().min(1),
    category: z.string().trim().min(1),
});

export type TProductSchema = z.infer<typeof ProductSchema>