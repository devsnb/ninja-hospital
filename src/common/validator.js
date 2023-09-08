/**
 * basic custom validator for zod schemas
 * @param {*} schema zod schema
 * @param {*} actual actual object
 * @returns the validation result array with first value of success Result and second being the error
 */
const validator = async (schema, actual) => {
	const result = await schema.safeParseAsync(actual)

	if (!result.success) {
		const formattedErrors = result.error.format()

		const keys = Object.keys(formattedErrors)

		const errors = {}

		for (let key of keys) {
			if (key === '_errors') {
				continue
			}

			errors[key] = formattedErrors[key]?._errors.join(', ')
		}

		return [null, errors]
	}

	return [result.data, null]
}

export default validator
