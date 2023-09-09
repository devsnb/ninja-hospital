import z, { object, date, array } from 'zod'
import mongoose from 'mongoose'

import { CreateDoctorResponseSchema } from './doctors.validator.js'
import { RegisterPatientResponseSchema } from './patients.validator.js'

/**
 * Validation schema for Report Response
 */
export const CreateReportResponseSchema = object({
	_id: z.instanceof(mongoose.Types.ObjectId).transform(val => val.toString()),
	status: z.enum(
		[
			'Negative',
			'Travelled-Quarantine',
			'Symptoms-Quarantine',
			'Positive-Admit'
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

/**
 * Validation schema for creating a report
 */
export const CreateReportSchema = object({
	status: z.enum(
		[
			'Negative',
			'Travelled-Quarantine',
			'Symptoms-Quarantine',
			'Positive-Admit'
		],
		{ required_error: 'status is a required field' }
	)
})

/**
 * Validation schema for a list of reports
 */
export const ReportListSchema = array(CreateReportResponseSchema)

/**
 * Schema for Report Status
 */
export const ReportStatusSchema = z.enum(
	['Negative', 'Travelled-Quarantine', 'Symptoms-Quarantine', 'Positive-Admit'],
	{
		required_error: 'status is a required field',
		invalid_type_error: `status must be one of ['Negative', 'Travelled-Quarantine', 'Symptoms-Quarantine', 'Positive-Admit']`
	}
)
