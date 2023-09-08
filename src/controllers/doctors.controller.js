import * as argon from 'argon2'
import validator from 'validator'

import Doctor from '../models/doctor.model.js'
import { signJwt } from '../utils/jwt.util.js'
import logger from '../common/logger.js'

/**
 * handles doctor registration
 * @param {*} req express request object
 * @param {*} res express response object
 */
export const registerDoctorHandler = async (req, res) => {
	try {
		// validate incoming request body
		if (
			!req.body.name ||
			req.body.name === '' ||
			!req.body.email ||
			req.body.email === '' ||
			!validator.isEmail(req.body.email) ||
			!req.body.password ||
			req.body.password === ''
		) {
			return res.status(400).json({
				message: 'invalid inputs',
				errors: {
					name:
						!req.body.name || req.body.name === ''
							? 'name is a required field & cannot be empty'
							: undefined,
					email:
						!req.body.email || req.body.email === ''
							? 'email is a required field & cannot be empty'
							: !validator.isEmail(req.body.email)
							? 'email has to be a valid email'
							: undefined,
					password:
						!req.body.password || req.body.password === ''
							? 'password is a required field & cannot be empty'
							: undefined
				}
			})
		}

		const doctorFound = await Doctor.findOne({ email: req.body.email })

		// if the user is already present send them an 403
		if (doctorFound) {
			return res.status(403).json({
				message:
					'you cannot to perform this operation, if you think it is an error contact support'
			})
		}

		// hash the password
		const hashedPassword = await argon.hash(req.body.password)

		// user data with hashedPassword
		const newUserPayload = {
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword
		}

		// save user
		const savedDoctor = await Doctor.create(newUserPayload)

		// payload for response
		const responsePayload = {
			name: savedDoctor.name,
			email: savedDoctor.email,
			createdAt: savedDoctor.createdAt
		}

		// if all is good send a 201 with the doctor data
		return res.status(201).json({
			message: 'registration successful!',
			doctor: responsePayload
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
		if (
			!req.body.email ||
			req.body.email === '' ||
			!validator.isEmail(req.body.email) ||
			!req.body.password ||
			req.body.password === ''
		) {
			return res.status(400).json({
				message: 'invalid inputs',
				errors: {
					email:
						!req.body.email || req.body.email === ''
							? 'email is a required field & cannot be empty'
							: !validator.isEmail(req.body.email)
							? 'email has to be a valid email'
							: undefined,
					password:
						!req.body.password || req.body.password === ''
							? 'password is a required field & cannot be empty'
							: undefined
				}
			})
		}

		const doctorFound = await Doctor.findOne({ email: req.body.email })

		// if no doctor is found throw a 403
		if (!doctorFound) {
			return res.status(403).json({
				message: 'failed to verify identity'
			})
		}

		const passwordMatches = await argon.verify(
			doctorFound.password,
			req.body.password
		)

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
