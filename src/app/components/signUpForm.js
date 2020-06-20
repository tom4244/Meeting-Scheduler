import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { setCurrentUser, setIsSignup } from '../actions/authActions';
import validateInput from '../../../server/shared/validations/signup';
import { connect } from 'react-redux';
// import { login } from '../actions/authActions';
import { login } from './loginForm.js';
import { ErrorMsg, Form, Input, media, RoundedButton, TextArea, CenteredText, CheckboxLabel, VSpace10px } from './elements';
import axios from 'axios';
import base64url from 'base64url';

class SignUpForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			firstname: '',
			lastname: '',
			roomname: '',
      username: '',
			email: '',
			identifier: '',
			password: '',
			confirmpass: '',
			is_student: false,
			is_teacher: true,
			errors: {},
      isLoading: false,
			invalid: false,
			selectedOption: 'is_student',
			subjects: ''
		}

  console.log("this.props: ", this.props);
  this.handleChange = this.handleChange.bind(this);
	this.handleis_student = this.handleis_student.bind(this);
	this.handleis_teacher = this.handleis_teacher.bind(this);
  this.onSubmit = this.onSubmit.bind(this);
	this.checkUserExists = this.checkUserExists.bind(this);
	}
  
	
	handleChange(e) {
  	this.setState({ [e.target.name]: e.target.value });
  }
  	
	handleOptionChange(event) {
    this.setState({ 
			selectedOption: event.target.value,
      is_student: !this.state.is_student,
  	  is_teacher: !this.state.is_teacher
  	});
  }
/*	
   this.setState({
		  is_teacher: true,
		  is_student: false
	  })
*/			  
	handleis_student(e) {
    this.setState({is_student: !this.state.is_student});
	}
	
	handleis_teacher(e) {
    this.setState({is_teacher: !this.state.is_teacher});
	}

  isValid() {
  	const {errors, isValid } = validateInput(this.state);
  	if (!isValid) {
  		this.setState({ errors });
  	}
    return isValid;
  }

  isUserExists(identifier) {
    return axios.get(`/api/users/${identifier}`);
  }

	checkUserExists(e) {
  	const field = e.target.name;
   	const val = e.target.value;
   	if (val !== '') {
   		this.isUserExists(val).then(res => {
				console.log("isUserExists res: ", res);
   			let errors = this.state.errors;
   			let invalid;
   			if (res.data.user.length != 0) {
					console.log("res.data: ", res.data);
   				errors[field] = 'Someone has already chosen that ' + field;
           invalid = true;
        } else {
   				errors[field] = '';
   				invalid = false;
   			}
   			this.setState({ errors, invalid });
   		});
   	}
   }

  onSubmit(e) {
    e.preventDefault();
    if (this.isValid()) {
			this.setState({ errors: {}, isLoading: true });
			this.state.identifier = this.state.username;
		  const loginData = this.state;
			const loginProps = this.props;
			this.props.setIsSigningUp(true);
  		userSignUpRequest(this.state)
		    .then(function (returned) {

			    login(loginData)
    	      .then(user => {
  		      	if (user.is_teacher) {
							  loginProps.history.push('/teacherPage');
							}
							if (user.is_student) {
							  loginProps.history.push('/studentPage');
							}
							if (!user.is_student && !user.is_teacher) {
                console.log("Error in signUpForm. ", loginData.username, " is neither a student nor a teacher");
  		      	}
              loginProps.setUser(user);
              loginProps.addFlashMessage({
                type: 'success',
                  text: 'You signed up successfully. Welcome!'
              })  
			      })
    	      .catch((error) => {
    	      	console.log("signUpForm.js login error: ", error);
    	        this.setState({ errors: error, isLoading: false })
    	      });
        })
    	  .catch((error) => {
    	    console.log("signUpForm.js userSignUpRequest error: ", error);
    	    this.setState({ errors: error, isLoading: false })
    	  });
	   }	
	 }
