import React from 'react';
import { InputBlue, Label, Label3, Label4, P, P2, P3, RoundedButton, VSpace10px } from './elements';
import styled from 'styled-components'; 
import { PropTypes } from 'prop-types';
import axios from 'axios';

class StudentClassList extends React.Component {
	constructor(props) {
		super(props);
  this.state = {
		enteredNumbers: "",
		cancelIDNumbers: [],
		showPastBtnText: "See Past Sessions",
		pastClassList: [],
		displayPastClasses: false
	}

	this.handlePastClassesChoice = this.handlePastClassesChoice.bind(this);
  this.getPastClassList = this.getPastClassList.bind(this);
  this.updatePastClassList = this.updatePastClassList.bind(this);
	}

  componentDidMount() {
		setTimeout(() => {
			console.log("student: ", this.props.student);
      this.props.updateStudentClassList(this.props.student);
			this.updatePastClassList(this.props.student);
		}, 500)
	}

  handlePastClassesChoice(event) {
    if (this.state.showPastBtnText == "See Past Sessions") {
  	  this.setState({displayPastClasses: true, showPastBtnText: "See Upcoming Sessions"});	
		} else {
  	  this.setState({displayPastClasses: false, showPastBtnText: "See Past Sessions"});	
		}
	}

  getPastClassList(student) {
  	return axios.get(`/api/pastStudentClasses/${student}`);
	}

	updatePastClassList(student) {
    this.getPastClassList(student)
		// See if it is time for the first (soonest) class
	  .then(classes => {
			console.log("returned data in updateStudentClassList: ", classes);
			if (classes.data.sessions.length != 0) {
				this.setState({pastClassList: classes.data.sessions});
			}
		})
		.catch(errors => {
			console.log("error in updatePastClassList in studentPage.js: ", errors);
		});
	};



	render() {
		return (
			<ClassListDiv>
			  <ShowPastDiv>
			  <P2 style={{marginBottom:"0px"}}>{this.state.displayPastClasses ? "" : (this.props.timeForClass ? "Time for class!" : "No meeting at present")}</P2>
      	<P2 style={{marginBottom:"0px"}}><strong>{(!(this.state.displayPastClasses)) ? "Upcoming" : "Past"} Sessions</strong></P2>
			  <RoundedButton onClick={this.handlePastClassesChoice} style={{height:"2.0rem", width:"14rem", marginBottom:"3px"}}>{this.state.showPastBtnText}</RoundedButton>
			  </ShowPastDiv>
        <ClassTable classList={(!(this.state.displayPastClasses)) ? this.props.classList : this.state.pastClassList} style={{overflow:"scroll"}} cancelIDNumbers={this.state.cancelIDNumbers} timeForClass={this.props.timeForClass} activeClassIDs={this.props.activeClassIDs} /> 

			</ClassListDiv>
		)
	}
}

class ClassTable extends React.Component {
	constructor(props) {
		super(props);
	
		// this.convert24to12HrTime = this.convert24to12HrTime.bind(this);
	  // this.getAMorPM = this.getAMorPM.bind(this);
		this.UTCtoLocal = this.UTCtoLocal.bind(this);
		this.getWeekday = this.getWeekday.bind(this);
	}

  UTCtoLocal(dateString) {
     const local = new Date(dateString);
		return local.toLocaleString('en-CA'); 
	}

  getWeekday(dateString) {
		const local = new Date(dateString);
		return local.toLocaleDateString('en-CA', { weekday: 'long' }); 
	}

