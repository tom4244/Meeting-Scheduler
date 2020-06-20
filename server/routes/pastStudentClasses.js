import express from 'express';

var knex = require('../db.js');

let router = express.Router();
/*
function getDayNumber(weekday) {
	const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  for (let dayNumber in dayNames) {
		if (weekday === dayNames[dayNumber]) {
			return dayNumber;
		}
	}
}
*/
router.get('/:student', (req, res) => {
		//		$eq: "2018-05-14T23:00:00.000Z"
  const now = new Date();
  	
  // console.log("now: ", now, "   now.getTime: ", now.getTime());
	const studentName = "%" + req.params.student + "%";
  knex
	  .select('session.id', 'session.subject', 'session.students_string', 'session.first_names_string', 'session.weekday', 'session.class_datetime', 'session.endtime', 'session.week_number', 'session.number_of_weeks', 'session.selected_weekdays', 'session.mtg_requester', 'teacher.email', 'teacher.username', 'teacher.firstname', 'teacher.lastname') 
	  .from('session')
	  .leftJoin('teacher', 'session.mtg_requester', 'teacher.username')
	  .where('session.students_string', 'like', studentName)
	  .andWhere('session.endtime', '<', now)
    .orderBy('session.class_datetime', 'desc')

  .then( sessions => {
		// console.log("sessions: ", sessions);
  	res.json({ sessions });
  })
	.catch(errors => res.status(500).json({ error: errors }));
});

export default router;

