import React from 'react';
import { InputBlue, Label, Label3, Label4, P, P2, P3, RoundedButton, VSpace10px, sizes, media } from './elements';
import styled from 'styled-components'; 
import { PropTypes } from 'prop-types';
import axios from 'axios';

class ListClasses extends React.Component {
	constructor(props) {
		super(props);
    this.state = {
	  	enteredNumbers: "",
	  	cancelIDNumbers: [],
	  	showPastBtnText: "See Past Meetings",
	  	pastClassList: [],
	  	displayPastClasses: false,
			attendees: "",
			activeClassIDs: [],
      intervalID: 0,
			timeoutID: 0
	  }

	  this.handleChange = this.handleChange.bind(this);
	  this.handleSelect = this.handleSelect.bind(this);
	  this.handleSubmit = this.handleSubmit.bind(this);
    this.cancelClasses = this.cancelClasses.bind(this);
	  this.handlePastClassesChoice = this.handlePastClassesChoice.bind(this);
    this.getPastClassList = this.getPastClassList.bind(this);
    this.updatePastClassList = this.updatePastClassList.bind(this);
	}

  componentDidMount() {
		  // console.log("ListClasses componentDidMount");
		  this.state.timeoutID = setTimeout(() => {
        this.props.getClassList(this.props.teacher);
			}, 0);
			this.updatePastClassList(this.props.teacher);
			if (this.props.classList.length !== 0) {
			  this.props.isMeetingOnNow(this.props.classList);
			}
		  
		this.state.intervalID = setInterval(() => {
      this.props.getClassList(this.props.teacher);
			this.updatePastClassList(this.props.teacher);
			if (this.props.classList.length !== 0) {
			  this.props.isMeetingOnNow(this.props.classList);
			}
		}, 60000)
		  
	}

	componentWillUnmount() {
		clearInterval(this.state.intervalID);
		clearTimeout(this.state.timeoutID);
	}

	//Handler for number input field by Select button
  handleChange(event) {
		this.setState({enteredNumbers: event.target.value});
	}

	//Handler for Select button
  handleSelect(event) {
    event.preventDefault();
		const selectedNumbers = this.state.enteredNumbers.split(',').map(function(number) {
			return parseInt(number, 10)
		});
		this.setState({cancelIDNumbers: selectedNumbers});
    const firstNumber = selectedNumbers[0];
		let mtgAttendees = "";
		if (this.state.displayPastClasses) { 
      mtgAttendees = this.state.pastClassList.find( ({ id }) => id === firstNumber);
		} else {
      mtgAttendees = this.props.classList.find( ({ id }) => id === firstNumber);
		}
		this.setState({attendees: mtgAttendees.students_string});
  }
 
	//Handler for Cancel Meetings button
  async handleSubmit(event) {
		event.preventDefault();
		try {
			this.props.resetLRButtonColor();
			let msg = await this.cancelClasses(this.state.cancelIDNumbers);
      console.log("Cancelled meetings: ", this.state.cancelIDNumbers, "  msg: ", msg);
		} catch(errors) {
			console.log("Error cancelling meetings: ", errors);
		}
		try {
      await this.props.getClassList(this.props.teacher);
		} catch(errors) {
			console.log("Error updating classList after cancellations  ", errors);
		}
    this.setState({
			enteredNumbers: "",
			cancelIDNumbers: [],
			attendees: ""
		});
	}

  cancelClasses(cancelIDNumbers) {
      return axios.post('/api/cancellations', this.state.cancelIDNumbers);
	}

  handlePastClassesChoice(event) {
    if (this.state.showPastBtnText == "See Past Meetings") {
  	  this.setState({displayPastClasses: true, showPastBtnText: "See Upcoming Meetings"});	
		} else {
  	  this.setState({displayPastClasses: false, showPastBtnText: "See Past Meetings"});	
		}
	}

  getPastClassList(teacher) {
  	return axios.get(`/api/pastClasses/${teacher}`);
  }

	updatePastClassList(teacher) {
    this.getPastClassList(teacher)
		// See if it is time for the first (soonest) class
	  .then(classes => {
			if (classes.data.sessions.length != 0) {
				this.setState({pastClassList: classes.data.sessions});
			}
		})
		.catch(errors => {
			console.log("error in updatePastClassList in teacherPage.js: ", errors);
		});
	};

