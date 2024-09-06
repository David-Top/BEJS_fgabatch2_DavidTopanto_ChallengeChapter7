const multer = require('multer');

const PIC = {
	profile: multer({
		storage: multer.memoryStorage(),
		fileFilter: (req, file, cb) => {
			const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

			if (allowedTypes.includes(file.mimetype)) {
				cb(null, true);
			}else{
				const err = new Error(
					`${allowedTypes.join(', ')} type only`
				);
				cb(false, err);
			}
		},
		limits: {
			fileSize: 2 * 1024 * 1024 //2mb
		},
		onError: (err, next) => {
			next(err);
		}
	}),

	post: multer({
		storage: multer.memoryStorage(),
		fileFilter: (req, file, cb) => {
			const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

			if (allowedTypes.includes(file.mimetype)) {
				cb(null, true);
			}else{
				const err = new Error(
					`${allowedTypes.join(', ')} type only`
				);
				cb(false, err);
			}
		},
		limits: {
			fileSize: 5 * 1024 * 1024 //2mb
		},
		onError: (err, next) => {
			next(err);
		}
	})
}

module.exports = PIC;