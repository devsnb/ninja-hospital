import application from './app.js'
import config from './config/index.js'
import logger from './common/logger.js'

const main = () => {
	const PORT = config.get('port')

	// bootstrap the application
	const app = application()

	app.listen(PORT, () => {
		logger.info(`application started on port: ${PORT}`)
	})
}

main()
