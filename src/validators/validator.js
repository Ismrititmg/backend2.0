import {z} from "zod"
export let nameValidatorSchema = z.string().min(2,"name must be of minimum 2 letters").max(100,"name must not exceed 100 letters")//.option (if option needed)


export let emailValidatorSchema = z.email("email must be valid")

export let createStudentValidatorSchema=z.object({
    name: nameValidatorSchema,
    email: emailValidatorSchema
})

export let idValidator = z.int().negative()

export let updateStudentValidatorSchema=z.object({
    id: idValidator,
    name: nameValidatorSchema.optional(),
    email:emailValidatorSchema.optional()
})