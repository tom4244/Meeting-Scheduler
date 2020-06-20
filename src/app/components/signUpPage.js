import React from 'react';
import SignUpForm from './signUpForm';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { addFlashMessage } from '../actions/flashMessages';

class SignUpPage extends React.Component {
	render() {
    const { addFlashMessage } = this.props;
		return (
			<SignUpForm 
			  history = { this.props.history }
			  addFlashMessage={addFlashMessage}
			/>
		);
	}
}

SignUpPage.propTypes = {
  addFlashMessage: PropTypes.func.isRequired,
}

// let boundUserSignUpRequest = bindActionCreators(userSignUpRequest, dispatch);
/*
function mapDispatchToProps(dispatch){
	return bindActionCreators({userSignUpRequest, addFlashMessage }, dispatch);
}
*/
// export default connect(null, mapDispatchToProps)(SignUpPage);

// export default connect(null, { userSignUpRequest, addFlashMessage, isUserExists })(SignUpPage);
export default connect(null, { addFlashMessage })(SignUpPage);

