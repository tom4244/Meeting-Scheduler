import React, { Component } from 'react';
import { SketchPad, TOOL_ERASER, TOOL_PENCIL, TOOL_LINE, TOOL_RECTANGLE, TOOL_ELLIPSE, TOOL_TEXT } from './../components';
import styled from 'styled-components'; 
import { A, Label, media, RectangleButton, RoundedButton } from './elements';
import Line1Pixel from '../img/1pix.png';
import Line3Pixel from '../img/3pix.png';
import Line5Pixel from '../img/5pix.png';
import Line10Pixel from '../img/10pix.png';
import Line15Pixel from '../img/15pix.png';
import Line20Pixel from '../img/20pix.png';
import eraserImg from '../img/eraser.png';
import pencilImg from '../img/pencil.png';
import ellipseImg from '../img/ellipse.png';
import rectangleImg from '../img/rectangle.png';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import io from 'socket.io-client';
import config from '../../../server/config.js';

const socket = io(config.socketAddr); 

const HomeButton = withRouter(({ history}) => (
  <RoundedButton
    onClick={() => { history.push('/') }}>
	  Home
	</RoundedButton>
))

class WhtBdPage extends Component {

  constructor(props) {
    super(props);
    this.resize = this.resize.bind(this);
		this.setState = this.setState.bind(this);
		this.clearItemsList = this.clearItemsList.bind(this);
		this.setFillColor = this.setFillColor.bind(this);
		this.addToUndoList = this.addToUndoList.bind(this);
		this.clearAll = this.clearAll.bind(this);
		this.doClear = this.doClear.bind(this);
		this.doUndo = this.doUndo.bind(this);
		this.doRedo = this.doRedo.bind(this);

    this.state = {
      tool:TOOL_TEXT,
      size: 3,
      color: '#2120AC',
      fill: false,
      fillColor: '#2120AC',
			chars: "",
			fontFamily: 'Quicksand',
			fontSize: 18,
			textboxVisibility: "visible",
			clear: false,
			undo: false,
			redo: false,
      items: [],
      undo_list: [],
      redo_list: [],
			width: 600,
      height: 450
    };
  }

	componentDidMount() {
		
		socket.on("undo", this.doUndo);
    socket.on("addItem", item => 
			this.setState({items: this.state.items.concat([item]),
		                 undo_list: this.state.undo_list.concat([item])}));
		socket.on("clear", this.doClear);

		socket.on("redo", this.doRedo);
		
		this.resize();
		window.addEventListener('resize', this.resize.bind(this));
  };

	componentWillUnmount() {
		console.log("Now at whtBdPage.js componentWillUnmount");
		window.removeEventListener('resize', this.resize.bind(this));
		    socket.off("addItem");
		    socket.off("undo");
		    socket.off("redo");
		    socket.off("clear");
	};

	doUndo() {
		if (this.state.undo_list.length == 0) return;
		let tempList = this.state.undo_list.slice();
		let undoneItem = tempList.pop();
		let tempList2 = this.state.redo_list.concat(undoneItem);
		this.setState(state => { 
			return {
			  undo_list: tempList, 
				redo_list: tempList2,
				items: [],
				undo: true
			}
		});
	};

  doClear() {
		this.setState(state => { 
			return {
        clear: true
			}
		});
	};

  doRedo() {
		if (this.state.redo_list.length == 0) return;
		let tempList = this.state.redo_list.slice();
		let redoneItem = tempList.pop();
		let tempList2 = this.state.undo_list.concat(redoneItem);
		this.setState(state => { 
			return {
			  redo_list: tempList, 
				undo_list: tempList2,
				items: [],
			  redo: true
			}
		});
	};

  addToUndoList(data) {
		let tempList = this.state.undo_list.slice();
		this.setState(state => {
			return {
			  undo_list: tempList.concat(data),
				// force a re-render
			  fillColor: this.state.fillColor
			}
		});
	};
  
	clearAll() {
		this.setState(state => {
			return {
				items: [],
				undo_list: [],
				redo_list: [],
				// force a re-render
			  fillColor: this.state.fillColor
			}
		});
	}

  setFillColor(color) {                                  
    this.setState({fillColor: color});                   
  };

