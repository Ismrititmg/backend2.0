import zod from "zod"
export let registerUserValidationSchema = zod.object({
    email: zod.email("email is invalid"),
    username: zod.string().min(4,"username must be minimum 4 character long"),
    password: zod.string().min(6,"password must be minimum 6 characters long")
})
export let loginUserValidationSchema = zod.object({
    email: zod.email("Please provide valid email"),
    password: zod.string().min(1, "password is required")
})