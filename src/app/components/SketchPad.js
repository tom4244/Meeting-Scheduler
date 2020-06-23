import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Eraser, TOOL_ERASER, Pencil, TOOL_PENCIL, Line, TOOL_LINE, Ellipse, TOOL_ELLIPSE, Rectangle, TOOL_RECTANGLE, TextChars, TOOL_TEXT } from './tools';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const toolsMap = {
	[TOOL_ERASER]: Eraser,
  [TOOL_PENCIL]: Pencil,
  [TOOL_LINE]: Line,
  [TOOL_RECTANGLE]: Rectangle,
  [TOOL_ELLIPSE]: Ellipse,
	[TOOL_TEXT]: TextChars
};

  var preventDefault = function(e){
      e.preventDefault();
  };
  var touchstart = function(e) {
      document.addEventListener('touchstart', preventDefault,false);
      document.addEventListener('touchmove',  preventDefault,false);
  };
  var touchend = function(e) {
      document.removeEventListener('touchstart', preventDefault,false);
      document.removeEventListener('touchmove',  preventDefault,false);
  };
  
export default class SketchPad extends Component {

	constructor(props) {
    super(props);
    this.initTool = this.initTool.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onDebouncedMove = this.onDebouncedMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
		this.onTouchStart = this.onTouchStart.bind(this);
		this.onTouchMove = this.onTouchMove.bind(this);
		this.onTouchEnd = this.onTouchEnd.bind(this);
		this.clearCanvas = this.clearCanvas.bind(this);
		this.drawItem = this.drawItem.bind(this);
		
		this.state = {
		  canvasRef: React.createRef()
		};
  };

  componentDidMount() {
    this.canvas = this.canvasRef;
    this.context = this.canvas.getContext('2d');
		this.context.fillStyle="#ffffff";	
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.stroke();
    this.getWidth(this.canvas);
    this.initTool(this.props.tool);
    this.canvas.addEventListener('touchstart',  touchstart, false);
    this.canvas.addEventListener('touchend',    touchend,   false);
  };

  drawItem(item) {
	  // console.log("Item: ", item);
    this.initTool(item.tool);
	  if (item.tool != 'textChars') {
	    this.tool.draw(item, this.props.animate);
	  }
	  else {
	 	  // let textChars = item;
	 	  const { chars, color, startx, starty, fontSize, fontFamily } = item; 
	 	  let context = this.canvas.getContext('2d');
	 	  context.fillStyle = color;
      const font = fontSize + "px " + fontFamily + ", serif";
	  }
	}

  componentDidUpdate() {
		if (this.props.undo == true) {
			console.log("Undoing last stroke");
		  this.clearCanvas();
			// Draw items in undo list to the canvas
			this.props.undo_list.forEach(item => {
				this.drawItem(item);
			});
		  // Force a re-render 
		  this.props.setFillColor(this.props.fillColor);
			this.props.resetUndo();
		}
		else if (this.props.redo == true) {
			console.log("Redoing last undone stroke");
			// The item to be redrawn has already been moved to the undo_list from the redo_list
			let item = this.props.undo_list.slice(-1)[0];
			this.drawItem(item);
			this.props.resetRedo();
		}
		else if (this.props.clear == true) {
  		console.log("Clearing strokes");
  	  this.props.clearAll();
		  this.clearCanvas();
		  // Force a re-render 
		  this.props.setFillColor(this.props.fillColor);
  		this.props.resetClear();
  	}
		else {
			if (this.props.items.length > 0) {
        let tempArray = this.props.items.slice();
        this.props.clearItemsList();
			  tempArray.forEach(item => {
					this.drawItem(item);
			  });
			}
		}
		this.initTool(this.props.tool);
		// console.log("componentDidUpdate items: ", this.props.items);
	};

	getWidth(canvas){
		// console.log("SP this.canvas: ", canvas);
    var style = window.getComputedStyle(canvas);
		var compWidth = style.getPropertyValue('width');
		// console.log("SP getWidth: ", {compWidth});
  };
	
	initTool(tool) {
    this.canvas = this.canvasRef;
    this.context = this.canvas.getContext('2d');
    this.tool = this.props.toolsMap[tool](this.context);
  };

  clearCanvas() {
    this.canvas = this.canvasRef;
    this.context = this.canvas.getContext('2d');
    // First clear the canvas before drawing items 
	  //   from the Items array to it.
	  // Store the current transformation matrix
    this.context.save();
    // Use the identity matrix while clearing the canvas
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Restore the transform
    this.context.restore();
		// Force a re-render 
		this.props.setFillColor(this.props.fillColor);
	};

  checkClearUndoRedo() {
  	if (this.props.clear == true) {
  		console.log("clear == true detected.");
  	  this.props.clearAll();
		  this.clearCanvas();
		  // Force a re-render 
		  this.props.setFillColor(this.props.fillColor);
  		this.props.resetClear();
  	};
	};

  onMouseDown(e) {
    this.canvas = this.canvasRef;
    this.context = this.canvas.getContext('2d');
      let data = this.tool.onMouseDown(...this.getCursorPosition(e), this.props.size, this.props.color, this.props.fill, this.props.fillColor, this.props.chars, this.props.fontFamily, this.props.fontSize, this.props.textboxVisibility, this.props.clear, this.canvas);
      data && data[0] && this.props.onItemStart && this.props.onItemStart.apply(null, data);
		// console.log("onMouseDown. data: ", data);

    if (this.props.onDebouncedItemChange) {
      this.interval = setInterval(this.onDebouncedMove, this.props.debounceTime);
    }
  };
  
