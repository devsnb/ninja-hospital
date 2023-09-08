import express from 'express'
import passport from 'passport'

import { getAllReportsByStatus } from '../controllers/reports.controller.js'

const reportsRoute = express.Router()

reportsRoute.get(
	'/:status',
	passport.authenticate('jwt', { session: false }),
	getAllReportsByStatus
)

export default reportsRoute
