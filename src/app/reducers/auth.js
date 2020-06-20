import { SET_CURRENT_USER } from '../actions/types';
import { SET_IS_SIGNUP } from '../actions/types';
import isEmpty from 'lodash/isEmpty';

const initialState = {
	isAuthenticated: false,
	user: {},
	isSignup: false
};

// export default (state = initialState, action = {}) => {
function auth (state = initialState, action) {
	switch(action.type) {
		case SET_CURRENT_USER:
		  return Object.assign({}, state, {
				  isAuthenticated: !isEmpty(action.user),
				  user: action.user
			});
	  // now signing up? true or false
		case SET_IS_SIGNUP:
			return Object.assign({}, state, {
				isSignup: action.isSignup 
			});
	  default: return state;
  };
}

export default auth;
