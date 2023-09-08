import express from 'express'

import doctorsRoute from './doctors.route.js'
import patientsRoute from './patients.route.js'
import reportsRoute from './reports.route.js'

const router = express.Router()

router.use('/doctors', doctorsRoute)
router.use('/patients', patientsRoute)
router.use('/reports', reportsRoute)

export default router
