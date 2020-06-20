import setAuthorizationToken from '../utils/setAuthorizationToken';
import { SET_CURRENT_USER } from './types';
import { SET_IS_SIGNUP } from './types';
import { withRouter } from 'react-router-dom';


export function setCurrentUser(user) {
	return {
		type: SET_CURRENT_USER,
		user
	};
}

// export function logout() {
export function logout() {
	return dispatch => {
		localStorage.removeItem('jwtToken');
		setAuthorizationToken(false);
		dispatch(setCurrentUser({}));
		console.log("did authActions.logout");
	}
}

// Know whether user is now signing up
// isSignup true or false
export function setIsSignup(isSignup) {
	return {
		type: SET_IS_SIGNUP,
		isSignup
	};
}

