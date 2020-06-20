import React from 'react';
import { withRouter } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { A, FormLeft, Input, InputBlue, Label, Label2, Label3, Label4, Label200, LabelRow, P, P2, P3, media, RectangleButton, RoundedButton, VSpace10px } from './elements';
import CheckboxOrRadioGroup from './CheckboxOrRadioGroup'; 
import 'react-tippy/dist/tippy.css';
import {Tooltip} from 'react-tippy';
import axios from 'axios';
import { connect } from 'react-redux';
import { putStudentsListInStore } from '../actions/userActions';
import { PropTypes } from 'prop-types';

class ScheduleClasses extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
			subject: 'English',
			number_of_weeks: 1,
			selected_weekdays: ['Tuesday'],
			weekdaysString: 'Tuesday',
			month: 'January',          //selected month as a word
			classDate: 1,
			classMonth: 0,             //selected month as a number from 0 to 11
      classYear: 2019,
		  classWeekday: 'Tuesday',   //default weekday calculated from selected date
      classHour: 8,
			classMinutes: '00',
			classAMPM: 'a.m.',
			classEndHour: 9,
			classEndMinutes: '00',
			classEndAMPM: 'a.m.',
			student1: 'None',
			student2: '',
			student3: '',
			student4: '',
			student5: '',
			students_string: '(please select participants above)',
			first_names_string: '',
			allStudents:[],
			allFirstNames:[],
			allLastNames:[],
			chosenFirstNames: ["","","","",""],
			chosenLastNames: ["","","","",""],
			timezoneOffset: '',
			showOverlapButtons: false,
			overlapChoiceMade: false,
		  warningText: ''
		};

		this.handleChangeSubject = this.handleChangeSubject.bind(this);
		this.handleChangeWeeks = this.handleChangeWeeks.bind(this);
		this.handleWeekdaySelection = this.handleWeekdaySelection.bind(this);
		this.handleChangeMonth = this.handleChangeMonth.bind(this);
		this.handleChangeDate = this.handleChangeDate.bind(this);
		this.handleChangeHour = this.handleChangeHour.bind(this);
		this.handleChangeMinute = this.handleChangeMinute.bind(this);
		this.handleChangeClassAMPM = this.handleChangeClassAMPM.bind(this);
		this.handleChangeEndHour = this.handleChangeEndHour.bind(this);
		this.handleChangeEndMinutes = this.handleChangeEndMinutes.bind(this);
		this.handleChangeClassEndAMPM = this.handleChangeClassEndAMPM.bind(this);
		this.handleChangeStudent1 = this.handleChangeStudent1.bind(this);
		this.handleChangeStudent2 = this.handleChangeStudent2.bind(this);
		this.handleChangeStudent3 = this.handleChangeStudent3.bind(this);
		this.handleChangeStudent4 = this.handleChangeStudent4.bind(this);
		this.handleChangeStudent5 = this.handleChangeStudent5.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleOverlapOK = this.handleOverlapOK.bind(this);
		this.handleOverlapCancel = this.handleOverlapCancel.bind(this);
		this.getClassWeekday = this.getClassWeekday.bind(this);
		this.getClassYear = this.getClassYear.bind(this);
		this.getParticipantsListFromDB = this.getParticipantsListFromDB.bind(this);
		this.update_students_string = this.update_students_string.bind(this);
		this.update_first_names_string = this.update_first_names_string.bind(this);
		this.getClassEntryString = this.getClassEntryString.bind(this);
	}

	componentDidMount() {
		this.getParticipantsListFromDB()
			.then((studentsListData) => {
				let sList = studentsListData.data.participantsList.map(obj => {
					obj.key = obj.id; 
					return(obj)
				});
				this.props.putStudentsList(sList); 
				this.setState({allStudents: sList.map(obj => {return obj.username })});
				this.state.allStudents.unshift("None");
				this.setState({allFirstNames: sList.map(obj => {return obj.firstname })});
				this.state.allFirstNames.unshift("");
				this.setState({allLastNames: sList.map(obj => {return obj.lastname })});
				this.state.allLastNames.unshift("");
			})
			.catch((errors) => {
				console.log("Error copying students list from DB to Redux store: ", errors);
			});
	}

	getParticipantsListFromDB() {
		return axios.get(`/api/users`);
	}

	handleChangeStudent1(event) {
		if (!this.state.students_string.includes(event.target.value)) {
			this.setState({student1: event.target.value});
			// Display the first and last names under the name selects
			if (event.target.value === "None") {
				this.setState({
					chosenFirstNames: changeArray(this.state.chosenFirstNames, 0, ""),
					chosenLastNames: changeArray(this.state.chosenLastNames, 0, "")});
			} else {
				this.setState({
					chosenFirstNames: changeArray(this.state.chosenFirstNames, 0, this.props.studentsList[event.target.selectedIndex - 1].firstname),
					chosenLastNames: changeArray(this.state.chosenLastNames, 0, this.props.studentsList[event.target.selectedIndex - 1].lastname)
				});
			}
			this.update_students_string([event.target.value, this.state.student2, this.state.student3, this.state.student4, this.state.student5]);
			this.update_first_names_string(this.state.chosenFirstNames);
		}
	}

	handleChangeStudent2(event) {
		if (!this.state.students_string.includes(event.target.value)) {
			if (this.state.student1 === "None") {
				this.handleChangeStudent1(event) 
			} else {
				this.setState({student2: event.target.value});
				if (event.target.value === "None") {
					this.setState({
						chosenFirstNames: changeArray(this.state.chosenFirstNames, 1, ""),
						chosenLastNames: changeArray(this.state.chosenLastNames, 1, "")});
				} else {
					this.setState({
						chosenFirstNames: changeArray(this.state.chosenFirstNames, 1, this.props.studentsList[event.target.selectedIndex - 1].firstname),
						chosenLastNames: changeArray(this.state.chosenLastNames, 1, this.props.studentsList[event.target.selectedIndex - 1].lastname)
					});
				}
			}
			this.update_students_string([this.state.student1, event.target.value, this.state.student3, this.state.student4, this.state.student5]);
			this.update_first_names_string(this.state.chosenFirstNames);
		}
	}

	handleChangeStudent3(event) {
		if (!this.state.students_string.includes(event.target.value)) {
			if (this.state.student1 === "None") {
				this.handleChangeStudent1(event) 
			} else {
				this.setState({student3: event.target.value});
				if (event.target.value === "None") {
					this.setState({
						chosenFirstNames: changeArray(this.state.chosenFirstNames, 2, ""),
						chosenLastNames: changeArray(this.state.chosenLastNames, 2, "")});
				} else {
					this.setState({
						chosenFirstNames: changeArray(this.state.chosenFirstNames, 2, this.props.studentsList[event.target.selectedIndex - 1].firstname),
						chosenLastNames: changeArray(this.state.chosenLastNames, 2, this.props.studentsList[event.target.selectedIndex - 1].lastname)
					});
				}
			}
			this.update_students_string([this.state.student1, this.state.student2, event.target.value, this.state.student4, this.state.student5]);
			this.update_first_names_string(this.state.chosenFirstNames);
		}
	}

	handleChangeStudent4(event) {
		if (!this.state.students_string.includes(event.target.value)) {
			if (this.state.student1 === "None") {
				this.handleChangeStudent1(event) 
			} else {
				this.setState({student4: event.target.value});
				if (event.target.value === "None") {
					this.setState({
						chosenFirstNames: changeArray(this.state.chosenFirstNames, 3, ""),
						chosenLastNames: changeArray(this.state.chosenLastNames, 3, "")});
				} else {
					this.setState({
						chosenFirstNames: changeArray(this.state.chosenFirstNames, 3, this.props.studentsList[event.target.selectedIndex - 1].firstname),
						chosenLastNames: changeArray(this.state.chosenLastNames, 3, this.props.studentsList[event.target.selectedIndex - 1].lastname)
					});
				}
			}
			this.update_students_string([this.state.student1, this.state.student2, this.state.student3, event.target.value, this.state.student5]);
			this.update_first_names_string(this.state.chosenFirstNames);
		}
	}

	handleChangeStudent5(event) {
		if (!this.state.students_string.includes(event.target.value)) {
			if (this.state.student1 === "None") {
				this.handleChangeStudent1(event) 
			} else {
				this.setState({student5: event.target.value});
				if (event.target.value === "None") {
					this.setState({
						chosenFirstNames: changeArray(this.state.chosenFirstNames, 4, ""),
						chosenLastNames: changeArray(this.state.chosenLastNames, 4, "")});
				} else {
					this.setState({
						chosenFirstNames: changeArray(this.state.chosenFirstNames, 4, this.props.studentsList[event.target.selectedIndex - 1].firstname),
						chosenLastNames: changeArray(this.state.chosenLastNames, 4, this.props.studentsList[event.target.selectedIndex - 1].lastname)
					});
				}
			}
			this.update_students_string([this.state.student1, this.state.student2, this.state.student3, this.state.student4, event.target.value]);
			this.update_first_names_string(this.state.chosenFirstNames);
		}
	}

	update_students_string(newArray) {
		let new_students_string = "";
		for (let student of newArray) {
			if ((student !== "None")&&(student !== "")) {
				new_students_string = new_students_string + ", " + student
			}
		};
		while (new_students_string.substr(0,2) === ", ") {
			new_students_string = new_students_string.substr(2);
		}
		this.setState({ students_string: new_students_string });
	}

	update_first_names_string(newArray) {
		let new_first_names_string = "";
		for (let student of newArray) {
			if ((student !== "None")&&(student !== "")) {
				new_first_names_string = new_first_names_string + ", " + student
			}
		};
		while (new_first_names_string.substr(0,2) === ", ") {
			new_first_names_string = new_first_names_string.substr(2);
		}
		this.setState({ first_names_string: new_first_names_string });
	}

	handleWeekdaySelection(e) {
		const newSelection = e.target.value;
		let newSelectionArray;
		if(this.state.selected_weekdays.indexOf(newSelection) > -1) {
			newSelectionArray = this.state.selected_weekdays.filter(s => s !== newSelection)
		} else {
			newSelectionArray = [...this.state.selected_weekdays, newSelection];
		}
		const sortedOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		let sortedArray = [];
		for (let n of sortedOrder) {
			if (newSelectionArray.includes(n)) sortedArray.push(n);
		}
		// this.setState({ selected_weekdays: newSelectionArray }, () => console.log('Weekday selection', this.state.selected_weekdays));
		this.setState({ selected_weekdays: sortedArray });
		this.setState({ weekdaysString: sortedArray.toString().replace(/,/g , ", ")});
	}

	handleChangeSubject(event) {
		this.setState({subject: event.target.value});
	}

	handleChangeWeeks(event) {
		this.setState({number_of_weeks: parseInt(event.target.value, 10)});
	}

	handleChangeMonth(event) {
		const newMonth = getMonthNumber(event.target.value);
		const newYear = this.getClassYear(newMonth, this.state.classDate, this.state.classHour, this.state.classMinutes, this.state.classAMPM, this.state.classEndHour, this.state.classEndMinutes, this.state.classEndAMPM); 
		const newWeekday = this.getClassWeekday(newYear, newMonth, this.state.classDate);
		this.setState({
			month: event.target.value,
			classMonth: newMonth,
			classWeekday: newWeekday,
			selected_weekdays: [newWeekday], 
			weekdaysString: newWeekday
		});
	}

	handleChangeDate(event) {
		const newDate = parseInt(event.target.value, 10);
		const newYear = this.getClassYear(this.state.classMonth, newDate, this.state.classHour, this.state.classMinutes, this.state.classAMPM, this.state.classEndHour, this.state.classEndMinutes, this.state.classEndAMPM); 
		const newWeekday = this.getClassWeekday(newYear, this.state.classMonth, newDate);
		this.setState({
			classDate: newDate,
			classWeekday: newWeekday,
			selected_weekdays: [newWeekday],
			weekdaysString: newWeekday
		});
	}

	handleChangeHour(event) {
		const newHour = parseInt(event.target.value, 10);
		const newYear = this.getClassYear(this.state.classMonth, this.state.classDate, newHour, this.state.classMinutes, this.state.classAMPM, this.state.classEndHour, this.state.classEndMinutes, this.state.classEndAMPM); 
		const newWeekday = this.getClassWeekday(newYear, this.state.classMonth, this.state.classDate);
		this.setState({
			classHour: newHour,
			classWeekday: newWeekday,
			selected_weekdays: [newWeekday], 
			weekdaysString: newWeekday
		});
	}

	handleChangeMinute(event) {
		// this.setState({classMinutes: event.target.value});
		const newMinutes = event.target.value;
		const newYear = this.getClassYear(this.state.classMonth, this.state.classDate, this.state.classHour, newMinutes, this.state.classAMPM, this.state.classEndHour, this.state.classEndMinutes, this.state.classEndAMPM); 
		const newWeekday = this.getClassWeekday(newYear, this.state.classMonth, this.state.classDate);
		this.setState({
			classMinutes: newMinutes,
			classWeekday: newWeekday,
			selected_weekdays: [newWeekday], 
			weekdaysString: newWeekday
		});
	}

	handleChangeClassAMPM(event) {
		const newAMPM = event.target.value;
		const newYear = this.getClassYear(this.state.classMonth, this.state.classDate, this.state.classHour, this.state.classMinutes, newAMPM, this.state.classEndHour, this.state.classEndMinutes, this.state.classEndAMPM); 
		const newWeekday = this.getClassWeekday(newYear, this.state.classMonth, this.state.classDate);
		this.setState({
			classAMPM: newAMPM,
			classWeekday: newWeekday,
			selected_weekdays: [newWeekday], 
			weekdaysString: newWeekday
		});
	}

	handleChangeEndHour(event) {
		const endHour = parseInt(event.target.value, 10);
		const newYear = this.getClassYear(this.state.classMonth, this.state.classDate, this.state.classHour, this.state.classMinutes, this.state.classAMPM, endHour, this.state.classEndMinutes, this.state.classEndAMPM); 
		const newWeekday = this.getClassWeekday(newYear, this.state.classMonth, this.state.classDate);
		this.setState({
			classEndHour: endHour,
			classWeekday: newWeekday,
			selected_weekdays: [newWeekday], 
			weekdaysString: newWeekday
		});
	}

	handleChangeEndMinutes(event) {
		const endMinutes = event.target.value;
		const newYear = this.getClassYear(this.state.classMonth, this.state.classDate, this.state.classHour, this.state.classMinutes, this.state.classAMPM, this.state.classEndHour, endMinutes, this.state.classEndAMPM); 
		const newWeekday = this.getClassWeekday(newYear, this.state.classMonth, this.state.classDate);
		this.setState({
			classEndMinutes: endMinutes,
			classWeekday: newWeekday,
			selected_weekdays: [newWeekday], 
			weekdaysString: newWeekday
		});
	}

	handleChangeClassEndAMPM(event) {
		const endAMPM = event.target.value;
		const newYear = this.getClassYear(this.state.classMonth, this.state.classDate, this.state.classHour, this.state.classMinutes, this.state.classAMPM, this.state.classEndHour, this.state.classEndMinutes, endAMPM); 
		const newWeekday = this.getClassWeekday(newYear, this.state.classMonth, this.state.classDate);
		this.setState({
			classEndAMPM: endAMPM,
			classWeekday: newWeekday,
			selected_weekdays: [newWeekday], 
			weekdaysString: newWeekday
		});
	}

  handleOverlapOK(event) {
		this.sendNewClassToDB();
		this.setState({overlapChoiceMade: true});
	}

	handleOverlapCancel(event) {
		this.setState({overlapChoiceMade: true});
	}

	getClassEntryString() {
		return (this.state.subject + " meeting with " + this.state.students_string + " on "  + this.state.weekdaysString + " at " + this.state.classHour.toString() + ":" + this.state.classMinutes + " " + this.state.classAMPM + " until " + this.state.classEndHour + ":" + this.state.classEndMinutes + " " + this.state.classEndAMPM + " beginning on " + this.state.classWeekday + ", " + this.state.month + " " + this.state.classDate + " for " + this.state.number_of_weeks + " week(s)");
	}
  // Confirm Appointment(s) button
	handleSubmit(event) {
		event.preventDefault();
		// Check for a time overlap with already scheduled classes 
    this.setState({showOverlapButtons: false}); 
		const newClass = this.state;
		let classHour24 = newClass.classHour;
    if (newClass.classAMPM == 'p.m.') {
	    classHour24 = classHour24 + 12;
		}
		let newClassBeginTime = new Date(newClass.classYear, newClass.classMonth, newClass.classDate, classHour24, parseInt(newClass.classMinutes, 10));
		console.log("newCBT: ", newClassBeginTime, "  LocaleString: ", newClassBeginTime.toLocaleString('en-CA'));

		let newClassEndTime = new Date(newClassBeginTime);
		let endHour = this.state.classEndHour;
		if (this.state.classEndAMPM == "p.m.") {
		}
		// Handle cases where the class end time is actually the next day; max class length 23:59
		console.log('endHour: ', endHour, '  newCBT.getHours: ', newClassBeginTime.getHours());
		// let hoursInterval = endHour - newClassEndTime.getHours();
		let hoursInterval = endHour - newClassBeginTime.getHours();
		if (hoursInterval < 0) {
			 hoursInterval = hoursInterval + 24;

		}
		newClassEndTime.setHours((newClassBeginTime.getHours() + hoursInterval), parseInt(this.state.classEndMinutes, 10));
    // Now newCBT and newCET are set properly
		console.log("newCET: ", newClassEndTime);
		// OVERLAP check
		// Look through class list for class times that overlap with the new class time
		// Note that nextClass.classDateTime and newClassBeginTime are both ISO UTC Date object strings
		if (this.props.classList.length != 0) {
			let overlapFound = false;
			for (let nextClass of this.props.classList) {
				// For class overlap check, only consider existing classes starting within one day of the new one
				const oneDayMS = 24 * 60 * 60 * 1000;
        const newCBTms = newClassBeginTime.valueOf();
        const nextCBTms = new Date(nextClass.classDateTime).valueOf();
				if (Math.abs(newCBTms - nextCBTms) <  oneDayMS) {
					console.log("Dates are within one day of each other; doing overlap check");

          const nextCETms = new Date(nextClass.endTime).valueOf();
          const newCETms = newClassEndTime.valueOf();
					// The new class entry overlaps?
          if (((newCBTms >= nextCBTms)&&(newCBTms < nextCETms))||
						 ((newCETms > nextCBTms)&&(newCETms <= nextCETms))) {
						overlapFound = true;
						this.handleOverlap(nextClass.id);
						break; // overlap found, so after handling it overlap search can be exited
						//   Are we past one day of difference in times in sorted lines? 
						//   If so we can stop looking for an overlap
					} else if (newCBTms > (nextCBTms + oneDayMS)) { 
						break;
					}
				}
			}
      if (!(overlapFound)) {
				this.sendNewClassToDB();
			}
		} else {  // classList.length == 0; no overlap check needed
				this.sendNewClassToDB();
		}
	}

  async handleOverlap(classID) {
  	this.props.highlightOverlapLines(classID);
  	console.log("New class entry overlaps with existing class");
  	this.setState({warningText: "This new class time overlaps with a previously entered class highlighted in orange in the class list above. This will add participants of the new entry to the existing video session at the time you've specified. Is that OK? "}); 
    this.setState({showOverlapButtons: true}); 
		try {
		  await this.waitForOverlapChoice(); 
		} catch(errors) {console.log("Error in handleOverlap  ", errors)};
		this.setState({overlapChoiceMade: false, warningText: "", showOverlapButtons: false});
		this.props.clearOverlapIDNumbers();
	}

  async waitForOverlapChoice() {
		const timeoutPromise = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));
    while(!(this.state.overlapChoiceMade)) {
			try {
	      await timeoutPromise(1000);	  
			} catch(errors) {console.log("Error in waitForOverlapChoice  ", errors)};
		};
		return false;
	}

	async sendNewClassToDB() {
		// Send new class appointment to database
		this.props.clearOverlapIDNumbers();
		let classData = this.state;
		classData.teacher = this.props.teacher;
		try {
			let msg = await classAppointmentsToDB(classData);
			console.log("Sent class entries to DB. msg: ", msg);
		} catch(errors) { console.log("Error in classAppointmentsToDB: ", errors)};

		// Record class appointment string for later reference
		let entryString = this.getClassEntryString();
		entryString = '{"teacher":"' + classData.teacher + '", "entry":"' + entryString + '"}';
		try	{
			let msg = await classEntryToDB(JSON.parse(entryString));
			console.log("Sent classEntries string to DB. msg: ", msg );
		} catch(errors) { console.log("Error during classEntryToDB call in handleSubmit: ", errors)};

		// Update the class list on the teacher's page
		 try	{
			 setTimeout(async () => {
			 let msg = await this.props.getClassList(this.props.teacher);
		 }, 1000)
		 } catch(errors) { console.log("Error in getClassList in ScheduleClasses: ", errors)};
	}

	getClassWeekday(year, month, date) {
		const allWeekdays	= ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		const localClassWeekday = allWeekdays[new Date(year, month,	date).getDay()];
		return localClassWeekday;
	}

	// Calculate class year automatically; use next year if
	//   the date and time of the class has past already this year
	getClassYear(classMonth, classDate, classHour, classMinutes, classAMPM, classEndHour, classEndMinutes, classEndAMPM) {
    const timeNowMS = Date.now().valueOf();


		const now = new Date();
		const thisYear = now.getFullYear();
		const nextYear = thisYear + 1;
		const thisMonth = now.getMonth();
		const thisDate = now.getDate();
		this.setState({timezoneOffset:now.getTimezoneOffset()});
		if (thisMonth < classMonth) {
			this.setState({classYear: thisYear});
			return thisYear;
		} else if (thisMonth > classMonth) {
			this.setState({classYear: nextYear});
			return nextYear;
		} else if (thisMonth == classMonth) {
			if (thisDate < classDate) {
				this.setState({classYear: thisYear});
				return thisYear;
			} else if (thisDate > classDate) {
				this.setState({classYear: nextYear});
				return nextYear;
			} else if (thisDate == classDate) {
				const thisHour = now.getHours();
				const thisMinute = now.getMinutes();
				classHour = (classHour === 12 ? 0 : classHour);
				const classHour24 = (classAMPM === "p.m." ? classHour + 12 : classHour);

				// Any entered date and time in the past is automatically assumed to be a class for next year; 
        //   however, if the current date has been entered with a beginning time that has passed  
				//   less than an hour ago, the year is assumed to be the present year
				//   in case a teacher just started a little after the prearranged class beginning time
				const endHour = (classEndAMPM == 'a.m.') ? classEndHour : classEndHour + 12;	
				console.log("nowMinutes: ", ((thisHour * 60) + thisMinute), "  endMinutes: ", ((endHour * 60) + parseInt(classEndMinutes, 10)));
				if ((thisHour * 60) + thisMinute > ((classHour24 * 60) + parseInt(classMinutes) - 60)) {

					this.setState({classYear: thisYear});
					return thisYear;
				} else {
					this.setState({classYear: nextYear});
					return nextYear;
				}
			}
		}
	}

	render() {
		// get students' names from database
		let student1 = 'None';
		const listItems1 = this.state.allStudents.map((student1) =>
			<option key={student1}>{student1}</option>
		);
		const listItems2 = this.state.allStudents.map((student2) =>
			<option key={student2}>{student2}</option>
		);
		const listItems3 = this.state.allStudents.map((student3) =>
			<option key={student3}>{student3}</option>
		);
		const listItems4 = this.state.allStudents.map((student4) =>
			<option key={student4}>{student4}</option>
		);
		const listItems5 = this.state.allStudents.map((student5) =>
			<option key={student5}>{student5}</option>
		);

		return (
			<FormLeft onSubmit={this.handleSubmit}>

			<Tooltip theme="light" title="Making an appointment here will automatically send a message to the participant's personal log-in page to remind him or her of the class time, and enable joining the video class at that time by simply clicking a button."><P2 style={{margin:0, fontWeight:"bold"}}>Make new meeting appointments:</P2></Tooltip>

			<VSpace10px/>

			<Label style={{textAlign: 'left', marginLeft:"26px"}}>Participants</Label>
			<Label4>(click the button and then type the first part of the participant's username to find it easily)</Label4>
			<VSpace10px/>

			<FlexRow>
      <FlexColumn>
			<Label style={{marginLeft:40}}>Participant 1</Label>
			<SelectWide value={this.state.student1} onChange={this.handleChangeStudent1}>Student 
			{listItems1}
			</SelectWide>
			<NameLabel>{this.state.chosenFirstNames[0] + " " + this.state.chosenLastNames[0]}</NameLabel>&nbsp;
			</FlexColumn>

      <FlexColumn>
			<Label style={{marginLeft:40}}>Participant 2</Label>
			<SelectWide value={this.state.student2} onChange={this.handleChangeStudent2}>Student
			{listItems2}
			</SelectWide>
			<NameLabel>{this.state.chosenFirstNames[1] + " " + this.state.chosenLastNames[1]}</NameLabel>&nbsp;
      </FlexColumn>

      <FlexColumn>
			<Label style={{marginLeft:40}}>Participant 3</Label>
			<SelectWide value={this.state.student3} onChange={this.handleChangeStudent3}>Student
			{listItems3}
			</SelectWide>
			<NameLabel>{this.state.chosenFirstNames[2] + " " + this.state.chosenLastNames[2]}</NameLabel>&nbsp;
      </FlexColumn>

      <FlexColumn>
			<Label style={{marginLeft:40}}>Participant 4</Label>
			<SelectWide value={this.state.student4} onChange={this.handleChangeStudent4}>Student
			{listItems4}
			</SelectWide>
			<NameLabel>{this.state.chosenFirstNames[3] + " " + this.state.chosenLastNames[3]}</NameLabel>&nbsp;
      </FlexColumn>

      <FlexColumn>
			<Label style={{marginLeft:40}}>Participant 5</Label>
			<SelectWide value={this.state.student5} onChange={this.handleChangeStudent5}>Student
			{listItems5}
			</SelectWide>
			<NameLabel>{this.state.chosenFirstNames[4] + " " + this.state.chosenLastNames[4]}</NameLabel>&nbsp;
      </FlexColumn>
			</FlexRow>

      <VSpace10px/>

			<FlexRowFirm style={{marginTop:"15px"}}>
      <FlexColumn>
			<Label2 style={{marginLeft:20}}>Month</Label2>
			<SelectSmallFont value={this.state.month} onChange={this.handleChangeMonth}>Month
			<option>January</option>
			<option>February</option>
			<option>March</option>
			<option>April</option>
			<option>May</option>
			<option>June</option>
			<option>July</option>
			<option>August</option>
			<option>September</option>
			<option>October</option>
			<option>November</option>
			<option>December</option>
			</SelectSmallFont>&nbsp;
      </FlexColumn>


      <FlexColumn>
			<Label2>Date</Label2>
			<SelectNarrowSmallFont value={this.state.classDate} onChange={this.handleChangeDate} style={{width: "40px", marginLeft: 20}}>Date
			<option>1</option>
			<option>2</option>
			<option>3</option>
			<option>4</option>
			<option>5</option>
			<option>6</option>
			<option>7</option>
			<option>8</option>
			<option>9</option>
			<option>10</option>
			<option>11</option>
			<option>12</option>
			<option>13</option>
			<option>14</option>
			<option>15</option>
			<option>16</option>
			<option>17</option>
			<option>18</option>
			<option>19</option>
			<option>20</option>
			<option>21</option>
			<option>22</option>
			<option>23</option>
			<option>24</option>
			<option>25</option>
			<option>26</option>
			<option>27</option>
			<option>28</option>
			<option>29</option>
			<option>30</option>
			<option>31</option>
			</SelectNarrowSmallFont>
      </FlexColumn>
			<Label style={{paddingTop:"30px", textAlign:"left"}}>({this.state.classWeekday})</Label>
			</FlexRowFirm>

			<VSpace10px/>
			<FlexRowFirm>
			<FlexColumn>
			<Label2 style={{marginLeft:10}}>Hour</Label2>
			<Select2 style={{textAlign: 'right', marginLeft:20, width: "60px"}} value={this.state.classHour} onChange={this.handleChangeHour}>Hour
			<option>0</option>
			<option>1</option>
			<option>2</option>
			<option>3</option>
			<option>4</option>
			<option>5</option>
			<option>6</option>
			<option>7</option>
			<option>8</option>
			<option>9</option>
			<option>10</option>
			<option>11</option>
			<option>12</option>
			</Select2>
			</FlexColumn>

			<Colon style={{marginLeft: -10}}>:</Colon>


			<FlexColumn>
			<Label2>Minute</Label2>
			<Select2 style={{textAlign: 'left'}} value={this.state.classMinutes} onChange={this.handleChangeMinute}>Minute
			<option>00</option>
			<option>05</option>
			<option>10</option>
			<option>15</option>
			<option>20</option>
			<option>25</option>
			<option>30</option>
			<option>35</option>
			<option>40</option>
			<option>45</option>
			<option>50</option>
			<option>55</option>
			</Select2>&nbsp;
			</FlexColumn>


			<FlexColumn>
			<Label2 style={{fontSize: "22px", marginLeft: 10}}>a.m./p.m.</Label2>
			<SelectNarrowSmallFont value={this.state.classAMPM} onChange={this.handleChangeClassAMPM} style={{marginTop: 1, marginLeft: 20}}>
			<option>a.m.</option>
			<option>p.m.</option>
			</SelectNarrowSmallFont><br/><br/>
			</FlexColumn>
			</FlexRowFirm>
      <P style={{fontSize:16, marginTop:0, marginBottom:10}}>Note: 12:00 a.m. is midnight. 12:00 p.m. is noon.</P>
			<Label style={{width:"260px", marginBottom: "10px"}}>Meeting End Time</Label>

			<FlexRowFirm>
			<FlexColumn>
			<Label2 style={{marginLeft:10}}>Hour</Label2>
			<Select2 style={{textAlign: 'right', marginLeft:20, width: "60px"}} value={this.state.classEndHour} onChange={this.handleChangeEndHour}>Hour
			<option>0</option>
			<option>1</option>
			<option>2</option>
			<option>3</option>
			<option>4</option>
			<option>5</option>
			<option>6</option>
			<option>7</option>
			<option>8</option>
			<option>9</option>
			<option>10</option>
			<option>11</option>
			<option>12</option>
			</Select2>
			</FlexColumn>

			<Colon style={{marginLeft: -10}}>:</Colon>

			<FlexColumn>
			<Label2>Minute</Label2>
			<Select2 style={{textAlign: 'left'}} value={this.state.classEndMinutes} onChange={this.handleChangeEndMinutes}>Minute
			<option>00</option>
			<option>05</option>
			<option>10</option>
			<option>15</option>
			<option>20</option>
			<option>25</option>
			<option>30</option>
			<option>35</option>
			<option>40</option>
			<option>45</option>
			<option>50</option>
			<option>55</option>
			</Select2><br/>
			</FlexColumn>

			<FlexColumn>
			<Label2 style={{fontSize: "22px", marginLeft: 10}}>a.m./p.m.</Label2>
			<SelectNarrowSmallFont value={this.state.classEndAMPM} onChange={this.handleChangeClassEndAMPM} style={{marginTop: 1, marginLeft: 20}}>
			<option>a.m.</option>
			<option>p.m.</option>
			</SelectNarrowSmallFont><br/><br/>
			</FlexColumn>
			</FlexRowFirm>

			<FlexColumn>
			<Label style={{marginLeft:-8}}>Topic</Label>
			<Select value={this.state.subject} onChange={this.handleChangeSubject}>Subject
			<option>English</option>
			<option>French</option>
			<option>Spanish</option>
			<option>Japanese</option>
			<option>Mathematics</option>
			</Select>
			</FlexColumn>
			<VSpace10px/>


			<Tooltip theme="light" title="The Month and Date selected above should be for your <strong>first </strong>(earliest) class."><P2 style={{marginBottom:"0px"}}>Enter additional upcoming sessions for the same participants and meeting time:</P2></Tooltip>
			<VSpace10px/>

			<FlexRow>
			<FlexColumn style={{marginRight:"10px", marginBottom:20}}>
			<Label>Number of Weeks</Label>
			<Select value={this.state.number_of_weeks} onChange={this.handleChangeWeeks}>Date
			<option>1</option>
			<option>2</option>
			<option>3</option>
			<option>4</option>
			<option>5</option>
			<option>6</option>
			<option>7</option>
			<option>8</option>
			<option>9</option>
			<option>10</option>
			<option>11</option>
			<option>12</option>
			<option>13</option>
			<option>14</option>
			<option>15</option>
			<option>16</option>
			<option>17</option>
			<option>18</option>
			<option>19</option>
			<option>20</option>
			<option>21</option>
			<option>22</option>
			<option>23</option>
			<option>24</option>
			<option>25</option>
			<option>26</option>
			</Select>
			</FlexColumn>
			<VSpace10px/>

			<FlexColumn>
			<Label style={{marginLeft:8}}>Weekdays</Label><br/>
			<CheckboxGroup>
			<CheckboxOrRadioGroup
			title={''}
			setName={'weekdays'}
			type={'checkbox'}
			controlFunc={this.handleWeekdaySelection}
			options={["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]}
			selectedOptions={this.state.selected_weekdays} />
			</CheckboxGroup><br/>
			</FlexColumn>
			</FlexRow>
			<VSpace10px/>

			<Label4><strong>Current entry:</strong></Label4>
			<Label4 style={{textAlign: "left"}}>(please check and confirm)</Label4> 
			<Label4><strong>{this.getClassEntryString()}</strong></Label4>
        <VSpace10px/>
			  <FlexRow style={{flexBasis:"80%"}}>
          <InputBlue type="submit" value="Confirm appointment(s)" style={{height:"32px", width: "240px"}}/>
			    <P3 style={{color:"red", flexBasis:"70%"}}><strong>{this.state.warningText}</strong></P3>
			  </FlexRow>
			{this.state.showOverlapButtons && <OverlapButtons handleOverlapOK={this.handleOverlapOK} handleOverlapCancel={this.handleOverlapCancel}/>}
      </FormLeft>
    );
	}
}

const OverlapButtons = (props) => (
  <FlexRow style={{flexBasis:"80%"}}>
      <RoundedButton onClick={props.handleOverlapOK} style={{height:"2.0rem", flexBasis:"60%"}}>Overlap OK</RoundedButton>&nbsp;&nbsp;
      <RoundedButton onClick={props.handleOverlapCancel} style={{height:"2.0rem", flexBasis:"40%"}}>Cancel</RoundedButton>&nbsp;&nbsp;
  </FlexRow>
)

const mapStateToProps = state => {
	return {
		studentsList: state.users.studentsList
	}
}

const mapDispatchToProps = dispatch => {
	return {
    putStudentsList: (studentsList) => { dispatch(putStudentsListInStore(studentsList)) } 
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScheduleClasses));

ScheduleClasses.propTypes = {
	putStudentsList: PropTypes.func.isRequired
}

function classAppointmentsToDB(classData) {
  return axios.post('/api/classes', classData);
}

function classEntryToDB(classEntry) {
  return axios.post('/api/classEntries', classEntry);
}

const CreateAppt = () => (
	<RectangleButton>
	  Create Appointment
	</RectangleButton>
);

function mapKeysIntoDBArray(dbArray) {
  return dbArray.map(obj => { obj.key = obj.id});
}

function getMonthNumber(month) {
	let monthNumber = 0;
  switch (month) {
  	case 'January': monthNumber = 0; break;
  	case 'February': monthNumber = 1;	break;
  	case 'March':	monthNumber = 2;	break;
  	case 'April':	monthNumber = 3; break;
  	case 'May': monthNumber = 4; break;
  	case 'June': monthNumber = 5; break;
  	case 'July': monthNumber = 6; break;
  	case 'August': monthNumber = 7; break;
  	case 'September': monthNumber = 8; break;
  	case 'October': monthNumber = 9; break;
  	case 'November': monthNumber = 10; break;
  	case 'December': monthNumber = 11; break;
  	default: monthNumber = 0;
  }
	return monthNumber
}

function changeArray(array, index, value) {
	let newArray = array;
	newArray[index] = value;
	return newArray;
}
  
// ---  Styling section ---

const NavStyle = styled.div`
  display: flex;
	flex-direction: row;
	flex: 1 100%;
	// padding: 0; no effect
	justify-content: left;
	// align-content: flex-start; // no effect
	// border: 1px solid black;
`;

const Select = styled.select`
		color: #FFFFFF;
		width: 120px;
		height: 30px;
	  margin-top: 0px;
		padding: 4px;
		font-family: 'Josefin Slab';
		font-weight: bold;
		font-size: 20px;
		text-align: center;
		background-color: DodgerBlue;
		border: 0px solid black;
		border-radius: 1px;
	  cursor: pointer;
    text-declaration: none;
	  -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-appearance: none;
     -moz-appearance: none;
		&:hover {
		  background-color: #A0CFFF;
			border: 1px solid green; 
		}
`;

const Select2 = styled(Select)`
		width: 80px;
	  margin-top: 0px;
`
const SelectSmallFont = styled(Select)`
		font-size: 22px;
`

const SelectNarrowSmallFont = styled(Select)`
    width: 60px;
		font-size: 22px;
`
const SelectWide = styled(Select)`
  width: 200px;
`

const SelectM = styled(Select)`
    height: 200px;
	  margin-top: 0px;
`

const FlexColumn = styled.div`
  display: flex;
	flex-direction: column;
`

const FlexColumnWide = styled(FlexColumn)`
	width: 200px;
	align-items: center;
`

const	FlexRow = styled.div`
  display: flex;
	flex-direction: row;
	margin-right: 10px;
	flex-wrap: wrap;
	justify-content: space-evenly;
`
const	FlexRowFirm = styled.div`
  display: flex;
	flex-direction: row;
`
const CheckboxGroup = styled.div`
		color: #FFFFFF;
		width: 160px;
		font-family: 'Josefin Slab';
		font-size: 20px;
		font-weight: bold;
		background-color: DodgerBlue;
		border: 0px solid black;
		border-radius: 1px;
	  cursor: pointer;
    text-declaration: none;
`
const Colon = styled.div`
  display: flex;
  text-align: center;
  font-family: Josefin Slab;
	font-weight: bold;
  font-size: 40px;
	padding-top: 12px;
	margin-right: 4px;
	color: DodgerBlue;
`

const Form = styled.form`
  display: flex;
	flex-direction: row;
	justify-content: flex-start;
  width: 500px;
`
  //width: "100px";
	//justify-content: center;
const NameLabel = styled(Label)`
  display: flex;
	font-size: 16px;
	${media.phone`font-size: 16px;`}
	color: DodgerBlue;
	font-family: Josefin Slab;
	width: 200px;
	margin-top: 5px;
	`
