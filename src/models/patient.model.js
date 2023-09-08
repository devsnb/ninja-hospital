import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		phoneNumber: {
			type: String,
			required: true,
			unique: true
		},
		doctor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Doctor',
			required: true
		},
		reports: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Report'
			}
		]
	},
	{
		timestamps: true
	}
)

const Patient = mongoose.model('Patient', patientSchema)

export default Patient
