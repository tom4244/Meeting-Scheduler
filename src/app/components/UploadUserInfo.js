import React from 'react';
import styled, { css } from 'styled-components';
import {InputBlue, Label, Label5, LabelRow, media, RoundedButton, VSpace10px} from './elements';
import { PropTypes } from 'prop-types';
import axios from 'axios';
import AnonymousPic from '../img/userPhotos/anonymous.jpg';
import { setIsSignup } from '../actions/authActions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class UploadUserInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedPhotoFile: {},
			selfIntroText: "",			
			selfIntroUpdated: false,
			updatedIndicator: "",
			startTime: new Date(),
			endTime: new Date(),
			subjects: "Please enter typical types of meetings you attend here: "
		}

		this.OnChooseTeacherPhoto = this.OnChooseTeacherPhoto.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleSelfIntroChange = this.handleSelfIntroChange.bind(this);
		this.handleSubjectsChange = this.handleSubjectsChange.bind(this);
		this.handleSubjectsClick = this.handleSubjectsClick.bind(this);
		this.setSelfIntroTextAtStart = this.setSelfIntroTextAtStart.bind(this);
		this.setSubjectsAtStart = this.setSubjectsAtStart.bind(this);
	}

  componentDidMount() {
		this.intervalID = setInterval(
			() => this.tick(),
			2000
    );
		setTimeout(() => {
		  this.setSelfIntroTextAtStart();
		  this.setSubjectsAtStart();
		}, 500);
		
	}

	componentWillUnmount() {
    clearInterval(this.intervalID);
	}

	tick() {
		this.setState({
			endTime: new Date()
		});
	}

  OnChooseTeacherPhoto (e) {
		const enteredFile = e.target.files[0];
		this.props.setIsSigningUp(false);
		switch (e.target.name) {
      case 'selectedPhotoFile':
	      this.setState({ selectedPhotoFile: enteredFile });
        break;
      default:
            this.setState({ [e.target.name]: e.target.value });
        }
    let formData = new FormData();
		formData.append('teacher', this.props.teacher);
    formData.append('selectedPhotoFile', enteredFile);
    axios.post('/api/uploadPhoto', formData)
      .then((result) => {
				console.log("result in UploadUserInfo: ", result);
      })
	    .catch (errors => console.log("Errors in OnChooseTeacherPhoto: ", errors));
  }

	handleSelfIntroChange(event) {
    this.setState({selfIntroText: event.target.value, updatedIndicator: "Updated"}); 
	}

	handleSubmit (event) {
		event.preventDefault();
		const dataString = {teacher: this.props.teacher, selfIntro: this.state.selfIntroText};
			axios.post('/api/selfIntro', dataString) 
		  .then((result) => {
      })
	    .catch (errors => console.log("Errors in handleSubmit: ", errors));
	}
 
  handleSubjectsChange(event) {
    this.setState({subjects: event.target.value}); 
	}  

	handleSubjectsClick(event) {
		event.preventDefault();
		console.log("subjects in handleSubjectsClick", this.state.subjects);
		const dataString = '{"teacher":"' + this.props.teacher + '", "subjects":"' + this.state.subjects + '"}';
		
		return axios.post('/api/uploadSubjects', JSON.parse(dataString))
      .then((result) => {
				console.log("result in handleSubjectsClick: ", result);
      })
	    .catch (errors => console.log("Errors in handleSubjectsClick: ", errors));
	}

	getSelfIntro(teacher) {
    return axios.get(`/api/selfIntro/${teacher}`);
	}
	
	getSubjects(teacher) {
    return axios.get(`/api/uploadSubjects/${teacher}`);
	}
	
  setSelfIntroTextAtStart() {
	  this.getSelfIntro(this.props.teacher)
	  .then(data => {
	    this.setState({selfIntroText: data.data.text});
    })  
		.catch(error => console.log("Error in setSelfIntroText: ", error))
	}

  setSubjectsAtStart() {
		console.log("teacher at setSubjectsAtStart: ", this.props.teacher);
	  this.getSubjects(this.props.teacher)
	  .then(data => {
			console.log("data in setSubjectsAtStart: ", data.data.data);
	    this.setState({subjects: data.data.data[0].subjects});
    })  
		.catch(error => console.log("Error in setSubjects: ", error))
	}

    photoImage(name, imagefile) {
			this.name = name;
			this.imagefile = imagefile;
		}

    importAll(r) {
      return r.keys().map(r);
    }

		getImages() {
      const rc = require.context('../img/userPhotos', false, /\.jpg$/);
      const importNames = (rc) => rc.keys().map(file => file.match(/[^\/]+$/)[0]);
			const binaries = this.importAll(rc);
      const filenames = importNames(rc);
			const images = [];
			for (let i=0;i<filenames.length;i++) {
        images.push({
					name: filenames[i],
          binary: binaries[i]
				});
			};
      return images;
    }

	render() {
    const { selectedPhotoFile } = this.state;
    const Fragment = React.Fragment;

		const imageFiles = this.getImages();
		const defaultPhoto = imageFiles.filter(pic => pic.name === 'anonymous.jpg');
		const thePhoto = imageFiles.filter(pic => pic.name === this.props.teacher + '.jpg');
		const userPhoto = thePhoto.length !== 0 ? thePhoto[0].binary : defaultPhoto[0].binary;
		return (
			<Fragment>

      <form onSubmit={this.handleSubmit} name="selfIntroForm">
			  <Label5 >Upload/Change Personal Photo and Self-Introduction</Label5>
			  <VSpace5px/>
			  <Photo src={userPhoto} />

  			  <BrowseInputLabel>Choose Personal Photo
          <BrowseInput
            type="file"
            name="selectedPhotoFile"
            onChange = {this.OnChooseTeacherPhoto}
          />
  			  </BrowseInputLabel>&nbsp;&nbsp;

          <InputColumn>
            <Textarea name="selfIntro" form="selfIntroForm"		
  	           value={this.state.selfIntroText ? this.state.selfIntroText : ""}
  	           onChange = {this.handleSelfIntroChange}>
            </Textarea>
			      <VSpace5px/>
            <RoundedButton type="submit" style={{width: '200px'}}>Enter Self-Intro</RoundedButton>

			      <VSpace10px/>
			      <VSpace10px/>
            <InputRow style={{flexWrap: "wrap"}}>
			      <Label5 style={{marginRight: 10}}>Typical meeting types:</Label5>
  			      <SubjectInput onChange = {this.handleSubjectsChange} value={this.state.subjects} id="subjects" type="text" />
            </InputRow> 
          </InputColumn>


			  <VSpace5px/>
			  <InputRow>

		      <InputColumn>
		      </InputColumn>
          <RoundedButton type="button" onClick={this.handleSubjectsClick} style={{width: '200px'}}>Enter Types</RoundedButton>
			    <Label style={{fontSize: "1.0rem", alignSelf: "center"}}>{this.state.endTime < (this.state.startTime + 2000) ? "updated" : ""}</Label>
			  </InputRow>
			  <VSpace5px/>
			  <VSpace5px/>
			  <VSpace5px/>
		    <Label5>{this.updatedIndicator}</Label5> 
		
      </form>

  		<Label5>{selectedPhotoFile.name}</Label5>
		    <Label5>{this.updatedIndicator}</Label5> 
			</Fragment>
		);
	}
}

