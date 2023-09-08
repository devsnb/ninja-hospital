import express from 'express'
import passport from 'passport'

import router from './routes/index.js'
import './initializers/passport-jwt.js'

const application = () => {
	const app = express()

	// parse incoming request
	app.use(express.urlencoded({ extended: false }))
	app.use(express.json())

	// setup passport
	app.use(passport.initialize())

	// register all routes
	app.use(router)

	return app
}

export default application
