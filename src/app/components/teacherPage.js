import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import styled from 'styled-components';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import NavButtons from './NavButtons';
import ScheduleClasses from './ScheduleClasses';
import ListClasses from './ListClasses';
import { Label, Label4, P, P2, RoundedButton, VSpace10px, media } from './elements';
import 'react-tippy/dist/tippy.css';
import {Tooltip} from 'react-tippy';
import axios from 'axios';
import UploadUserInfo from './UploadUserInfo';

const HomeButton = withRouter(({ history}) => (
  <RoundedButton
    onClick={() => { history.push('/') }}>
	  Home
	</RoundedButton>
))

class TeacherPage extends React.Component {
	constructor(props) {
		super(props);
    this.state = {
      buttonBgColor: 'DodgerBlue',
			activeClassIDs: [],
			overlapIDNumbers: [],
			classList: [],
			timeForClass: false,
			gettingDataText: "Now retrieving meeting data",
		}

		this.getClassList = this.getClassList.bind(this);
		this.highlightOverlapLines = this.highlightOverlapLines.bind(this);
		this.clearOverlapIDNumbers = this.clearOverlapIDNumbers.bind(this);
		this.resetLRButtonColor = this.resetLRButtonColor.bind(this);
		this.isMeetingOnNow = this.isMeetingOnNow.bind(this);
	}; 
	
	isMeetingOnNow(sessions) {
		// console.log("running isMeetingOnNow");
		const timeNowMS = Date.now().valueOf();
    let classTimeNow = false;
      // for (let nextClass of sessions) {
		  // classes are sorted, so looking at the first class only
		const nextClass = sessions[0];
    const nextCBTms = new Date(nextClass.class_datetime).valueOf();
		const nextCETms = new Date(nextClass.endtime).valueOf();

    if ((timeNowMS >= nextCBTms)&&(timeNowMS < nextCETms)) {  // if mtg is going on now
			let activeIDs = this.state.activeClassIDs;
			activeIDs.push(nextClass.id);
		  this.setState({
		  	timeForClass: true,
        buttonBgColor: 'green',
		    activeClassIDs: activeIDs
		  }); 
			classTimeNow = true;
		  // console.log("It's now time for a scheduled class");
		} else {
		  this.setState({
		  	timeForClass: false,
		    buttonBgColor: 'DodgerBlue'
		  });
		}
	};

  async getClassList(teacher) {
		let classes = [];
		console.log("teacher in getClassList: ", teacher);
		try {
  	   classes = await axios.get(`/api/classes/${teacher}`);
			if (classes.data.sessions.length != 0) {
				     this.setState({classList: classes.data.sessions});
			}
		} catch(errors) {
			console.log("Error in getClassList in teacherPage.js");
		}
	  return(classes);
  };

	highlightOverlapLines(IDNumber) {
    let numbers = this.state.overlapIDNumbers;
		numbers.push(IDNumber);
		this.setState({overlapIDNumbers: numbers});
	}

  clearOverlapIDNumbers() {
    this.setState({overlapIDNumbers: []})
	}

  resetLRButtonColor() {
		this.setState({buttonBgColor: 'DodgerBlue'});
	}

	render() {

		const { firstname, lastname, roomname } = this.props.user;
    
   const WhtBdButton = withRouter(({ history}) => (
     <WhiteboardButton style={{backgroundColor: this.state.buttonBgColor}}
       onClick={() => { history.push('/whiteboard') }}> Whiteboard 
   	 </WhiteboardButton>
   ))
		return (
    	<TeacherPageStyle>
		    <P style={{marginBottom:"10px"}}>Good {greetingTime()}, {this.props.user.username} </P>
          <WhtBdButton style={{backgroundColor:this.state.buttonBgColor, margins:0}} />
		      <P2 style={{padding:0, margins:0}}>The Whiteboard button will turn <span style={{color:'green'}}> green </span>when one of the meeting times below is active.</P2>

			  <P2>{this.state.gettingDataText}</P2>

			  <ListClasses teacher={this.props.user.username} classList={this.state.classList} getClassList={this.getClassList} gettingDataText={this.state.gettingDataText} isMeetingOnNow={this.isMeetingOnNow} timeForClass={this.state.timeForClass} activeClassIDs={this.state.activeClassIDs} overlapIDNumbers={this.state.overlapIDNumbers} resetLRButtonColor={this.resetLRButtonColor}/><br/>

			  <ScheduleClasses teacher={this.props.user.username} classList={this.state.classList} getClassList={this.getClassList} overlapIDNumbers={this.state.overlapIDNumbers} highlightOverlapLines={this.highlightOverlapLines} clearOverlapIDNumbers={this.clearOverlapIDNumbers}/>&nbsp;&nbsp;
        <VSpace10px/>

			  { this.props.user.username ? 
        <UploadUserInfo teacher={this.props.user.username} subjects={this.props.user.subjects} />
					: null }
        <VSpace50px/>
        <VSpace50px/>

    	</TeacherPageStyle>
		);
	}
}

TeacherPage.propTypes = {
  user: PropTypes.object.isRequired
}

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

function getDateTimeNow() {  // Not currently using this
  let now = new Date();
  const allWeekdays	= ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	let dateTimeString = allWeekdays[now.getDay()] + ", " + now.toLocaleString('en-CA');
  return dateTimeString;
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeacherPage));

// --- Styling section ---

const TeacherPageStyle = styled.div`
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

const H3 = styled.h3`
	font-family: 'Quicksand';
	color: blue;
`;

const NewEventDiv = styled.div`
  display: flex;
	flex-direction: column;
	margin-top: 2rem;
	margin-bottom: 2rem;
`;

const VSpace50px = styled.div`
  height: 50px;
`

const WhiteboardButton = styled.button`
		width: 180px;
		height: 3em;
		margin: 0.0rem;
		padding: 0px;
		color: white;
		font-weight: bold;
		font-family: 'Quicksand';
		font-size: 16px;
		border: 0px solid black;
		border-radius: 5px;
	  cursor: pointer;
    ${media.phone`font-size: 14px;`}
    ${media.phone`width: 100px;`}
    ${media.phone`height: 34px;`}
		&:hover {
		  background-color: white;
		  color: yellow;
		  border: 1px solid green; 
		}
		&:disabled { 
		  background-color: #90ff1e;
		  color: white;
		  border: 0px solid black; 
		}
`;

