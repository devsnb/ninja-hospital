import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema(
	{
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Doctor'
		},
		status: {
			type: String,
			enum: [
				'Negative',
				'Travelled - Quarantine',
				'Symptoms - Quarantine',
				'Positive - Admit'
			]
		},
		patient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Patient'
		},
		doctor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Doctor'
		}
	},
	{
		timestamps: true
	}
)

const Report = mongoose.model('Report', reportSchema)

export default Report
