import setAuthorizationToken from '../utils/setAuthorizationToken';
import { PUT_STUDENTS_LIST} from './types';
import { withRouter } from 'react-router-dom';

export function putStudentsListInStore(studentsList) {
	return {
		type: PUT_STUDENTS_LIST,
	  studentsList	
	};
}


