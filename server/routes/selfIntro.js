import express from 'express';
var fs = require('fs-extra');
var knex = require('../db.js');

let router = express.Router();

//const uuidv4 = require('uuid/v4'); for random filenames
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));
router.post('/', (req, res) => {
	console.log("selfIntro.js req.body: ", req.body);
  //// fs.writeFile('../selfIntros/' + req.body.teacher + '.txt', req.body.selfIntro)  
  fs.writeFile(__dirname + '/../selfIntros/' + req.body.teacher + '.txt', req.body.selfIntro)  
/*	
	.then((result) => {
	  console.log('SelfIntro saved.')

    knex('teacher')
  	  .where('username', req.body.teacher)
  	  .update({
  			selfIntro: req.body.teacher + ".txt"
  		})
*/
  	  .then(msg => res.json({success: true, msg: msg }))
  	  .catch (errors => res.status(500).json({ error: errors}));
   //})
   //.catch (errors => res.status(500).json({ error: errors}));
});

router.get('/:teacher', (req, res) => {
	// console.log("req.params.teacher in selfIntro: ", req.params.teacher);
  // fs.readFile('../selfIntros/' + req.params.teacher + '.txt', 'utf8') 
  fs.readFile(__dirname + '/../selfIntros/' + req.params.teacher + '.txt', 'utf8') 
  .then(text => {
		// console.log("Text from selfIntro.js: ", text);
    res.json({text})
	})
   .catch (errors => res.status(500).json({ error: errors}));
});	

export default router;