	getWidth(id){
		var element = document.getElementById(id);
		 console.log("WBP element: ", element);
    var style = window.getComputedStyle(element);
    console.log("WBP style: ", style);
		var compWidth = style.getPropertyValue('width');
	  console.log("getWidth compWidth: ", compWidth); 	
		return(compWidth);
  };
  
  resize() {
		console.log("window.innerWidth: ", window.innerWidth);
		if(window.innerWidth < 340) {
			this.setState({ width: 200, height: 150 });
		} else {
		if(window.innerWidth < 480) {
			this.setState({ width: 320, height: 240 });
		} else {
		if(window.innerWidth < 620) {
			this.setState({ width: 460, height: 345 });
		} else {
    this.setState({ width: 600, height: 450 });
		}}}
	};

  updateDimensions() {
    if(window.innerWidth < 500) {
      this.setState({ width: 450, height: 102 });
    } else {
      let update_width  = window.innerWidth-100;
      let update_height = Math.round(update_width/4.4);
      this.setState({ width: update_width, height: update_height });
    }
  }	
	
	clearItemsList() {
	  this.setState(state => {
			return {
				items: [],
	      // force a re-render
	      fillColor: this.state.fillColor
			}
	  });
	}

	render() {
    const { tool, size, color, fill, fillColor, chars, fontFamily, fontSize, textboxVisibility, clear, undo, redo, undo_list, redo_list, items, width, height, clearItemsList, setFillColor, doUndo, doRedo, addToUndoList, clearAll } = this.state;

    var textbox = 
        <div style={{marginBottom: 5}}>
					<i style={{fontSize:16}}>Enter text in the textbox below, then click on the whiteboard to place it.</i><br />
          <Textarea type="text" id="textbox" name="textbox" value={chars} onChange={(e) => this.setState({chars: e.target.value})} />
        </div> 

        // history.push('/teacherPage');
		const ReturnToPrevPage = withRouter(({ history }) => (
      <ReturnLink onClick = {() => {
        history.goBack();
      }}>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return to previous page&nbsp;&nbsp;
      </ReturnLink>
    ));
  
		this.height = this.width * 0.75;

    return (
      <div>
			  <ReturnToPrevPage />
        <Title>Whiteboard</Title>
  			<WhiteboardDiv id="whiteboarddiv"> 
            <SketchPad 
			        id={"canvasdiv"} 
              animate={true}
              tool={tool}
              size={size}
              color={color}
  			      fill={fill}
              fillColor={fill ? fillColor : ''}
  			      chars={chars}
  			      fontFamily={fontFamily}
  			      fontSize={fontSize}
  			      textboxVisibility={textboxVisibility}
  			      clear={clear}
  			      undo={undo}
  			      redo={redo}
			        undo_list={undo_list}
			        redo_list={redo_list}
              items={items}
			        clearItemsList={this.clearItemsList}
  			      resetClear={() => this.state.clear = false}
  			      resetUndo={() => this.state.undo = false}
  			      resetRedo={() => this.state.redo = false}
              onCompleteItem={(i) => socket.emit("addItem", i)}
              width={width}
  			      height={height}
			        setFillColor={this.setFillColor}
			        doUndo={this.doUndo}
			        doRedo={this.doRedo}
			        addToUndoList={this.addToUndoList}
			        clearAll={this.clearAll}
            />
  
          <UndoRedoClearRow>

  			    <RectangularButton
  			      onClick = {() => {
								socket.emit("undo"),
								this.doUndo() 
							}}
  			    >Undo</RectangularButton> 

  			    <RectangularButton
  			      onClick = {() => {
								socket.emit("redo"),
								this.doRedo()
							}}
  			    >Redo</RectangularButton> 

            <RectangularButton
  			      onClick = {() => {
								socket.emit("clear"),
								this.setState({clear:true}) 
							}}
            >Clear</RectangularButton>

          </UndoRedoClearRow>
					<i style={{fontSize:16}}>Choose text here or one of the drawing tools below to start.</i><br />
          
				  </WhiteboardDiv>  
          <ToolsDiv>
            <ButtonText
              style={tool == TOOL_TEXT ? {fontWeight:'bold', color:'DodgerBlue', backgroundColor:'#c8ff8f' } : undefined}
              className={tool == TOOL_TEXT ? 'item-active' : 'item'}
              onClick={() => this.setState({tool:TOOL_TEXT})}
            >Text</ButtonText>

		    	{textbox}
			      <UndoRedoClearButton
			        onClick = {() => {this.setState({chars: ""})}}
			      >Clear Text</UndoRedoClearButton><br />

            <label style={{fontSize:18, marginTop:10}}>Font size </label><br />
            <AlignedBar>			
			        <RectangularButton
			          style={fontSize == 8 ? {fontSize:'8px',fontWeight:'bold', color:'DodgerBlue', backgroundColor:'#c8ff8f'} : {fontSize:'8px'}}
			          className={fontSize == 8 ? 'item-active' : 'item'}
			          onClick={() => this.setState({fontSize:8})}
			        >8</RectangularButton>
			        <RectangularButton
			          style={fontSize == 12 ? {fontSize:'12px',fontWeight:'bold', color:'DodgerBlue', backgroundColor:'#c8ff8f'} : {fontSize:'12px'}}
			          className={fontSize == 12 ? 'item-active' : 'item'}
			          onClick={() => this.setState({fontSize:12})}
			        >12</RectangularButton>
			        <RectangularButton
			          style={fontSize == 18 ? {fontSize:'18px',fontWeight:'bold', color:'DodgerBlue', backgroundColor:'#c8ff8f'} : {fontSize:'18px'}}
			          className={fontSize == 18 ? 'item-active' : 'item'}
			          onClick={() => this.setState({fontSize:18})}
			        >18</RectangularButton>
			        <RectangularButton
			          style={fontSize == 24 ? {fontSize:'24px',fontWeight:'bold', color:'DodgerBlue', backgroundColor:'#c8ff8f'} : {fontSize:'24px'}}
			          className={fontSize == 24 ? 'item-active' : 'item'}
			          onClick={() => this.setState({fontSize:24})}
			        >24</RectangularButton>
			        <RectangularButton
			          style={fontSize == 30 ? {fontSize:'30px',fontWeight:'bold', color:'DodgerBlue', backgroundColor:'#c8ff8f'} : {fontSize:'30px'}}
			          className={fontSize == 30 ? 'item-active' : 'item'}
			          onClick={() => this.setState({fontSize:30})}
			        >30</RectangularButton>
			        <RectangularButton
			          style={fontSize == 36 ? {fontSize:'36px',fontWeight:'bold', color:'DodgerBlue', backgroundColor:'#c8ff8f'} : {fontSize:'36px'}}
			          className={fontSize == 36 ? 'item-active' : 'item'}
			          onClick={() => this.setState({fontSize:36})}
			        >36</RectangularButton><br />
			</AlignedBar>
			<RangeBar>
              <input min="8" max="36" type="range" value={fontSize} onChange={(e) => this.setState({fontSize: parseInt(e.target.value)})} />
              <RangeWindow>&#8199;{fontSize}</RangeWindow> 
			</RangeBar><br />

              <label style={{fontSize:18}}>Drawing Tools</label><br />
			<AlignedBar>

            <ButtonIcon
              style={tool == TOOL_PENCIL ? {fontWeight:'bold', backgroundColor:'#c8ff8f'} : undefined}
              className={tool == TOOL_PENCIL  ? 'item-active' : 'item'}
              onClick={() => this.setState({tool:TOOL_PENCIL, clear:false})}
            ><img src={pencilImg}/></ButtonIcon>

            <ButtonIcon
              style={tool == TOOL_LINE ? {fontWeight:'bold', backgroundColor:'#c8ff8f'} : undefined}
              className={tool == TOOL_LINE  ? 'item-active' : 'item'}
              onClick={() => this.setState({tool:TOOL_LINE})}
            ><img src={Line1Pixel}/></ButtonIcon>
      
			      <ButtonIcon
              style={tool == TOOL_ELLIPSE ? {fontWeight:'bold', backgroundColor:'#c8ff8f'} : undefined}
              className={tool == TOOL_ELLIPSE  ? 'item-active' : 'item'}
              onClick={() => this.setState({tool:TOOL_ELLIPSE})}
            ><img src={ellipseImg}/></ButtonIcon>

            <ButtonIcon
              style={tool == TOOL_RECTANGLE ? {fontWeight:'bold', backgroundColor:'#c8ff8f'} : undefined}
              className={tool == TOOL_RECTANGLE  ? 'item-active' : 'item'}
              onClick={() => this.setState({tool:TOOL_RECTANGLE})}
            ><img src={rectangleImg}/></ButtonIcon>
			
            <ButtonIcon
              style={tool == TOOL_ERASER ? {fontWeight:'bold', backgroundColor:'#c8ff8f'} : undefined}
              className={tool == TOOL_ERASER  ? 'item-active' : 'item'}
              onClick={() => this.setState({tool:TOOL_ERASER, size:20, color:'#ffffff'})}
            ><img src={eraserImg}/></ButtonIcon>

			</AlignedBar>
     
              <label style={{fontSize:18}}>Thickness </label><br />
            <AlignedBar>			
			        <RectangularButton size1
			          style={size == 1 ? {fontWeight:'bold', backgroundColor:'#c8ff8f'} : undefined}
			          className={size == 1 ? 'item-active' : 'item'}
			          onClick={() => this.setState({size:1})}>
         			  <img src={Line1Pixel} /> 
			        </RectangularButton>
			        <RectangularButton
			          style={size == 3 ? {fontWeight:'bold', backgroundColor:'#c8ff8f'} : undefined}
			          className={size == 3 ? 'item-active' : 'item'}
			          onClick={() => this.setState({size:3})}>
         			  <img src={Line3Pixel} /> 
			        </RectangularButton>
			        <RectangularButton
			          style={size == 5 ? {fontWeight:'bold', backgroundColor:'#c8ff8f'} : undefined}
			          className={size == 5 ? 'item-active' : 'item'}
			          onClick={() => this.setState({size:5})}>
         			  <img src={Line5Pixel} /> 
			        </RectangularButton>
			        <RectangularButton
			          style={size == 10 ? {fontWeight:'bold', backgroundColor:'#c8ff8f'} : undefined}
			          className={size == 10 ? 'item-active' : 'item'}
			          onClick={() => this.setState({size:10})}>
         			  <img src={Line10Pixel} /> 
			        </RectangularButton>
			        <RectangularButton
			          style={size == 15 ? {fontWeight:'bold', backgroundColor:'#c8ff8f'} : undefined}
			          className={size == 15 ? 'item-active' : 'item'}
			          onClick={() => this.setState({size:15})}>
         			  <img src={Line15Pixel} /> 
			        </RectangularButton>
			        <RectangularButton
			          style={size == 20 ? {fontWeight:'bold', backgroundColor:'#c8ff8f'} : undefined}
			          className={size == 20 ? 'item-active' : 'item'}
			          onClick={() => this.setState({size:20})}>
         			  <img src={Line20Pixel} /> 
			        </RectangularButton><br />
            </AlignedBar>			
			        <RangeBar>
                <input min="1" max="20" type="range" value={size} onChange={(e) => this.setState({size: parseInt(e.target.value)})} />
                <RangeWindow>&#8199;{size}</RangeWindow> 
			        </RangeBar>
              <label htmlFor="">Color: &#8199; </label>
                <ColorInput 
		               value={color} 
		               style={{borderColor: color}} 
		               onChange={
						  		   (e) => { 
						  			   this.setState({color: e.target.value})
						  		     this.setState({fillColor: e.target.value})
						  	}} />
			        <br />

          {(this.state.tool == TOOL_ELLIPSE || this.state.tool == TOOL_RECTANGLE) ?
            <div>
              <input type="checkbox" 
						    value={fill} 
						    style={{margin:'0 8'}}
                onChange={(e) => 
									this.setState({fill: e.target.checked})} />
              <label htmlFor="">Fill in the shape with color?</label>
              {fill ? <span>
                  <label htmlFor="">&#8199;Fill-in color: </label>
                  <ColorInput 
								    value={fillColor} 
								    style={{borderColor: color}} 
								    onChange={(e) => 
											this.setState({fillColor: e.target.value})} />
                </span> : ''}
            </div> : ''}
          </ToolsDiv>
      </div>
    );
  }
}

