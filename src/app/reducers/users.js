import { PUT_STUDENTS_LIST } from '../actions/types';

const initialState = {
	studentsList: {}
};

// export default (state = initialState, action = {}) => {
function users(state = initialState, action) {
	switch(action.type) {
		case PUT_STUDENTS_LIST:
		  return Object.assign({}, state, {
				  studentsList: action.studentsList
			});
	  default: return state;
  };
}

export default users;
