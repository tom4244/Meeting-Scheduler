import React from "react";
import { withRouter } from "react-router-dom";
import styled from 'styled-components';
import { connect } from 'react-redux';

import NavButtons from './NavButtons';
import { Label4, P, P2, RoundedButton, VSpace10px } from './elements';
import StudentClassList from './StudentClassList';
import axios from 'axios';

const HomeButton = withRouter(({ history}) => (
  <RoundedButton
    onClick={() => { history.push('/') }}>
	  Home
	</RoundedButton>
))

class StudentPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			classList: [],
      buttonBgColor: 'DodgerBlue',
			timeForClass: false,
			activeClassIDs: []
		}

		this.updateStudentClassList = this.updateStudentClassList.bind(this);

	}

	updateStudentClassList(student) {
    this.getClassList(student)
		// See if it is time for the first (soonest) class
	  //.then(classes => {
	  .then(data => {
			console.log("returned data in updateStudentClassList: ", data);
			//if (classes.data.classes.length != 0) {
			if (data.data.data.length != 0) {
				this.setState({classList: data.data.data});
        // const timeNow = Date.now();
				// const timeNowMS = timeNow.valueOf();
				const timeNowMS = Date.now().valueOf();
        let classTimeNow = false;
        for (let nextClass of data.data.data) {
          const nextCBTms = new Date(nextClass.classDateTime).valueOf();
					const nextCETms = new Date(nextClass.endTime).valueOf();

					//FIXME this should not only look at the ending time of this class before exiting the loop
					if (timeNowMS > nextCETms) {
						break;
					}
          if ((timeNowMS >= nextCBTms)&&(timeNowMS < nextCETms)) {
						let activeIDs = this.state.activeClassIDs;
						activeIDs.push(nextClass.id);
					  this.setState({
					  	timeForClass: true,
              buttonBgColor: 'springgreen',
					    activeClassIDs: activeIDs
					  }); 
						classTimeNow = true;
					  console.log("It's time for a class");
				  } else if (!(this.state.timeForClass)) {
					  this.setState({
					  	timeForClass: false,
					    buttonBgColor: 'DodgerBlue'
					  });
		      }
			  }
		  }
		})
		.catch(errors => {
			console.log("error in updateStudentClassList in studentPage.js: ", errors);
		});
	};

  getClassList(student) {
  	return axios.get(`/api/studentClasses/${student}`);
  }

  resetLRButtonColor() {
		this.setState({buttonBgColor: 'DodgerBlue'});
	}

	render() {
		
		const { firstname, lastname, roomname } = this.props.user;

    const LessonRoomButton = withRouter(({ history}) => (
      <StatusButton style={{backgroundColor:this.state.buttonBgColor}}
        onClick={() => { history.push("/rooms/" + roomname) }}>
        Whiteboard 
      </StatusButton>
    ))
   
		return (
    	<StudentPageStyle>
			{/* <NavButtons /> 
    	  <HomeButton /> */}
		    <P style={{marginBottom:"10px"}}>Good {greetingTime()}, {this.props.user.username} </P>
    		<P2>Your current appointments:</P2>&nbsp;&nbsp;

		    <GoToRoomDiv>
          <LessonRoomButton />&nbsp;
		      <Label4>The Whiteboard button will turn green <br/>and the whiteboard will become available<br/> when one of the meeting times below is active.</Label4>
		    </GoToRoomDiv>
			  <StudentClassList student={this.props.user.username} updateStudentClassList={this.updateStudentClassList} classList={this.state.classList} timeForClass={this.state.timeForClass} activeClassIDs={this.state.activeClassIDs} resetLRButtonColor={this.resetLRButtonColor}/><br/>
        <VSpace10px/>
			{/* <NewEvent /> */}
    	</StudentPageStyle>
		);
	}
}

const NewEvent = () => (
	  <NewEventDiv>
	    <NewEventButton/>
	  </NewEventDiv>
)

function greetingTime() {
	let today = new Date(),
	   hours = today.getHours();
	if (hours < 12) {
		return "Morning";
	} else if (hours < 18) {
		return "Afternoon";
	} else {
		return "Evening";
	}
};

const mapStateToProps = state => {
	return {
		user: state.auth.user
	}
}

const mapDispatchToProps = dispatch => {
	return {
     
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StudentPage));

// --- Styling section ---

  // grid-column: 1;
	// grid-row: 2;
const StudentPageStyle = styled.div`
  display: flex;
	flex-direction: column;
	background-color: aliceblue;
	margin-left: 20px;
`;

const GoToRoomDiv = styled.div`
  display: flex;
	flex-direction: row;
	width: 100rem;
`

const H2 = styled.h2`
	font-family: 'Quicksand';
	color: blue;
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

const StatusButton = styled(RoundedButton)`
  background-color: this.state.buttonBgColor;
`

