import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import styled from 'styled-components';

import LogoImagePic from '../img/scheduler-101-blue.png';
import LogoImagePicPink from '../img/scheduler-101-pink.png';
import LogoImagePicTan from '../img/scheduler-101-tan.png';
import ScalePic from '../img/horiz-res-reference.png';
import { A, media } from './elements';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../actions/authActions';

class HeaderMenu extends React.Component {
	constructor(props) {
		super(props);
	}

 	render() {
		const { isAuthenticated } = this.props.auth;

  	const LogoImage = withRouter(({ history }) => (
      <LogoImgStyle onClick={() => { history.push('/') }} />
  ));
  
    const SignUp = withRouter(({ history }) => (
      <SignUpLink onClick={() => { history.push('/signup') }}>
    	    Sign up
      </SignUpLink>
    ));
    	
    const LogIn = withRouter(({ history }) => (
      <LogInLink onClick={() => { history.push('/login') }}>
    	   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Log in&nbsp;&nbsp;
      </LogInLink>
    ));
    
    const LogOut = withRouter(({ history }) => (
      <LogOutLink onClick={() => { 
	  	this.props.logout();
		  history.push('/');
			}}>
    	   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Log out&nbsp;&nbsp;
      </LogOutLink>
    ));

	  if (isAuthenticated) {
	  	  return (
        	<HeaderStyle>
        	  <LogoImage />
	  	  	  <LogOut />
        	</HeaderStyle>
        );
	  	} else {
	  	    return (
          	<HeaderStyle>
          	  <LogoImage />
            	<Membership>
                 <SignUp />
                 <LogIn />
            	</Membership>
          	</HeaderStyle>
          );
	      }
  }
}

HeaderMenu.propTypes = {
	auth: PropTypes.object.isRequired,
	logout: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	return {
		auth: state.auth
	};
}

const mapDispatchToProps = dispatch => {
	return {
		logout: () => { dispatch(logout())}
	}
}

// export default withRouter(connect(mapStateToProps, { logout })(HeaderMenu));
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderMenu));

// ---  Styling section ---

const HeaderStyle = styled.header`
  display: flex;
	flex-flow: row wrap;
	flex: 0 auto;
	justify-content: space-between;
	background-color: LightSkyBlue;
	${media.tablet `justify-content: center;`} 
	${media.desktop`background-color: SandyBrown;`}
	${media.tablet`background-color: DarkSeaGreen;`}
	${media.phablet`background-color: HotPink;`}
	${media.phablet `display: block;`}
	${media.phablet `margin: 0 auto;`}
	${media.phone`background-color: LightSkyBlue;`}
`;

const LogoImgStyle = styled.div`
  background-image: url(${LogoImagePic});
	background-repeat: no-repeat;
	background-size: contain;
	height: 68px;
	width: 300px;
	background-size: 300px;
	cursor: pointer;
	${media.huge`background-image: url(${LogoImagePic});`}
	${media.desktop`background-image: url(${LogoImagePicTan});`}
	${media.tablet `display: flex;`}
	${media.tablet `flex-direction: row;`}
	${media.tablet `margin: 0;`}
	${media.tablet `justify-content: flex-start;`}
	${media.tablet `flex: 1 auto;`}
	${media.tablet `background-image: url(${LogoImagePic});`}
	${media.phablet `display: block;`}
	${media.phablet `margin: 0 auto;`}
	${media.phablet `background-image: url(${LogoImagePicPink});`}
	${media.phone`background-image: url(${LogoImagePic});`}

`;

const Membership = styled.div`
display: flex;
flex-row: row wrap;
flex: 0 auto;
justify-content: flex-end;
`;

const SignUpLink = styled(A)`
  display: flex;
	flex-direction: row;
	justify-content: flex-end;
	font-family: 'Josefin Slab';
	font-size: 22px;
	font-weight: bold;
	color: blue;
  // border: 1px solid blue;
	${media.phablet `flex: 0 auto;`} 
	${media.phone `font-size: 12px;`} 
`;

const LogInLink = styled(A)`
  display: flex;
	flex-direction: row;
	justify-content: flex-end;
	font-family: 'Josefin Slab';
	font-size: 1.2rem;
	font-weight: bold;
	color: blue;
  // border: 1px solid blue;
	${media.phablet `flex: 0 auto;`} 
`;

const LogOutLink = styled(A)`
  display: flex;
	flex-direction: row;
	justify-content: flex-end;
	font-family: 'Josefin Slab';
	font-size: 1.2rem;
	font-weight: bold;
	color: blue;
  // border: 1px solid blue;
	${media.phablet `flex: 0 auto;`} 
`;

// This is an image that shows little pips 
//   at the approximate boundaries for
//   page width of different devices like
//   smartphones vs tablets, etc
const ScalePicture = styled.div`
  background-image: url(${ScalePic});
	background-repeat: no-repeat;
	height: 5px;
	width: 1440px;
`;
	/* ${media.phablet `flex: 1 100%;`} */
	/* ${media.phablet `justify-content: flex-end;`} */

// --- Unused, for reference only section ---
{/*
	> a { 
	      color: white 
			}
*/}
  
/*
const LogIn = () => (
	<LogInDiv>
    <Button>Sign Up</Button>
    <Button>Log In</Button>
	  <Input placeholder="Username" type="text" />
	  <Input placeholder="Password" type="password" />
	</LogInDiv>
) 
*/

/*
const LogInDiv = styled.div`
  display: flex;
	flex-direction: row;
	flex: 1 100%;
	flex: 1 auto;
	justify-content: flex-end;
	${media.tablet`flex: 1 auto;`}
	${media.tablet`justify-content: flex-end;`}
	${media.phablet`margin: 0.5em;`}
	${media.phablet`justify-content: center;`}
	${media.phablet`flex: 1 auto;`}
	> Button { ${media.tiny `font-size: 10px;`}}
`;
*/

