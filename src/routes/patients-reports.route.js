import express from 'express'

const patientReportsRoute = express.Router()

patientReportsRoute.post('/:patientId/create_report', (req, res) => {
	// todo
})

patientReportsRoute.post('/:patientId/all_reports', (req, res) => {
	// todo
})

export default patientReportsRoute
