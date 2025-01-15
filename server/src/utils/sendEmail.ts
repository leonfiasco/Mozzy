import nodeMailer from 'nodemailer';
import { IUser } from '../types';

export const sendEmail = async (user: IUser, subject: string, html: string) => {
	try {
		const transporter = nodeMailer.createTransport({
			service: `${process.env.SERVICE}`,
			host: process.env.HOST,
			port: 587,
			auth: {
				user: process.env.AUTH_EMAIL,
				pass: process.env.AUTH_PASSWORD,
			},
		});

		await transporter.sendMail({
			to: user.email,
			from: process.env.AUTH_EMAIL,
			subject,
			html,
		});

		console.log('Email sent successfully!!');
	} catch (error) {
		console.error('Verification email failed:', error);

		throw error;
	}
};