export default withRouter(WhtBdPage);

// ----  Styling  ----

const AspectRatio = 0.75;

const WhiteboardDiv = styled.div`
  display: flex;
	flex-direction: column;
  align-items: flex-start; 
  margin-left: 10px;
	touch-action: none;
`;

const CanvasDiv = styled.div`
  display: flex;
	flex-direction: column;
	padding: 0px;
	margins: 0px;
`;

const UndoRedoClearRow = styled.div`
  align-self: flex-start;
  display: flex;
	flex-direction: row;
  justify-content: flex-start;
	width: 600;
	max-width: 600px;
	${media.phablet`width: 460px;`};
	${media.phone`width: 320px;`};
	${media.tiny`width: 200px;`};
	margin-top: 5px;
	margin-bottom: 10px;
`;

const UndoRedoClearButton = styled(RectangleButton)`
	&:hover {
	  background-color: #abd5ff;
	  color: DodgerBlue;
	  border: 1px solid green; 
		}
`;

const ToolsDiv = styled.div`
  display: flex;
	flex-direction: column;
  align-items: flex-start;
  margin-left: 10px;
`;

const Button = styled(RoundedButton)`
  width: 5rem;
	height: 2rem;
	border: 1px solid blue;
	font-size: 1.0rem;
	font-weight: normal;
`;

