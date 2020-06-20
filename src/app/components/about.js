import React from "react";
import { withRouter } from "react-router-dom";
import styled from 'styled-components';

// This is an optional component that is not implemented
//   in the current meeting scheduler.
const HomeButton = withRouter(({ history}) => (
  <Button
    onClick={() => { history.push('/') }}>
	  Home
	</Button>
))

const About = () => (
	<AboutDiv>
		<H2>The 'About' page</H2>
		&nbsp;&nbsp;<HomeButton/>
	</AboutDiv>
)

export default About;

const Button = styled.button`
		width: 95px;
		height: 34px;
		margin: 0.0em;
		color: white;
		font-family: 'Quicksand';
		font-size: 1.8rem;
		background-color: DodgerBlue;
		border: 1px solid black;
		border-radius: 5px;
`;

const AboutDiv = styled.div`
  grid-column: 1;
	grid-row: 2;
`;

const H2 = styled.h2`
	font-family: 'Quicksand';
	color: blue;
`;