UploadUserInfo.propTypes = {
	setIsSigningUp: PropTypes.func.isRequired
}

const mapStateToProps = state => {
	return {
		isSignup: state.auth.isSignup
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setIsSigningUp: (isSignup) => { dispatch(setIsSignup(isSignup)) }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadUserInfo);

const BrowseInput = styled.input.attrs({
  type: 'file',
  label: 'Select Photo File',
  id: 'file-upload',
	encType: 'multipart/form-data'
})`
	display: none;
	margin-bottom: 1rem;
`;

const BrowseInputLabel = styled.label`
  for: 'file-upload';
	display: flex;
  border: 0px solid black;
	background: DodgerBlue;
	color: white;
	font-family: 'Quicksand';
	font-weight: bold;
	cursor: pointer;
	border-radius: 5px;
	width: 8rem;
	${media.phone`font-size: 14px;`}
	${media.phone`height: 20px;`}
	padding: 8px;
		&:hover {
		  background-color: white;
		  color: green;
		  border: 1px solid green; 
		}
`;

const InputRow = styled.div`
  display: flex;
	flex-direction: row;
	${media.phone`flex-direction: column;`}
	justify-content: flex-start;
	align-items: flex-start;
`

const InputColumn = styled.div`
  display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
`

	//font-size: 1.2rem;
	const Textarea = styled.textarea.attrs({
  rows: '8',
	columns: '30'
})`
  display: flex;
	height: 220px;
	${media.phone`height: 120px;`}
  width: 500px;
	${media.phone`width: 300px;`}
	font-size: 20px;
	${media.phone`font-size: 12px;`}
`
const VSpace5px = styled.div`
  height: 5px;
`

const Photo = styled.img`
  height: 200px;   
`

const SubjectInput = styled.input`
  height: 26px; 
	width: 400px; 
	${media.phone`width: 300px;`}
	marginRight: 10px;
	font-family: Josefin Slab;
	font-size: 22px;
	${media.phone`font-size: 18px;`}
`
const AspectRatio = 512.0 / 768.0;

   // background-image: url(${TeacherPic});
const PhotoImg= styled.div`
   display: flex;
   flex: 0 0 100%;
   background-image: url(${'../img/userPhotos/anonymous.jpg'});
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

