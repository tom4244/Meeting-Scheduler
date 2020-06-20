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
router.get('/:teacher', (req, res) => {
		//		$eq: "2018-05-14T23:00:00.000Z"
const now = new Date();
//console.log("now: ", now, "   now.getTime: ", now.getTime());
/*
session.findAll({
	where: {
		teacher: req.params.teacher,
		endTime: {
			[Op.lt]: now
		},
	},
	order: [
		['classDateTime', 'DESC'],
	]
})
*/
  knex('session')
	  .where('mtg_requester', req.params.teacher)
		.andWhere('endtime', '<', now)
	  .orderBy('class_datetime', 'desc')

.then( sessions => {
	res.json({ sessions });
})
.catch (errors => res.status(500).json({ error: errors}));

});

export default router;

