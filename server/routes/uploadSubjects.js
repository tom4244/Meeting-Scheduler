import express from 'express';

var knex = require('../db.js');

let router = express.Router();

router.post('/', (req, res) => {
	console.log("uploadSubjects req.body: ", req.body, "  req.params: ", req.params);
  console.log("Subjects uploaded for", req.body.teacher);
// res.send({});
  knex('teacher')
	  .where('username', req.body.teacher)
	  .update({
			subjects: req.body.subjects
		})
	  .then(msg => res.json({success: true, msg: msg }))
	  .catch (errors => res.status(500).json({ error: errors}));
});

router.get('/:teacher', (req, res) => {
	console.log("Getting teacher subjects; req.params: ", req.params);
  knex('teacher')
	  .select('subjects')
	  .where('username', req.params.teacher)
	  .then(data => {
			console.log("data in uploadSubjects get: ", data);
			res.json({data});
		})
	  .catch(errors => {
			console.log("Errors in uploadSubjects get: ", errors);
      res.status(500).json(errors);
		});

});


export default router;