	highlightOverlapLines(IDNumber) {
    let numbers = this.state.overlapIDNumbers;
		numbers.push(IDNumber);
		this.setState({overlapIDNumbers: numbers});
	}

  clearOverlapIDNumbers() {
    this.setState({overlapIDNumbers: []})
	}

	render() {
		return (
			<ClassListDiv>
			  <ShowPastDiv>
			  <P2 style={{marginBottom:"0px"}}>{this.state.displayPastClasses ? "" : (this.props.timeForClass ? "Time for class!" : "No meetings now")}</P2>
      	<P2 style={{marginBottom:"0px"}}><strong>{(!(this.state.displayPastClasses)) ? "Upcoming" : "Past"} Meetings</strong></P2>
			  <RoundedButton onClick={this.handlePastClassesChoice} style={{height:"45px", width:"140px", marginBottom:"3px", marginLeft: -10, marginRight: 10}}>{this.state.showPastBtnText}</RoundedButton>
			  </ShowPastDiv>
        <ClassTable classesList={(!(this.state.displayPastClasses)) ? this.props.classList : this.state.pastClassList} style={{overflow:"scroll"}} cancelIDNumbers={this.state.cancelIDNumbers} timeForClass={this.props.timeForClass} activeClassIDs={this.props.activeClassIDs} overlapIDNumbers={this.props.overlapIDNumbers}/> 

        <P3>
		  To see attendees for a meeting, enter its ID number below and click "Select".<br/><br/>
			To delete meetings from the schedule: Enter ID numbers separated by commas and click "Select" as above. ID numbers will be highlighted in red. After verifying meetings to be deleted, click "Cancel Meetings".
			</P3>

			  <Form onSubmit={this.handleSubmit} style={{display: "block"}}>
			    <input onChange={this.handleChange} value={this.state.enteredNumbers} id="deleteIDs" type="text" style={{height:"2.0rem", width:"100px", marginRight:"10px"}}/>
          <RoundedButton onClick={this.handleSelect} style={{height:"36px", width: "60px"}}>Select</RoundedButton><br/>

          <P3>Meeting {this.state.cancelIDNumbers[0]} attendees: {this.state.attendees}</P3>
			    <VSpace10px/>
          <InputBlue type="submit" value="Cancel Meetings" style={{height:"44px", width:"180px"}}/>
			  </Form>
			</ClassListDiv>
		)
	}
}

class ClassTable extends React.Component {
	constructor(props) {
		super(props);
	
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
			classesList,
			cancelIDNumbers,
			timeForClass,
			activeClassIDs,
			overlapIDNumbers,
		} = this.props;

		  const nt_header = [	
				<React.Fragment key={"fragmentHdr"}>
        <TRow key={"IDRow"}>
    	  <Tword key={"IDhdr"} style={{flexBasis:"120px"}}>ID</Tword>
				</TRow>
        <TRow key={"wkdyRow"}>
				<Tword key={"wkdyhdr"} style={{flexBasis:"120px"}}>Weekday</Tword>
				</TRow>
        <TRow key={"dtRow"}>
    	  <Tword key={"dthdr"} style={{flexBasis:"120px"}}>Date</Tword>
				</TRow>
        <TRow key={"timeRow"}>
    		<Tword key={"timehdr"} style={{flexBasis:"120px"}}>Time</Tword>
				</TRow>
        <TRow key={"untilRow"}>
				<Tword key={"untilhdr"} style={{flexBasis:"120px"}}>Until</Tword>
				</TRow>
        <TRow key={"weekRow"}>
				<Tword key={"weekhdr"} style={{flexBasis:"120px"}}>Week</Tword>
				</TRow>
        <TRow key={"subjRow"}>
				<Tword key={"subjhdr"} style={{flexBasis:"120px"}}>Topic</Tword>
				</TRow>
				</React.Fragment>
			]
			