const ButtonIcon = styled(RoundedButton)`
  width: 80px;	
	height: 50px;
	border: 1px solid blue;
	padding: 0;
	display: flex;
  flex: row;	
	justify-content: center;
	${media.phablet`width: 50px;`};
	${media.phablet`height: 40px;`};
	&:hover {
	  background-color: #abd5ff;
	  color: green;
	  border: 1px solid green; 
		}
`;

const ButtonText = styled(ButtonIcon)`
  margin-top: 10px;
`;

const ColorInput = styled.input.attrs({
  type: "color"
})`
  padding: 0px;
	width: 50px;
	height: 30px;
`;

const RectangularButton = styled(RectangleButton)`
  width: 80px;	
	height: 50px;
	border: 1px solid blue;
	text-align: center;
	font-weight: normal;
	padding: 0px;
	${media.phablet`width: 50px;`};
	${media.phablet`height: 40px;`};
		&:hover {
		  background-color: #abd5ff;
		  color: DodgerBlue;
		  border: 1px solid green; 
		}
`;

const AlignedBar = styled.div`
  display: flex;
	flex-direction: row;
	margin-bottom: 2px;
`;

const RangeBar = styled.div`
  display: flex;
	flex-direction: row;
	align-items: center;
	width: 500px;	
	${media.phablet`width: 300px;`};
`;

