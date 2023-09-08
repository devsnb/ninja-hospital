import Patient from '../models/patient.model.js'

/**
 * handles patient registration
 * @param {*} req express request object
 * @param {*} res express response object
 */
export const registerPatientHandler = async (req, res) => {
	console.log(req.user)
	try {
		// validate incoming request
		if (
			!req.body.patientName ||
			req.body.patientName === '' ||
			!req.body.phoneNumber ||
			req.body.phoneNumber === '' ||
			(req.body.phoneNumber + '').length !== 10
		) {
			return res.status(400).json({
				message: 'invalid inputs',
				errors: {
					patientName:
						!req.body.patientName || req.body.patientName === ''
							? 'phoneNumber is a required field & cannot be empty'
							: undefined,
					phoneNumber:
						!req.body.phoneNumber || req.body.phoneNumber === ''
							? 'phoneNumber is a required field & cannot be empty'
							: ((req.body.phoneNumber + '').length !== 10) !== 10
							? 'phone number must be 10 digits'
							: undefined
				}
			})
		}

		const foundPatient = await Patient.findOne({
			phoneNumber: req.body.phoneNumber
		})

		if (foundPatient) {
			return res.status(200).json(foundPatient)
		}

		const newPatientPayload = {
			name: req.body.patientName,
			phoneNumber: req.body.phoneNumber,
			doctor: req.user._id
		}

		const savedPatient = await Patient.create(newPatientPayload)
		return res.status(200).json(savedPatient)
	} catch (error) {
		logger.error(error, 'failed to register patient')
		// if something unexpected occurs send a 500 with a failed message
		return res.status(500).json({
			message: 'patient registration failed, please try again'
		})
	}
}
