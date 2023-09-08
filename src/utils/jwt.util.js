import jsonwebtoken from 'jsonwebtoken'

import config from '../config/index.js'
import logger from '../common/logger.js'

const SECRET = config.get('jwtSecret')
const JTW_VALIDITY = config.get('jwtValidity')

/**
 * Signs and generates a jwt
 * @param {*} payload data for the jwt payload
 * @returns jwt token
 */
export const signJwt = payload => {
	try {
		const token = jsonwebtoken.sign(payload, SECRET, {
			expiresIn: JTW_VALIDITY
		})

		return token
	} catch (error) {
		logger.error(error, 'failed to sign JWT')
		return null
	}
}

/**
 * Verifies jwt
 * @param {*} token string jwt token
 * @returns the payload if verification is successful
 */
export const verifyJwt = token => {
	try {
		const payload = jsonwebtoken.verify(token, SECRET)
		return payload
	} catch (error) {
		logger.error(error, 'JWT verification failed')
		return null
	}
}
