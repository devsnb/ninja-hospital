import Patient from '../models/patient.model.js'
import Doctor from '../models/doctor.model.js'
import validator from '../common/validator.js'
import {
	RegisterPatientSchema,
	RegisterPatientResponseSchema
} from '../validators/patients.validator.js'

/**
 * handles patient registration
 * @param {*} req express request object
 * @param {*} res express response object
 */
export const registerPatientHandler = async (req, res) => {
	try {
		// validate incoming request
		const [result, errors] = await validator(RegisterPatientSchema, req.body)

		// if validation has errors send a 400
		if (errors) {
			return res.status(400).json({
				message: 'invalid inputs',
				errors
			})
		}

		const foundPatient = await Patient.findOne({
			phoneNumber: result.phoneNumber
		})

		if (foundPatient) {
			return res.status(200).json(foundPatient)
		}

		// attach doctor to the parsed body
		result.doctor = req.user._id

		const savedPatient = await Patient.create(result)

		// add patient to the doctor relation
		const doctor = await Doctor.findById(result.doctor)
		doctor.patients.push(savedPatient)
		await doctor.save()

		const [patient] = await validator(
			RegisterPatientResponseSchema,
			savedPatient
		)

		return res.status(200).json(patient)
	} catch (error) {
		logger.error(error, 'failed to register patient')
		// if something unexpected occurs send a 500 with a failed message
		return res.status(500).json({
			message: 'patient registration failed, please try again'
		})
	}
}
