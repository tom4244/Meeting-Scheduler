import React from "react";
import { withRouter } from "react-router-dom";
import styled from 'styled-components';
import NavButtons from './NavButtons';
import WelcomePagePic from '../img/meeting.jpg';
import { media, RoundedButton } from './elements';

const WhtBdButton = withRouter(({ history}) => (
  <RoundedButton
    onClick={() => { history.push('/whiteboard') }}>
    Whiteboard 
  </RoundedButton>
))

class Home extends React.Component {
	render() {
		return (
    	<HomeDiv>
	      <TitlesDiv>
		       <H3>Meeting Scheduler</H3>
	         <TextDiv style={{margin: 0}}>Keep track of multiple meetings or classes</TextDiv>
	      </TitlesDiv>
    	  <SchedulerIntro />
    	</HomeDiv>
    );
	}
}

export default Home;

const SchedulerIntro = () => (
	<SchedulerIntroDiv>
	  <MeetingImg/>
	  <MeetingText/> 
	</SchedulerIntroDiv>
)	

const MeetingText = () => (
	<TextDiv>
	* <strong>Meetings</strong> can be scheduled. <br/>* Meeting participants can <strong>view schedules</strong> of meetings they are scheduled to attend.<br/>* An online real-time <strong>whiteboard</strong> is provided.	
	</TextDiv>
)

// --- Styling section ---
//

const HomeDiv = styled.div`
    background-size: cover;
	  background-color: aliceblue;
    height: 100%;
    display: flex;
	  flex-direction: column;
`;

const TitlesDiv = styled.div` 
		font-weight: bold;
		font-size: 2.0rem;
		color: forestgreen 
	  margin-top: 0rem;
	  margin-bottom: 0.4rem;
`;

const SchedulerIntroDiv = styled.div`
  display: flex;
  flex-direction: column;
	flex-wrap: wrap;
	justify-content: flex-start;
	${media.huge `flex-direction: row;`}
	${media.huge `flex-wrap: nowrap;`}
	${media.tablet `flex-direction: row;`}
	${media.tablet `align-items: flex-start;`}
	${media.tablet `flex-wrap: wrap;`}
	${media.phablet `margin: 0 auto;`}
	${media.phablet `flex-wrap: wrap;`}
`;

// These are the dimensions of the meeting.jpg image
const AspectRatio = 512.0 / 768.0;

const MeetingImg= styled.div`
  display: flex;
	flex: 0 0 100%;
  background-image: url(${WelcomePagePic});
  background-size: contain;
	background-repeat: no-repeat;

	margin: 1rem;
  justify-content: flex-start;

	${media.huge`flex: 0 0 50%;`}
	${media.huge`flex-direction: row;`}
	${media.huge`flex-wrap: nowrap;`}
	${media.huge`width: 50vw;`}
  ${media.huge`height: calc(90vw * ${AspectRatio})`};
	${media.tablet`flex: 0 0 100%;`}
	${media.tablet`justify-content: flex-start;`}
  ${media.tablet`height: 317px;`}
	${media.tablet` max-height: 317px;`}
	${media.tablet`max-width: calc(317px / ${AspectRatio});`}

  ${media.phablet`height: calc(90vw * ${AspectRatio})`};
	${media.phablet`max-height: 476px;`}  
	${media.phablet`width: 90vw;`}  
	${media.phablet`max-width: 526px;`}
	${media.phablet`order: 0;`}

  ${media.phone`height: calc(90vw * ${AspectRatio})`};
	${media.phone`max-height: 317px;`}
	${media.phone`width: 90vw;`}
  ${media.phone`max-width: calc(317px / ${AspectRatio})`};
`;

 const TextDiv = styled.div` 
  margin: 0px;
	font-family: Josefin Slab;
	font-size: 30px;
	justify-content: flex-start;
	flex-wrap: wrap;
	margin-right: 14px;
	${media.phone`font-size: 16px;`}
	${media.phone`margin-left: 10px;`}
	${media.phone`margin-right: 14px;`}
`;  

const H3 = styled.h3`
	font-family: 'Josefin Slab';
	margin-bottom: 0.0rem;
	color: blue;
`;

/*  Not currently used; optional for future use
const QnAButton = withRouter(({ history}) => (
  <RoundedButton
    onClick={() => { history.push('/QnA') }}>
	  Q&A
	</RoundedButton>
))

const NewEventButton = withRouter(({ history}) => (
  <RoundedButton
    onClick={() => { history.push('/new-event') }}>
	  New Event 
	</RoundedButton>
))

*/

	