const RangeWindow = styled.div`
  background-color: #000080;
	color: #bcf2ff;
	padding: 0.4em;
	height: 16px;
	width: 22px;
	font-size: 14px;
	border-radius: 3px;
  display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`;

const Textarea = styled.textarea`
  visibility: ${props => props.hidden ? 'hidden' : 'visible'};
width: 300px;
${media.tiny`width: 200px;`};
height: 100px; 
`;

const InputSlider = styled.input`
  type: 'range';
  background: transparent;
  width: 300px;
	-webkit-appearance: 'none';
  border-radius: 3px;
	margin-top: 14px;
	border: 1px solid #000000;

  '&::-webkit-slider-runnable-track':{
	  border: 1px solid #000000,
    background: #1339e1,
    width: 300px,
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d
	}
  '&::-webkit-slider-thumb':{
	  -webkit-appearance: 'none',
	  background: #13a0e1

	}
  '&::-moz-range-track':{
	  background: #1339e1,
    width: 300px
	}
  '&::-moz-range-thumb':{
	  background: #13a0e1

	}
`;

const ReturnLink = styled(A)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  font-family: 'Josefin Slab';
  font-size: 16px;
  font-weight: bold;
  fontStyle: "italic";
  color: blue;
  // border: 1px solid blue;
  ${media.phablet `flex: 0 auto;`} 
  ${media.phone `font-size: 12px;`} 
`;

const Title = styled(Label)`
  padding-left: 10px;
  font-size: 32px;
  ${media.phone `font-size: 24px;`} 
  
`
