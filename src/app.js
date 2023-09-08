import express from 'express'

import router from './routes/index.js'

const application = () => {
	const app = express()

	// parse incoming request
	app.use(express.urlencoded({ extended: false }))
	app.use(express.json())

	app.use(router)

	return app
}

export default application