/* 
            		const dataString = '{"teacher":"' + this.props.teacher + '", "subjects":"' + this.state.subjects + '"}';
            		
            		axios.post('/api/uploadSubjects', JSON.parse(dataString))
                  .then((result) => {
            				console.log("result in handleSubjectsClick: ", result);
                  })
            	    .catch (errors => console.log("Errors in handleSubjectsClick: ", errors));
*/
/*
        })
  		  .catch((error) => {
			  	console.log("error: ", error);
          this.setState({ errors: error.response.data, isLoading: false })
  		});
		}
  }
*/

	render() {
		const { errors } = this.state;
		const personis_teacher = false;
    const subjectsInput = this.state.is_teacher ?  
			<React.Fragment>
        <CenteredText style={{fontSize: "1.2rem"}}>Here you can optionally list meeting types you commonly attend to be displayed with your info (you can change this later):</CenteredText>
			  <VSpace10px/>
			  { errors.subjects && 
					 <ErrorMsg>{errors.subjects}</ErrorMsg>} 
			  <SubjectsInput 
			    value={this.state.subjects} 
			    onChange={this.handleChange}
			    type='text' 
			    name='subjects' 
			    placeholder='Subjects' 
			  />
			</React.Fragment>
			: null;

		return (
			<Form onSubmit={this.onSubmit}>
			  <TextArea><br /><br /><br />Please choose a user name and password and provide an email address to join this service. We are happy to have you with us!<br /><br /></TextArea>
			  { errors.firstname && 
					 <ErrorMsg>{errors.firstname}</ErrorMsg>} 
			  <FirstNameInput 
			    value={this.state.firstname} 
			    onChange={this.handleChange}
			    type='text' 
			    name='firstname' 
			    placeholder='First Name' 
			  />

			  { errors.lastname && 
					 <ErrorMsg>{errors.lastname}</ErrorMsg>} 
			  <LastNameInput 
			    value={this.state.lastname} 
			    onChange={this.handleChange}
			    type='text' 
			    name='lastname' 
			    placeholder='Last Name' 
			  />
			
			  { errors.username && 
					 <ErrorMsg>{errors.username}</ErrorMsg>} 
			  <UserNameInput 
			    value={this.state.username} 
			    onChange={this.handleChange}
			    onBlur={this.checkUserExists}
			    type='text' 
			    name='username' 
			    placeholder='Username/Nickname' 
			  />
			
			  { errors.email && 
					 <ErrorMsg>{errors.email}</ErrorMsg>} 
			  <EmailInput 
			    value={this.state.email} 
			    onChange={this.handleChange}
			    onBlur={this.checkUserExists}
			    type='text' 
			    name='email' 
			    placeholder='Email' 
			  />

			  { errors.password && 
					 <ErrorMsg>{errors.password }</ErrorMsg>} 
			  <PasswordInput 
			    value={this.state.password} 
			    onChange={this.handleChange}
			    type='password' 
			    name='password' 
			    placeholder='Password' 
			  />

			  { errors.confirmpass && 
					 <ErrorMsg>{errors.confirmpass }</ErrorMsg>} 
			  <ConfPasswdInput 
			    value={this.state.confirmpass} 
			    onChange={this.handleChange}
			    name='confirmpass' 
			    type='password' 
			    placeholder='Please Repeat Password' 
			  />
			{/*  Teacher and Student Mode menu 
			  <RadioButtonLine>
  			  <CenteredText>I am a </CenteredText>
			    &nbsp;&nbsp;&nbsp;&nbsp;
		    
		    { errors.is_student && 
					 <ErrorMsg>{errors.is_student}</ErrorMsg>} 
			    <CheckboxLabel htmlFor='is_student'>
  			    <input type="radio" name='studentOrTeacher' value='is_student' id='is_student' checked={this.state.selectedOption === 'is_student'} onChange={this.handleOptionChange.bind(this)} />
		        Student</CheckboxLabel>
			    &nbsp;&nbsp;&nbsp;&nbsp;

			  { errors.is_teacher && 
					 <ErrorMsg>{errors.is_teacher}</ErrorMsg>} 
			    <CheckboxLabel htmlFor='is_teacher'>
  			    <input type="radio" name='studentOrTeacher' value='is_teacher' id='is_teacher' checked={this.state.selectedOption === 'is_teacher'} onChange={this.handleOptionChange.bind(this)}/>
			      Teacher</CheckboxLabel>
			  
			</RadioButtonLine>
        <VSpace10px/>
*/}

        {subjectsInput} 

			  <SignUpButton disabled={this.state.isLoading || this.state.invalid }>Sign Up</SignUpButton>

			</Form>
		);
	}
}

SignUpForm.propTypes = {
	history: PropTypes.object.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	setUser: PropTypes.func.isRequired,
	setIsSigningUp: PropTypes.func.isRequired
};

async function userSignUpRequest(userData) {
  let res = await axios.post('/api/users', userData);
}
 
const mapStateToProps = state => {
	return {
		user: state.auth.user,
		isSignup: state.auth.isSignup
	}
}

const mapDispatchToProps = dispatch => {
	return {
    setUser: (user) => { dispatch(setCurrentUser(user)) },
		setIsSigningUp: (isSignup) => { dispatch(setIsSignup(isSignup))}
	}
}

// Wait for file to exist, checks every 2 seconds
/*
function getFile(path, timeout) {
    const timeout = setInterval(function() {

        const file = path;
        const fileExists = fs.existsSync(file);

        console.log('Checking for: ', file);
        console.log('Exists: ', fileExists);

        if (fileExists) {
            clearInterval(timeout);
        }
    }, timeout);
};
*/
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUpForm));
// --- Styling ---

const FirstNameInput = styled(Input)`
`;

const LastNameInput = styled(Input)`
`;

const UserNameInput = styled(Input)`
`;

const EmailInput = styled(Input)`
`;

const PasswordInput = styled(Input)`
`;

const ConfPasswdInput = styled(Input)`
`;

const SubjectsInput = styled(Input)`
  width: 500px
`;

const SignUpButton = styled(RoundedButton)`
flex: 1 100%;
margin-top: 1rem;
`;

const RadioButtonLine = styled.div`
  display: flex;
	flex-direction: row;
`

