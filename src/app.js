import express from 'express'

import router from './routes/index.js'

const application = () => {
	const app = express()

	app.use(router)

	return app
}

export default application
