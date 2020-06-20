import React from 'react';
import { withRouter } from 'react-router-dom';
import { ErrorMsg, Form, Input, RoundedButton, TextArea } from './elements';
import validateInput from '../../../server/shared/validations/login';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import axios from 'axios';
import { setCurrentUser } from '../actions/authActions';
// import { login } from '../actions/authActions';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import jwtDecode from 'jwt-decode';
import styled from 'styled-components';

class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			identifier: '',
			password: '',
			errors: {},
			isLoading: false
		}

		this.onSubmit = this.onSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
	}

  isValid() {
  	const { errors, isValid } = validateInput(this.state);
  
  	if (!isValid) {
  		this.setState({ errors });
  	}
  
  	return isValid;
  }

  onSubmit(e) {
  	e.preventDefault();
  	if (this.isValid()) {  // only checks for empty fields
  		this.setState({ errors: {}, isLoading: true });
  		login(this.state)
  		// this.props.login(this.state)
  			.then( (person) => {
					 if(person.is_teacher) {
						    let prevLocation = "";
						    this.props.history.listen(nextLocation => {
									prevLocation = nextLocation.pathname;
								});
							  this.props.history.push('/teacherPage')}
					 else if(person.is_student) {
							  this.props.history.push('/studentPage')}
					 else {
    		        console.log(this.state.identifier, " is neither a student nor a teacher");
						  }
			      this.props.setUser(person);
				})
  			.catch((error) => {
  				console.log("loginForm.js onSubmit error: ", error);
  			  this.setState({ errors: error, isLoading: false })
  			});
  	}
	}

  onChange(e) {
  	this.setState({ [e.target.name]: e.target.value });
  }
  
 	render() {
  		const { errors, identifier, password, isLoading } = this.state;
  		// console.log('typeof errors = ', typeof errors);
  		return (
  			<Form onSubmit={this.onSubmit}>
  			
  			<PleaseText>Please log in</PleaseText>
				{ errors.form && <ErrorMsg>{errors.form}</ErrorMsg>}
          <UsernameInput
  			    name='identifier'
  			    placeholder='Username / Email'
  			    value={identifier}
  			    error={errors.identifier}
  			    onChange={this.onChange}
          />
          { errors.identifier && <ErrorMsg>{errors.identifier}</ErrorMsg>}
  
          <PasswordInput
  			    name='password'
  			    placeholder='Password'
  			    value={password}
  			    error={errors.password}
  			    onChange={this.onChange}
  			    type='password'
          />
          { errors.password && <ErrorMsg>{errors.password}</ErrorMsg>}
  
          <LoginButton disabled={isLoading}>Log In</LoginButton>
  			</Form>
  	 );
  }
}

LoginForm.propTypes = {
	// login: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
	setUser: PropTypes.func.isRequired
}

// This has the header jwt token decoded on the server
//   and sets the result (user) in the redux state as the 
//   current user with id, username, and 'iat'
// export var login = (data, res) => {
export function login(data, res) {
	return axios.post('/api/auth', data)
		.then(res => {
	  	const token = res.data.token;
	  	// maybe sessionStorage would be better here
	  	// or why not just keep it in the redux store?
	  	localStorage.setItem('jwtToken', token);
	  	setAuthorizationToken(token);
	  	///// dispatch(setCurrentUser(jwtDecode(token)));
	  	///*********ADD USER DATA TO THAT ***********
	    const decodedToken = jwtDecode(token);	
	  	const { id, username, iat } = decodedToken;
	  	const user = {
	  		id: id,
	  		username: username,
	  		iat: iat,
	  	  firstname: res.data.firstname,
	  	  lastname: res.data.lastname,
	  	  roomname: res.data.roomname,
	  	  is_student: res.data.is_student,
	  	  is_teacher: res.data.is_teacher,
				subjects: res.data.subjects
	  	}	
	  	return(user);
	})
	.catch((error) => {
		console.log("login function error: ", error)
	})
}

const mapStateToProps = state => {
	return {
    user: state.auth.user 
	}
}

const mapDispatchToProps = dispatch => {
	return {
//		login: () => { dispatch(login) }
//		login: login 
		setUser: (user) => { dispatch(setCurrentUser(user)) }
	}
}

// export default withRouter(LoginForm);
// export default connect(null, { login })(LoginForm);
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginForm));

// --- Styling ---

const PleaseText = styled(TextArea)`
  display: flex;
  justify-content: center;
	margin-top: 10rem;
`;

const UsernameInput = styled(Input)`
  margin-bottom: 1.0rem;
`;

const PasswordInput = styled(Input)`
  margin-bottom: 1.0rem;
`;

const LoginButton = styled(RoundedButton)`
  flex: 1 100%;
`;

