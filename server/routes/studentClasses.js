import express from 'express';

let router = express.Router();

var knex = require('../db.js');

router.get('/:student', (req, res) => {
  
  //	"2018-05-14T23:00:00.000Z"
	  const now = new Date();
	
	// console.log("req.params.student in studentClasses.js: ", req.params.student)
  // knex('session')
	const studentName = "%" + req.params.student + "%";
  knex
	  .select('session.id', 'session.subject', 'session.students_string', 'session.first_names_string', 'session.weekday', 'session.class_datetime', 'session.endtime', 'session.week_number', 'session.number_of_weeks', 'session.selected_weekdays', 'session.mtg_requester', 'teacher.email', 'teacher.username', 'teacher.firstname', 'teacher.lastname') 
	  .from('session')
	  .leftJoin('teacher', 'session.mtg_requester', '=', 'teacher.username')

	  .where('session.students_string', 'like', studentName)
	  .andWhere('session.endtime', '>', now)
    .orderBy('session.class_datetime', 'asc')

	.then( data => {
		// console.log("data from studentClasses.js: ", data);
		res.json({ data });
	})
	.catch(errors => res.status(500).json({ error: errors }));

});

export default router;

//    These methods of adding the multiple rows didn't work
//    let rowsToAdd = classes.collections.forge(saveArray);
//	  rowsToAdd.invokeThen('save', null) 
//    Promise.mapSeries(function(saveArray) {classes.forge(saveArray, { hasTimestamps: true }).save()}) 
//    async await in a for of loop is working well so far
	   
