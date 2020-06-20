import React from 'react';
import styled, { css } from 'styled-components';

// set up media.desktop, media.tablet, and media.phone
const sizes = {
	huge: 10000,
	desktop: 1280,
	tablet: 1024,  // dark green 
	phablet: 767, // hot pink   
	phone: 360,    // light blue 
	tiny: 330
}

		  //@media (max-width: ${sizes[label] / 16}em) {
const media = 
	Object.keys(sizes).reduce((acc, label) => {
		acc[label] = (...args) => css`
		  @media (max-width: ${sizes[label]}px) {
			  ${css(...args)}
			}
	  `
		return acc
	}, {});

const RoundedButton = styled.button`
		width: 8rem;
		height: 3em;
		margin: 0.0rem;
		padding: 4px;
		color: white;
		font-weight: bold;
		font-family: 'Quicksand';
		font-size: 16px;
		background-color: DodgerBlue;
		border: 0px solid black;
		border-radius: 5px;
	  cursor: pointer;
    ${media.phone`font-size: 14px;`}
    ${media.phone`width: 6rem;`}
    ${media.phone`height: 34px;`}
		&:hover {
		  background-color: white;
		  color: green;
		  border: 1px solid green; 
		}
		&:disabled { 
		  background-color: #90ff1e;
		  color: white;
		  border: 0px solid black; 
		}
`;

		// width: 120px;
const RectangleButton = styled.button`
		 height: 32px;
		padding: 8px;
		color: white;
		font-family: 'Josefin Slab';
		font-weight: bold;
		font-size: 1.0rem;
		background-color: DodgerBlue;
		border: 0px solid black;
		border-radius: 1px;
	  cursor: pointer;
		&:hover {
		  background-color: white;
			color: green;
			border: 1px solid green; 
		}
`;

  //width: 12rem;
  //flex: 1 100%;
const Input = styled.input`
	height: 1rem;
  padding: 0.5em;
	margin: 0.0em;
	margin-bottom: 1.0rem;
	font-family: 'Quicksand';
	font-weight: bold;
	color: Black;
	background: papayawhip;
	border: 1px solid black;
	border-radius: 4px;
	&:hover {
	  color: Blue;
		background: White;
	}  
	`;

const InputBlue = styled(Input)`
  color: white;
	background: DodgerBlue;
	cursor: pointer;
	font-size: 18px;
  padding: 4px;
	&:hover {
	  color: Blue;
		background: PaleGreen;
	}  
`
	  // background-color: #80bfff;
const A = styled.a`
	color: white;
	text-declaration: none;
  &:hover {
		color: green;
	};
	cursor: pointer;
`;

const Form = styled.form`
 display: flex;
 flex-direction: column;
 align-items: center;
`;

const FormLeft = styled(Form)`
  align-items: left;
`

const ErrorMsg = styled.p`
  margin-top: 0;
  margin-bottom: 1.0rem;
	padding: 0;
  font-family: Quicksand;
	font-size: 1.0rem;
	color: red;
	background-color: lemonchiffon;
`;


const TextArea = styled.div`
flex: 1 100%;
margin-top: 3rem;
margin-bottom: 1rem;
font-size: 1.6rem;
font-family: 'Josefin Slab';
font-weight: regular;
color: blue;
${media.phone`font-size: 1.2rem;`}
${media.phone`width: 90vw;`}
`;

const CenteredText = styled.div`
font-size: 1.6rem;
font-family: 'Josefin Slab';
font-weight: regular;
color: blue;
${media.phone`font-size: 1.2rem;`}
`;

const CheckboxLabel = styled.label`
font-size: 1.6rem;
font-family: 'Josefin Slab';
font-weight: regular;
color: blue;
${media.phone`font-size: 1.2rem;`}
`;

const H1 = styled.h1`
	font-family: 'Josefin Slab';
	font-size: 2.0rem;
	margin-bottom: 0.0rem;
	margin-left: 1.0rem;
	color: blue;
`;

const P = styled.p`
	font-family: 'Quicksand';
	font-size: 1.6rem;
	margin-bottom: 0.0rem;
	color: blue;
`;

const P2 = styled.p`
  font-family: Josefin Slab;
  font-size: 24px;
	margin-bottom: 10px;
	margin-right: 10px;
	color: blue;
  ${media.phone`font-size: 20px;`}
`

const P3 = styled(P2)`
  font-size: 1.2rem;
  ${media.phone`font-size: 0.8rem;`}
`

  // display:inline-block;
const Label = styled.label`
  display: flex;
	flex-direction: column;
  text-align: center;
	font-weight: bold;
	width:132px;
  font-family: Josefin Slab;
  font-size: 22px;
  ${media.phone`font-size: 20px;`}
	margin-bottom: 0.0rem;
	color: blue;
`

const Label2 = styled(Label)`
  width: 84px;
	margin-right: 0px;
`

	// margin-left: 0.0rem;
const Label3 = styled(Label)`
  width: 500px;
	font-weight: normal;
	text-align: left;
  ${media.phone`font-size: 1.0rem;`}
`

//	font-weight: bold;

const Label4 = styled.label`
  display: flex;
	flex-direction: column;
  text-align: left;
  font-family: Josefin Slab;
  font-size: 1.2rem;
	margin-bottom: 0.1rem;
	color: blue;
  ${media.phone`font-size: 1.0rem;`}
`

const Label5 = styled.label`
	font-weight: bold;
  font-family: Josefin Slab;
  font-size: 24px;
	margin-bottom: 0.0rem;
	color: blue;
  ${media.phone`font-size: 20px;`}
  text-align: center;
  ${media.phone`text-align: left;`}
`

const Label200 = styled(Label)`
  width: 200px;
`

const LabelRow = styled(Label)`
  flex-direction: row;
`

const VSpace10px = styled.div`
  height: 10px;
`

export { A, ErrorMsg, Form, FormLeft, H1, Input, InputBlue, Label, Label2, Label3, Label4, Label5, Label200, LabelRow, media, P, P2, P3, RectangleButton, RoundedButton, TextArea, CenteredText, CheckboxLabel, VSpace10px };
