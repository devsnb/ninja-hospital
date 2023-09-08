import express from 'express'

import patientReportsRoute from './patients-reports.route.js'

const patientsRoute = express.Router()

patientsRoute.post('/register', (req, res) => {
	// todo
})

patientsRoute.use('/', patientReportsRoute)

export default patientsRoute
