import { combineReducers } from 'redux';
import flashMessages from './reducers/flashMessages';
import auth from './reducers/auth';
import users from './reducers/users';

const rootReducer = combineReducers({
	flashMessages,
	auth: auth,
	users: users
});

export default rootReducer;