  onTouchStart(e) {
		// console.log("Touch started. e: ", e);
		  e.preventDefault();
      const data = this.tool.onMouseDown(...this.getTouchStartPosition(e), this.props.size, this.props.color, this.props.fill, this.props.fillColor, this.props.chars, this.props.fontFamily, this.props.fontSize, this.props.textboxVisibility, this.props.clear);
      data && data[0] && this.props.onItemStart && this.props.onItemStart.apply(null, data);
	};

  onDebouncedMove() {
    if (typeof this.tool.onDebouncedMouseMove == 'function' && this.props.onDebouncedItemChange) {
      this.props.onDebouncedItemChange.apply(null, this.tool.onDebouncedMouseMove());
    }
  };

  onMouseMove(e) {
     const data = this.tool.onMouseMove(...this.getCursorPosition(e));
     data && data[0] && this.props.onEveryItemChange && this.props.onEveryItemChange.apply(null, data);
  };

  onTouchMove(e) {
		  e.preventDefault();
    const data = this.tool.onMouseMove(...this.getTouchMovePosition(e));
    data && data[0] && this.props.onEveryItemChange && this.props.onEveryItemChange.apply(null, data);
  };

  onMouseUp(e) {
    const data = this.tool.onMouseUp(...this.getCursorPosition(e), this.props.chars, this.canvas, this.undo);
		// console.log("onMouseUp data: ", data);
    data && data[0] && this.props.onCompleteItem && this.props.onCompleteItem.apply(null, data);
		if (data) {
      this.props.addToUndoList(data[0]);	
		}	
    if (this.props.onDebouncedItemChange) {
      clearInterval(this.interval);
      this.interval = null;
    }
  };

  onTouchEnd(e) {
    const data = this.tool.onMouseUp(...this.getTouchEndPosition(e), this.props.chars, this.canvas, this.undo);
		// console.log("Touch ended. data: ", data);
    data && data[0] && this.props.onCompleteItem && this.props.onCompleteItem.apply(null, data);
		if (data) {
      this.props.addToUndoList(data[0]);	
		}	
    if (this.props.onDebouncedItemChange) {
      clearInterval(this.interval);
      this.interval = null;
    }
  };

  getCursorPosition(e) {
    const {top, left} = this.canvas.getBoundingClientRect();
    return [
      e.clientX - left,
      e.clientY - top
    ];
  };

  getTouchStartPosition(e) {
    const {top, left} = this.canvas.getBoundingClientRect();
    return [
      e.targetTouches[0].clientX - left,
      e.targetTouches[0].clientY - top
    ];
  };

  getTouchMovePosition(e) {
    const {top, left} = this.canvas.getBoundingClientRect();
    return [
      e.targetTouches[0].clientX - left,
      e.targetTouches[0].clientY - top
    ];
  };
    
	getTouchEndPosition(e) {
    const {top, left} = this.canvas.getBoundingClientRect();
    return [
      e.changedTouches[e.changedTouches.length - 1].clientX - left,
      e.changedTouches[e.changedTouches.length - 1].clientY - top
    ];
  };
  
	//<Canvas below instead of <canvas and similar 
  //is because the div is styled with styled-components
  render() {
    const {width, height, canvasClassName} = this.props;
    const canvasAspectRatio = .75;
		// console.log("SP render width: ", {width});
    return (
      <Canvas
        ref={(canvas) => { this.canvasRef = canvas; }}
        // height={(width * canvasAspectRatio)}
			  width={width}
			  height={height}
        className={canvasClassName}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseOut={this.onMouseUp}
        onMouseUp={this.onMouseUp}
			  onTouchStart={this.onTouchStart}
			  onTouchMove={this.onTouchMove}
			  onTouchEnd={this.onTouchEnd}
      />
    )
  }
}
  
SketchPad.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  animate: PropTypes.bool,
  size: PropTypes.number,
  color: PropTypes.string,
	fill: PropTypes.bool,
  fillColor: PropTypes.string,
  chars: PropTypes.string,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	textboxVisibility: PropTypes.string,
	clear: PropTypes.bool,
	resetClear: PropTypes.func,
	undo: PropTypes.bool,
	resetUndo: PropTypes.func,
	resetRedo: PropTypes.func,
  items: PropTypes.array.isRequired,
  undo_list: PropTypes.array.isRequired,
  redo_list: PropTypes.array.isRequired,
  tool: PropTypes.string,
  canvasClassName: PropTypes.string,
  toolsMap: PropTypes.object,
  onItemStart: PropTypes.func, // function(stroke:Stroke) { ... }
  onEveryItemChange: PropTypes.func, // function(idStroke:string, x:number, y:number) { ... }
  onDebouncedItemChange: PropTypes.func, // function(idStroke, points:Point[]) { ... }
  onCompleteItem: PropTypes.func, // function(stroke:Stroke) { ... }
  debounceTime: PropTypes.number,
	setFillColor: PropTypes.func,
	setRedoList: PropTypes.func,
  doUndo: PropTypes.func,
	clearAll: PropTypes.func
};

SketchPad.defaultProps = {
	width: 600,
	height: 450,
  size: 5,
  color: '#000',
	fill: false,
  fillColor: '',
	chars: "test",
	fontFamily: "Quicksand",
	fontSize: 18,
	textboxVisibility: "hidden",
	clear: false,
	undo: false,
  canvasClassName: 'canvas',
  debounceTime: 1000,
  animate: true,
  tool: TOOL_TEXT,
	toolsMap,
	items: []
};

//--------Styled Components---------

const RangeWindow = styled.div`
  background-color: #000080;
	color: #bcf2ff;
	padding: 0.4em;
	height: 0.7rem;
	width: 1.2rem;
	font-size: 14px;
	border-radius: 3px;
  display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`;

const Canvas = styled.canvas`
	border: 1px solid;
  background-color: #ffffff;
	color: #0000ff;
`;
