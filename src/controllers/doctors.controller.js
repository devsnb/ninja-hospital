import * as argon from 'argon2'

import Doctor from '../models/doctor.model.js'
import { signJwt } from '../utils/jwt.util.js'
import logger from '../common/logger.js'
import validator from '../common/validator.js'
import {
	CreateDoctorSchema,
	CreateDoctorResponseSchema,
	LoginDoctorSchema
} from '../validators/doctors.validator.js'

/**
 * handles doctor registration
 * @param {*} req express request object
 * @param {*} res express response object
 */
export const registerDoctorHandler = async (req, res) => {
	try {
		// validate incoming request body
		const [result, errors] = await validator(CreateDoctorSchema, req.body)

		if (errors) {
			return res.status(400).json({
				message: 'invalid inputs',
				errors
			})
		}

		const doctorFound = await Doctor.findOne({ email: result.email })

		// if the user is already present send them an 403
		if (doctorFound) {
			return res.status(403).json({
				message:
					'you cannot to perform this operation, if you think it is an error contact support'
			})
		}

		// hash the password
		const hashedPassword = await argon.hash(result.password)

		// add hashed password to our parsed result
		result.password = hashedPassword

		// save user
		const savedDoctor = await Doctor.create(result)

		const [doctor] = await validator(CreateDoctorResponseSchema, savedDoctor)

		// if all is good send a 201 with the doctor data
		return res.status(201).json({
			message: 'registration successful!',
			doctor
		})
	} catch (error) {
		logger.error(error, 'failed to register user')
		// if something unexpected occurs send a 500 with a failed message
		return res.status(500).json({
			message: 'failed to register, please try again'
		})
	}
}

/**
 * handles doctor login
 * @param {*} req express request object
 * @param {*} res express response object
 */
export const loginDoctorHandler = async (req, res) => {
	try {
		// validate incoming request body
		const [result, errors] = await validator(LoginDoctorSchema, req.body)

		// if the input contains error send a 400
		if (errors) {
			return res.status(400).json({
				message: 'invalid inputs',
				errors
			})
		}

		const doctorFound = await Doctor.findOne({ email: result.email })

		// if no doctor is found throw a 403
		if (!doctorFound) {
			return res.status(403).json({
				message: 'failed to verify identity'
			})
		}

		// match hashed password with provided password
		const passwordMatches = await argon.verify(
			doctorFound.password,
			req.body.password
		)

		// if password does not match send a 403
		if (!passwordMatches) {
			return res.status(403).json({
				message: 'failed to verify identity'
			})
		}

		const jwtPayload = {
			id: doctorFound._id.toString()
		}

		const token = signJwt(jwtPayload)

		if (!token) {
			return res.status(500).json({
				message: 'failed to login'
			})
		}

		res.status(200).json({
			message: 'login successful!',
			access_token: token
		})
	} catch (error) {
		logger.error(error, 'failed to login user')
		// if something unexpected occurs send a 500 with a failed message
		return res.status(500).json({
			message: 'failed to login, please try again'
		})
	}
}
