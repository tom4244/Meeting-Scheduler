import React from "react";
import { withRouter } from "react-router-dom";
import styled from 'styled-components';
import { RoundedButton } from './elements';

const HomeButton = withRouter(({ history}) => (
  <RoundedButton
    onClick={() => { history.push('/') }}>
	  Home
	</RoundedButton>
))

const QnA = () => (
	<QnAStyle>
		<H2>The 'Q&A' page</H2>
		&nbsp;&nbsp;<HomeButton />
	</QnAStyle>
)

export default QnA;

const QnAStyle = styled.div`
  grid-column: 1;
	grid-row: 2;
`;

const H2 = styled.h2`
	font-family: 'Quicksand';
	color: blue;
`;


