import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { media } from './elements';

class FlashMessage extends React.Component {
	constructor(props) {
		super(props); 
		this.onClick = this.onClick.bind(this);
	}

  onClick() {
		this.props.deleteFlashMessage(this.props.message.id);
	}

	render() {
		const { id, type, text } = this.props.message;

		if (type === 'success') {
			// console.log('Now in MessageSuccess');
  		return (
  			<Bar>
  			 <MessageSuccess>
  			    <Empty />
  			    {text}
  			    <CloseButton onClick={this.onClick}><span>&times;&nbsp;&nbsp;</span></CloseButton>
  			  </MessageSuccess> 
  			</Bar>
  		);
		} else {
			// console.log('Now in MessageError');
  		return (
  			<Bar>
  			 <MessageError>
  			    <Empty />
  			    {text}
  			    <CloseButton onClick={this.onClick}><span>&times;&nbsp;&nbsp;</span></CloseButton>
  			  </MessageError> 
  			</Bar>
  		);
		}

		/*
		const isSuccess = type === 'success';
  		return (
  			<Bar>
				{ isSuccess
  			  ? <MessageSuccess>
					: <MessageError>
				}
  		    <Empty />
  			  {text}
  			  <CloseButton onClick={this.onClick}>
				    <span>&times;&nbsp;&nbsp;</span>
				  </CloseButton>
				{ isSuccess 
  			  ? </MessageSuccess>
					: </MessageError>
				}
  			</Bar>
  		);
*/
/*		
		const isSuccess = type === 'success';
  		return (
  			<Bar>
				{ isSuccess
  			  ? <Message type="success">
					: <Message error>
				}
  		    <Empty />
  			  {text}
  			  <CloseButton onClick={this.onClick}>
				    <span>&times;&nbsp;&nbsp;</span>
				  </CloseButton>
					</Message>
  			</Bar>
  		);
*/
/*		
  		return (
  			<Bar>
				<Message>
  		    <Empty />
  			  {text}
  			  <CloseButton onClick={this.onClick}>
				    <span>&times;&nbsp;&nbsp;</span>
				  </CloseButton>
					</Message>
  			</Bar>
  		);
*/
	}
}

FlashMessage.propTypes = {
	message: PropTypes.object.isRequired,
	deleteFlashMessage: PropTypes.func.isRequired
}

export default FlashMessage;

// --- Styling section ---

const Bar = styled.div`
  display: flex;
	flex-row: row wrap;
	// justify-content: center;
	//	align-content: center;
	//	align-self: center;
  // width: 80vw;
	margin-top: 0rem;
	margin-left: 3rem;
	margin-right: 3rem;
	${media.phone`margin-left: 0.5rem;`}
  ${media.phone`margin-right: 0.5rem;`}
`;

const MessageSuccess = styled.div`
    display: flex;
		flex-direction: row;
		flex: 1 100%;
		justify-content: space-between;
		height: 3.0rem;
	  line-height: 3.2rem;	
		// color: #468847;
		color: limegreen;
		background-color: #dff0d8;
		// height: 8em;  doesn't work on Firefox
		margin: 0.0rem;
		// padding-top: 9px;
		// padding-left: 2rem;
		font-weight: bold;
		font-family: 'Josefin Slab';
		font-size: 1.6rem;
		// border: 0px solid black;
		border-radius: 6px;
		text-align: center;
	  ${media.tablet`font-size: 1.4rem;`}	
		${media.tablet`height: 4.0rem;`}
	  ${media.tablet`line-height: 1.4rem;`}	
	  ${media.tablet`padding-top: 0.8rem;`}	
	  ${media.phablet`font-size: 1.2rem;`}	
	  ${media.phone`font-size: 1.0rem;`}
`;

const MessageError = styled(MessageSuccess)`
		color: #b94a48;
		background-color: #f2dede;

`;
/*
const Message = styled.div.attrs({
		color: props => props.success ? 'limegreen' : 'crimson', 
		background-color: props => props.success ? 'darkgreen' : 'coral'})`
    display: flex;
		flex-direction: row;
		flex: 1 100%;
		justify-content: space-between;
		height: 3.0rem;
	  line-height: 3.2rem;	
		// color: #468847;
		// height: 8em;  doesn't work on Firefox
		margin: 0.0rem;
		// padding-top: 9px;
		// padding-left: 2rem;
		font-weight: bold;
		font-family: 'Josefin Slab';
		font-size: 1.6rem;
		// border: 0px solid black;
		border-radius: 6px;
		text-align: center;
	  ${media.tablet`font-size: 1.4rem;`}	
		${media.tablet`height: 4.0rem;`}
	  ${media.tablet`line-height: 1.4rem;`}	
	  ${media.tablet`padding-top: 0.8rem;`}	
	  ${media.phablet`font-size: 1.2rem;`}	
	  ${media.phone`font-size: 1.0rem;`}
`;
*/
const Empty = styled.div`
// empty div to help align text in center and close button ('x') at right of bar
  justify-content: flex-start;
`;

const CloseButton = styled.button`
  background: none;
	border: none;
	margin: 0;
	padding: 0;
  color: tomato;
	font-size: 1.4rem;
  font-weight: bold;
	justify-content: flex-end;
	align-self: flex-start;
	cursor: pointer;
	// display: flex;
	// flex-direction: row;
`;
