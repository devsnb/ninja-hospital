import z, { object, string, date, array } from 'zod'
import mongoose from 'mongoose'

import { CreateDoctorResponseSchema } from './doctors.validator.js'
import { RegisterPatientResponseSchema } from './patients.validator.js'

export const CreateReportResponseSchema = object({
	_id: z.instanceof(mongoose.Types.ObjectId).transform(val => val.toString()),
	status: z.enum(
		[
			'Negative',
			'Travelled - Quarantine',
			'Symptoms - Quarantine',
			'Positive - Admit'
		],
		{ required_error: 'status is a required field' }
	),
	createdBy: CreateDoctorResponseSchema,
	patient: RegisterPatientResponseSchema,
	createdAt: date({ required_error: 'createdAt is a required field' })
}).transform(report => {
	return {
		id: report._id.toString(),
		status: report.status,
		createdBy: report.createdBy,
		patient: report.patient,
		createdAt: report.createdAt
	}
})

export const CreateReportSchema = object({
	status: z.enum(
		[
			'Negative',
			'Travelled - Quarantine',
			'Symptoms - Quarantine',
			'Positive - Admit'
		],
		{ required_error: 'status is a required field' }
	),
	patientPhoneNumber: string({
		required_error: 'phoneNumber is a required field'
	})
		.length(10, 'phone number must be of 10 digits')
		.regex(/^[0-9]+$/, 'phone number must contain only numbers')
})

/**
 * Validation schema for a list of reports
 */
export const ReportListSchema = array(CreateReportResponseSchema)
