import express from 'express';

var knex = require('../db.js');

let router = express.Router();
// const bodyParser = require('body-parser');
const multer = require('multer');
//const uuidv4 = require('uuid/v4'); for random filenames
const path = require('path');
var fs = require('fs-extra'); 
// configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/app/img/userPhotos');
  },
  filename: (req, file, cb) => {
    // The file name will be available as
    // req.file.pathname in the router handler.
    // const newFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    // const newFilename = req.body.teacher + `${path.extname(file.originalname)}`;
    const newFilename = req.body.teacher + '.jpg';
    cb(null, newFilename);
  },
});
const upload = multer({ storage });
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));
router.post('/', upload.single('selectedPhotoFile'), (req, res) => {
  console.log("New photo uploaded for", req.body.teacher, "and named", req.file.filename, ".");
// res.send({});
  knex('teacher')
	  .where('username', req.body.teacher)
	  .update({
			photo: req.file.filename
		})
	  .then(msg => res.json({success: true, msg: msg }))
	  .catch (errors => res.status(500).json({ error: errors}));
});

router.get('/:teacher', (req, res) => {
	console.log("Sending file; req.params: ", req.params);
	const photoFile = req.params.teacher + ".jpg";
	const selfIntroFile = req.params.teacher = ".txt";
	const pathToFile = __dirname + '/../../src/app/img/userPhotos/' + photoFile;
	res.setHeader('Content-disposition', 'attachment; filename=' + photoFile);
	res.download(pathToFile, photoFile, function(error) {
	  if (!error) {
	    fs.unlink(pathToFile);
	  } else {
		  console.log("Error in file download to server: ", error);
		}
	});
});


export default router;
