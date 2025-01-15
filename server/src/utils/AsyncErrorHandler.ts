import { Response, Request, NextFunction } from 'express';

const asyncErrorHandler =
	(controller: Function) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await controller(req, res);
		} catch (error) {
			return next(error);
		}
	};

export default asyncErrorHandler;
