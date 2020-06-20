import express from 'express';
import commonValidations from '../shared/validations/signup';
import bcrypt from 'bcryptjs';
import isEmpty from 'lodash/isEmpty';
import base64url from 'base64url';
import fs from 'fs-extra';

var knex = require('../db.js');
var crypto = require('crypto');

let router = express.Router();

function validateInput(data, otherValidations) {
	let { errors } = otherValidations(data);
/*
	return user.findOne({
		where: {
      [Op.or]: [
				{ username: data.username },
				{ email: data.email }
			]
		}
	})
*/

  return knex('user')
	  .where({username: data.username})
	  .orWhere({email: data.email})

		.then(user => {
  	if (user) {
  		if (user.username == data.username) {
  			errors.username = 'Someone already chose that username.';
  		}
  		if (user.email == data.email) {
  			errors.email = 'There is already an account with that email address.';
  		}
  	}
	  console.log("usersjs errors: ", errors, "  isEmpty(errors): ", isEmpty(errors));
  	return {
  		errors,
  		isValid: isEmpty(errors)
  	};
  })
}
  
function randomStringAsBase64Url(size) {
  return base64url(crypto.randomBytes(size));
}

router.get('/', (req, res) => {
//	console.log("req at users.js:50: ", req);
/*
	user.findAll({
		attributes: ['id', 'username', 'email', 'firstname', 'lastname' ],
    order: [['username', 'ASC']]
  })
*/

  knex
		.select('username', 'email', 'roomname', 'firstname', 'lastname')
		// .from('user')
		.from('teacher')
	  .orderBy('username', 'asc')
	  // .toSQL().toNative()

	.then(participantsList => {
		res.json({ participantsList });
	})
});

router.get('/:identifier', (req, res) => {
/*
  user.findOne({
		attributes: ['username', 'email', 'roomname', 'firstname', 'lastname' ],
		where: {
			[Op.or]: [
				{ username: req.params.identifier },
				{ email: req.params.identifier }
			]
		}
	})
*/

	knex
		.select('username', 'email', 'roomname', 'firstname', 'lastname')
		.from('user')
	  .where({username: req.params.identifier})
	  .orWhere({email: req.params.identifier})
	  .orderBy('username', 'asc')

		.then(user => {
			console.log("user in users.js: ", user);
		res.json({ user });
	})
});

//This is the userSignUpRequest
router.post('/', (req, res) => {
	// const { errors, isValid } = validateInput(req.body);
	
	console.log("validateInput req.body: ", req.body);
	validateInput(req.body, commonValidations)
		.then(({ errors, isValid }) => {
			console.log("users.js after validateInput errors: ", errors, "   isValid: ", isValid);
    	if (!isValid) { 
  			errors = errors + "Input not valid in users.js";
    		console.log("Input not valid in users.js");
  			res.status(400).json(errors);
    	}
			console.log("Input was valid in users.js");
			const userdata = req.body;
      userdata.roomname = randomStringAsBase64Url(8);
	  	const { username, password, email, firstname, lastname, is_student, is_teacher, roomname, subjects } = userdata;
	    const password_digest = bcrypt.hashSync(password, 10);
      console.log("password was hashed by bcrypt and is in the password_digest");
			if (is_student) {
				console.log("is_student is true");
        knex('user')
				.insert({username: username, email: email, password_digest: password_digest, firstname: firstname, lastname: lastname, roomname: roomname}) 

				.then(user => res.json({ success: true }))
	  	  .catch(err => res.status(500).json({ error: err }));
			} else {
				console.log("is_student is false");
				//Make a new teacher entry in the database

         fs.copy(__dirname + '/../../src/app/img/userPhotos/anonymous.jpg', __dirname + '/../../src/app/img/userPhotos/' + username + '.jpg')
         fs.copy(__dirname + '/../selfIntros/anonymous.txt', __dirname + '/../selfIntros/' + username + '.txt')
				 .then(() => {
									console.log("anonymous photo and self-intro files copied")
				 })
         .catch(error => {
					 console.log("Error in users.js during fs.copy: ", error)
				 });

        knex('teacher')
				  .insert({username: username, email: email, password_digest: password_digest, firstname: firstname, lastname: lastname, roomname: roomname, subjects: subjects, self_intro: username + '.txt', photo: username + '.jpg'}) 

				.then(user => res.json({ success: true }))
	  	  .catch(err => res.status(500).json({ error: err }));
			}

		})
	  .catch(err => res.status(508).json({ error: err }));

});

export default router;

