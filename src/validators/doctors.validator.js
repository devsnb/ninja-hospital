import z, { object, string } from 'zod'
import mongoose from 'mongoose'

/**
 * validation schema for sending doctor
 */
export const CreateDoctorResponseSchema = object({
	_id: z.instanceof(mongoose.Types.ObjectId).transform(val => val.toString()),
	name: string({
		required_error: 'name is a required field'
	}).nonempty(),
	email: string({
		required_error: 'email is a required field'
	})
		.email('email should be valid')
		.nonempty()
}).transform(user => {
	return {
		id: user._id.toString(),
		name: user.name,
		email: user.email
	}
})

/**
 * validation schema for user registration
 */
export const CreateDoctorSchema = object({
	name: string({
		required_error: 'name is a required field'
	}).nonempty(),
	email: string({
		required_error: 'email is a required field'
	})
		.email('email should be valid')
		.nonempty(),
	password: string({
		required_error: 'password is a required field'
	})
		.min(8, 'password should be minimum 8 characters long')
		.max(32, 'password cannot exceed 32 characters')
		.nonempty()
})

/**
 * Validation schema for login user
 */
export const LoginDoctorSchema = object({
	email: string({
		required_error: 'email is a required field'
	})
		.email('email should be valid')
		.nonempty(),
	password: string({
		required_error: 'password is a required field'
	})
		.min(8, 'password should be minimum 8 characters long')
		.max(32, 'password cannot exceed 32 characters')
		.nonempty()
})
