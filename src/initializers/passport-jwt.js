import passport from 'passport'
import jwt from 'passport-jwt'

import Doctor from '../models/doctor.model.js'
import config from '../config/index.js'
import logger from '../common/logger.js'

const JwtStrategy = jwt.Strategy
const ExtractJwt = jwt.ExtractJwt

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: config.get('jwtSecret')
}

passport.use(
	new JwtStrategy(options, async function (payload, done) {
		try {
			const doctorFound = await Doctor.findById(payload.id)

			if (!doctorFound) {
				return done(null, false)
			}

			return done(null, doctorFound)
		} catch (error) {
			logger.error(error, 'failed to login doctor')
			return done(error, false)
		}
	})
)

/**
 * serializing the doctor to decide which key is to be kept in the cookies
 */
passport.serializeUser(function (doctor, done) {
	done(null, doctor.id)
})

/**
 * deserializing the doctor from the key in the cookies
 */
passport.deserializeUser(async function (id, done) {
	try {
		const user = await User.findById(id)
		return done(null, user)
	} catch (error) {
		logger.error(error, 'could not find user')
		return done(err)
	}
})

/**
 * custom express authentication middleware
 */
passport.checkAuthentication = function (req, res, next) {
	// let request pass through if user is authenticated
	if (req.isAuthenticated()) {
		return next()
	}

	res.status(401).json({
		message: `you're not authorized to access this resource`,
		error: '401 | Unauthorized'
	})
}

export default passport
