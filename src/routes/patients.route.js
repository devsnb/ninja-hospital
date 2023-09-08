import express from 'express'
import passport from 'passport'

import { registerPatientHandler } from '../controllers/patients.controller.js'
import patientReportsRoute from './patients-reports.route.js'

const patientsRoute = express.Router()

patientsRoute.post(
	'/register',
	passport.authenticate('jwt', { session: false }),
	registerPatientHandler
)

patientsRoute.use('/', patientReportsRoute)

export default patientsRoute