	render() {
		let {
			classList,
			cancelIDNumbers,
			activeClassIDs,
		} = this.props;

      	  // <Tword key={row.lastname} style={{flexBasis:"120px"}}>{row.lastname}</Tword>
      	  // <Tword key={row.email} style={{flexBasis:"120px"}}>{row.email}</Tword>
				  // const teacherName = row.firstname + " " + row.lastname + " " + row.email;
      	  // <Tword key={row.username} style={{flexBasis:"300px"}}>{row.firstname + " " + row.lastname + "  " + row.email}</Tword>
      	  // <Tword key={row.students_string} style={{flexBasis:"220px"}}>{row.students_string}</Tword>
	  if (classList.length != 0) {
  		const rows = classList.map((row) =>
      	<TRow key={row.id}
				   // endtime: "2018-05-21T01:30:00.000Z"
  				 style={{color: ((activeClassIDs.includes(row.id)) && this.props.timeForClass) ? "springgreen" : "blue"}}>
      	  <Tword key={row.id.toString() + row.id} style={{ flexBasis:"60px" }}>{row.id}</Tword>
      	  <Tword key={row.id.toString() + row.weekday} style={{flexBasis:"120px"}}>{this.getWeekday(row.class_datetime)}</Tword>
      	  <Tword key={row.class_datetime} style={{flexBasis:"120px"}}>{this.UTCtoLocal(row.class_datetime).slice(0, 10)}</Tword>
      	  <Tword key={row.class_datetime.slice(-13)} style={{flexBasis:"100px"}}>{this.UTCtoLocal(row.class_datetime).slice(-13,-8) + this.UTCtoLocal(row.class_datetime).slice(-5)}</Tword>
      	  <Tword key={row.endtime.substring(0,5)} style={{flexBasis:"100px"}}>{this.UTCtoLocal(row.endtime).slice(-13,-8) + this.UTCtoLocal(row.endtime).slice(-5)}</Tword>
      	  <Tword key={row.id.toString() + row.week_number} style={{flexBasis:"80px"}}>{row.week_number + " of " + row.number_of_weeks}</Tword>
      	  <Tword key={row.id.toString() + row.subject} style={{flexBasis:"120px"}}>{row.subject}</Tword>
      	  <Tword key={row.id.toString() + row.first_names_string}>{row.first_names_string}</Tword>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      	  <Tword key={row.id.toString() + row.username}>{row.firstname}</Tword>&nbsp;
      	  <Tword key={row.id.toString() + row.lastname}>{row.lastname}</Tword>&nbsp;&nbsp;&nbsp;
      	  <Tword key={row.id.toString() + row.email}>{row.email}</Tword>
      	</TRow>
  		);
  		return (
  			<Table>
  			  <THeaderRow>
    			  <Tword style={{flexBasis:"60px"}}>ID</Tword>
    			  <Tword style={{flexBasis:"120px"}}>Weekday</Tword>
    			  <Tword style={{flexBasis:"120px"}}>Date</Tword>
    			  <Tword style={{flexBasis:"100px"}}>Time</Tword>
    			  <Tword style={{flexBasis:"100px"}}>Until</Tword>
    			  <Tword style={{flexBasis:"80px"}}>Week</Tword>
    			  <Tword style={{flexBasis:"120px"}}>Subject</Tword>
    			  <Tword>Participants</Tword>
  			  </THeaderRow>
  			  <TBody>
  			    {rows}
  			  </TBody>
  			</Table>
  		);
		} else {
        return (
			    null	
				);
		  }
	}
}

export default StudentClassList;

StudentClassList.propTypes = {
	// teacher: PropTypes.string.isRequired,
	updateStudentClassList: PropTypes.func.isRequired,
	classList: PropTypes.array.isRequired
}

// --- Styling section ---

const ClassListDiv = styled.div`
  display: flex;
	flex-direction: column;
	margin-bottom: 0.5rem;
`;

	// width: 90vw;
const Table = styled.div`
  display: flex;
  flex-direction: column;
	height: 16rem;
	border: 1px solid blue;
	font-size: 1.1rem;
	font-family: Cantarell;
	color: indigo;
`
const THeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: spaced-evenly; 
  color: darkblue;
	line-height: 8px;
	padding: 0.6rem;
`

const TBody = styled.div`
  display: flex;
  flex-direction: column;
	overflow-y: scroll;

`

const TRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: spaced-evenly; 
	line-height: 8px;
	padding: 0.6rem;
	align-items: center;
	border: 1px solid white;
	  &:hover {
	    background-color: white;
	  };
`

const Tword = styled.span`
	flex-grow: 0;
	flex-shrink: 0;
`

const	ShowPastDiv = styled.div`
  display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-end;
`

