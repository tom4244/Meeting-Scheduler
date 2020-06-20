import React from "react";
import { withRouter } from "react-router-dom";
import styled from 'styled-components';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import NavButtons from './NavButtons';
import { P, P2, RoundedButton } from './elements';

// This is the 'rooms' component used in the Student Page
// That page is not currently implemented in the scheduler.
//   but is kept for a potential teacher/class scheduler variation.

const HomeButton = withRouter(({ history}) => (
  <RoundedButton
    onClick={() => { history.push('/') }}>
	  Home
	</RoundedButton>
))

const TeacherButton = withRouter(({ history}) => (
  <RoundedButton
    onClick={() => { history.push('/teacherPage') }}>
	  Teacher Page 
	</RoundedButton>
))

        // <H2>{this.match.params.room}</H2>
class Conference extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {

		const { firstname, lastname } = this.props.user;

		return (
    	<ConferencePageStyle>
    	  <NavButtons />
			  <div>
    	  <HomeButton />&nbsp;&nbsp;<TeacherButton/>&nbsp;&nbsp;
		    </div>
    		<P>The 'Conference' page</P>
    		<P2>Current attendees:  { firstname + " " + lastname }</P2>
    		<NewEvent />
    	</ConferencePageStyle>
		);
	}
}

const NewEvent = () => (
	  <NewEventDiv>
	    <NewEventButton/>
	  </NewEventDiv>
)

Conference.PropTypes = {
	user: PropTypes.object.isRequired
}

const mapStateToProps = state => {
	return {
	  user: state.auth.user	
	}
}

const mapDispatchToProps = dispatch => {
	return {

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Conference);

// --- Styling section ---

  // grid-column: 1;
	// grid-row: 2;
const ConferencePageStyle = styled.div`
  display: flex;
	flex-direction: column;
`;

const NewEventButton = withRouter(({ history}) => (
  <RoundedButton
    onClick={() => { history.push('/new-event') }}>
	  New Event 
	</RoundedButton>
))

const NewEventDiv = styled.div`
  display: flex;
	flex-direction: column;
	margin-bottom: 2rem;
`;

/*
const HomeButton = withRouter(({ history }) => (
	<Button color='blue' animated='fade'
	  onClick={() => { history.push('/') }}>
	  <Button.Content visible>
	    <Icon name='home' />
	  </Button.Content>
	  <Button.Content hidden>
	    Go Home
	  </Button.Content>
	</Button>
))
*/

