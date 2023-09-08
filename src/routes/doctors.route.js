import express from 'express'

import { registerDoctorHandler } from '../controllers/doctors.controller.js'

const doctorsRoute = express.Router()

doctorsRoute.post('/register', registerDoctorHandler)

doctorsRoute.post('/login', (req, res) => {
	// todo
})

export default doctorsRoute
