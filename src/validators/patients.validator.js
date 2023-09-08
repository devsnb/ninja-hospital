import z, { object, string, date } from 'zod'
import mongoose from 'mongoose'

export const RegisterPatientResponseSchema = object({
	_id: z.instanceof(mongoose.Types.ObjectId).transform(val => val.toString()),
	name: string({
		required_error: 'name is a required field'
	}).nonempty('name cannot be empty'),
	phoneNumber: string({
		required_error: 'phoneNumber is a required field'
	})
		.length(10, 'phone number must be of 10 digits')
		.regex(/^[0-9]+$/, 'phone number must contain only numbers'),
	createdAt: date({ required_error: 'createdAt is a required field' })
}).transform(patient => {
	return {
		id: patient._id.toString(),
		name: patient.name,
		phoneNumber: patient.phoneNumber,
		createdAt: patient.createdAt
	}
})

/**
 * Validation schema for patient registration
 */
export const RegisterPatientSchema = object({
	name: string({
		required_error: 'name is a required field'
	}).nonempty('name cannot be empty'),
	phoneNumber: string({
		required_error: 'phoneNumber is a required field'
	})
		.length(10, 'phone number must be of 10 digits')
		.regex(/^[0-9]+$/, 'phone number must contain only numbers')
})
