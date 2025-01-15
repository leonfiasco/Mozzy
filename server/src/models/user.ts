import mongoose from 'mongoose';
import { IUser } from '../types';

const UserSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	firstName: {
		type: String,
		unique: false,
	},
	lastName: {
		type: String,
		unique: false,
	},
	email: {
		type: String,
		unique: true,
	},
	password: { type: String },
	verified: { type: Boolean, default: false },
	resetToken: { type: String, required: false },
	resetTokenExpiration: { type: Date, required: false },
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
