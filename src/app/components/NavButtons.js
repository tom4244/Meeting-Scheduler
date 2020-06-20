import React from 'react';
import { withRouter } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { A, media, RectangleButton } from './elements';

// This is part of an optional teacher/class variation.
// These Nav Buttons aren't used in the basic meeting scheduler.

class NavButtons extends React.Component {
	render() {
		return (
    	<NavStyle>
        <ChooseSubjectDD/>
        <ChooseTeacherDD/> 
        <QnAButton/>
    	</NavStyle>
    );
	}
}

export default NavButtons;

const ChooseSubjectDD = () => (
			<SelectUl>Subjects
				<ChooseLi><A>English</A></ChooseLi>
				<ChooseLi><A>日本語</A></ChooseLi>
				<ChooseLi><A>Francaise</A></ChooseLi>
			</SelectUl>
)

const ChooseTeacherDD = () => (
			<SelectUl><A>Teachers</A>
				<ChooseLi><A>Mr. Smith</A></ChooseLi>
				<ChooseLi><A>Ms. Brown</A></ChooseLi>
				<ChooseLi><A>Mr. Robinson</A></ChooseLi>
			</SelectUl>
)

const QnAButton = withRouter(({ history }) => (
	<RectangleButton
<<<<<<< HEAD
    onClick={() => { history.push('/QnA') }}>
=======
    onClick={() => { history.push('/mtgScheduler/QnA') }}>
>>>>>>> e07d06384599f8d203e01596445f0b0d10e68a50
	  Q&A
	</RectangleButton>
));

// ---  Styling section ---

const NavStyle = styled.div`
  display: flex;
	flex-direction: row;
	flex: 1 100%;
	// padding: 0; no effect
	justify-content: center;
	// align-content: flex-start; // no effect
	// border: 1px solid black;
`;

		// padding: 0.4em;
		// margin: 0.0rem;
		// padding: 6px;
const SelectUl = styled.ul`
		color: #FFFFFF;
		width: 120px;
		height: 16px;
	  margin-top: 0px;
		padding: 8px;
		font-family: 'Josefin Slab';
		font-weight: bold;
		font-size: 1.4rem;
		text-align: center;
		background-color: DodgerBlue;
		border: 0px solid black;
		border-radius: 1px;
	  cursor: pointer;
    text-declaration: none;
		&:hover {
		  background-color: #A0CFFF;
			border: 1px solid green; 
		}
`;
  
	// border: 1px solid black;
	// padding: 6px;
	// height: 20px;
	// top: 9px;
const ChooseLi = styled.li`
  visibility: hidden;
	position: relative;
	width: 126px;
	height: 16px;
	left: -9px;
	margin-top: 0px;
	top: 2px;
	padding: 6px;
	text-align: center;
	vertical-align: middle;
	background-size: contain;
	background-color: DodgerBlue;
	list-style-type: none;
	font-size: 1.0rem;
	color: white; 
  ${SelectUl}:hover & {
	  visibility: visible;
	  &:hover {
	    background-color: white;
		  color: green;
	    width: 124px;
			border: 1px solid green; 
	  }
  }
`;

