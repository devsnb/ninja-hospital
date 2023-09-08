import mongoose from 'mongoose'

import Report from '../models/report.model.js'
import Patient from '../models/patient.model.js'
import Doctor from '../models/doctor.model.js'
import validator from '../common/validator.js'
import logger from '../common/logger.js'
import {
	CreateReportSchema,
	CreateReportResponseSchema,
	ReportListSchema
} from '../validators/reports.validator.js'

/**
 * handles patient report creation
 * @param {*} req express request object
 * @param {*} res express response object
 */
export const createReportHandler = async (req, res) => {
	try {
		const [result, errors] = await validator(CreateReportSchema, req.body)

		// if error in validation send a 400
		if (errors) {
			return res.status(400).json({
				message: 'invalid inputs',
				errors
			})
		}

		// set the created by doctor
		result.createdBy = req.user._id

		const patientFound = await Patient.findOne({
			phoneNumber: result.patientPhoneNumber
		})

		// send 403 if patient not found
		if (!patientFound) {
			return res.status(403).json({
				message: `cannot perform this operation, patient not found with phone number ${result.phoneNumber}`
			})
		}

		// add patient to result
		result.patient = patientFound

		// save the report and populate createdBy & patient
		const savedReport = await (
			await (
				await Report.create(result)
			).populate({
				path: 'createdBy',
				select: ['_id', 'name', 'email']
			})
		).populate({
			path: 'patient',
			select: ['_id', 'name', 'phoneNumber', 'createdAt']
		})

		// add report to doctor collection
		const doctor = await Doctor.findById(req.user._id)
		doctor.reports.push(savedReport)
		await doctor.save()

		// add report to patient
		patientFound.reports.push(savedReport)
		await patientFound.save()

		// serialize report
		const [report] = await validator(CreateReportResponseSchema, savedReport)

		// send the report
		res.status(201).json({
			message: 'report created successfully',
			report
		})
	} catch (error) {
		logger.error(error, 'failed to create report')
		// if something unexpected occurs send a 500 with a failed message
		return res.status(500).json({
			message: 'report creation failed, please try again'
		})
	}
}

/**
 * handles patient report creation
 * @param {*} req express request object
 * @param {*} res express response object
 */
export const getAllReportsForPatentHandler = async (req, res) => {
	try {
		let patientId = req.params['patientId']

		if (!mongoose.Types.ObjectId.isValid(patientId)) {
			return res.status(400).json({
				message: 'invalid input',
				errors: {
					ObjectId: 'ObjectId is not valid'
				}
			})
		}

		const foundPatient = await Patient.findById(patientId)

		if (!foundPatient) {
			return res.status(403).json({
				message: 'you cannot perform this operation',
				errors: {
					patient: `Patient not found with id: ${patientId}`
				}
			})
		}

		const foundReports = await Report.find({
			patient: foundPatient
		})
			.populate({
				path: 'createdBy',
				select: ['_id', 'name', 'email']
			})
			.populate({
				path: 'patient',
				select: ['_id', 'name', 'phoneNumber', 'createdAt']
			})

		const [reports] = await validator(ReportListSchema, foundReports)

		// send the report
		res.status(200).json({
			message: 'fetching reports successful!',
			reports
		})
	} catch (error) {
		logger.error(error, 'failed to find reports')
		// if something unexpected occurs send a 500 with a failed message
		return res.status(500).json({
			message: 'failed to fetch reports, please try again'
		})
	}
}
