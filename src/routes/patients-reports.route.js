import express from 'express'
import passport from 'passport'

import {
	createReportHandler,
	getAllReportsForPatentHandler
} from '../controllers/reports.controller.js'

const patientReportsRoute = express.Router()

patientReportsRoute.post(
	'/:patientId/create_report',
	passport.authenticate('jwt', { session: false }),
	createReportHandler
)

patientReportsRoute.get(
	'/:patientId/all_reports',
	passport.authenticate('jwt', { session: false }),
	getAllReportsForPatentHandler
)

export default patientReportsRoute
