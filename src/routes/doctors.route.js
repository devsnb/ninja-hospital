import express from 'express'

import {
	registerDoctorHandler,
	loginDoctorHandler
} from '../controllers/doctors.controller.js'

const doctorsRoute = express.Router()

doctorsRoute.post('/register', registerDoctorHandler)

doctorsRoute.post('/login', loginDoctorHandler)

export default doctorsRoute