	  if (this.props.classesList.length != 0) {
				let nt_rows = this.props.classesList.map((row) =>
				<Column key={"column".concat(row.id)}>
				<TRow key={"IDrow".concat(row.id)}
  				 style={{color: this.props.cancelIDNumbers.includes(row.id) ? "red" : this.props.overlapIDNumbers.includes(row.id) ? "orange" : ((activeClassIDs.includes(row.id)) && this.timeForClass) ? "springgreen" : "blue"}}>
      	   <Tword key={"IDword".concat(row.id)} style={{ flexBasis:"160px" }}>{row.id}</Tword>
				</TRow>
				<TRow key={"Weekday"+ row.id * 10}>
      	  <Tword key={"wkdy" + row.weekday} style={{flexBasis:"120px"}}>{this.getWeekday(row.class_datetime)}</Tword>
				</TRow>
				<TRow key={"Date"+ row.id * 10}>
      	  <Tword key={"dt" + row.class_datetime} style={{flexBasis:"120px"}}>{this.UTCtoLocal(row.class_datetime).slice(0, 10)}</Tword>
				</TRow>
				<TRow key={"Time"+ row.id * 10}>
      	  <Tword key={"time" + row.class_datetime.slice(-13)} style={{flexBasis:"100px"}}>{this.UTCtoLocal(row.class_datetime).slice(-13,-8) + this.UTCtoLocal(row.class_datetime).slice(-5)}</Tword>
				</TRow>
				<TRow key={"Until"+ row.id * 10}>
      	  <Tword key={"until" + row.endtime.substring(0,5)} style={{flexBasis:"100px"}}>{this.UTCtoLocal(row.endtime).slice(-13,-8) + this.UTCtoLocal(row.endtime).slice(-5)}</Tword>
				</TRow>
				<TRow key={"Week"+ row.id * 10}>
      	  <Tword key={"week" + row.week_number} style={{flexBasis:"80px"}}>{row.week_number + " of " + row.number_of_weeks}</Tword>
				</TRow>
				<TRow key={"Topic"+ row.id * 10}>
      	  <Tword key={"subj" + row.subject} style={{flexBasis:"120px"}}>{row.subject}</Tword>
				</TRow>
				</Column>
			  )	

  		return (
        <Row key = {"row"}>
				  <Column key = {"column"}>
				    {nt_header}
				  </Column>
				  <Row key = {"ntrow"} style={{flexWrap: "wrap"}}>
				  {nt_rows}
				  </Row>
        </Row>
				
  		);
		} else {
        return (
			    null	
				);
		  }
	}
}

export default ListClasses;

// --- Styling section ---

const ClassListDiv = styled.div`
  display: flex;
	flex-direction: column;
	margin-top: 0px;
	margin-bottom: 5px;
	${media.phone`font-size: 0.8rem;`}
`;

	// width: 90vw;
const Table = styled.div`
  display: flex;
  flex-direction: column;
	height: 18rem;
	border: 1px solid blue;
	font-size: 1.1rem;
	font-family: Cantarell;
	color: indigo;
	overflow-y: scroll;
	${media.phone`font-size: 0.8rem;`}
	${media.phone`display: none;`}
`
	//${media.huge`display: none;`}
const NarrowTable = styled.div`
  display: flex;
  flex-direction: column;
	height: 200px;
	border: 1px solid blue;
	font-size: 12px;
	font-family: Cantarell;
	color: indigo;
	overflow-y: scroll;
	${media.phone`font-size: 0.8rem;`}
`
const THeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: spaced-evenly; 
  color: darkblue;
	line-height: 8px;
	padding: 0.6rem;
	${media.phone`font-size: 0.8rem;`}
`

const ColumnWithHScroll = styled.div`
  display: flex;
  flex-direction: column;
	overflow-y: scroll;
	${media.phone`font-size: 0.8rem;`}
`

const TRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: spaced-evenly; 
	line-height: 8px;
	padding: 5px;
  color: Green;
	align-items: center;
	  &:hover {
	    background-color: white;
	  };
	${media.phone`font-size: 0.8rem;`}
`

const Tword = styled.span`
  display: flex;
	flex-grow: 0;
	flex-shrink: 0;
	font-size: 16px;
	${media.phone`font-size: 12px;`}
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
	justify-content: flex-start;
	line-height: 8px;
	padding: 5px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

const	SelectsRowDiv = styled.div`
  display: flex;
	flex-direction: row;
	justify-content: flex-start;
	${media.phone`font-size: 0.8rem;`}
`

const	ShowPastDiv = styled.div`
  display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-end;
`

const Form = styled.form`
  display: flex;
	flex-direction: row;
	justify-content: flex-start;
  width: 500px;
`

const Input = styled.input`
  color: white;
	background: DodgerBlue;
	height: 2.0rem;
	width: 120px;
	&:hover {
	  color: Blue;
		background: PaleGreen;
	}  
  
`
