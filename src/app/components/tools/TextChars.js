import { v4 } from 'uuid';
// import { findDOMNode } from 'react-dom';
import css from './TextChars.css';

export const TOOL_TEXT = 'textChars';


export default (context) => {
  let textChars= null;

  const onMouseDown = (x, y, size, color, fill, fillColor, chars, fontFamily, fontSize, textboxVisibility) => {
    textChars = {
      id: v4(),
      tool: TOOL_TEXT,
			startx: x,
			starty: y,
			color,
			size,
			fillColor,
      chars,
			fontFamily,
			fontSize,
			textboxVisibility
    };

		console.log("onMouseDown fontFamily: " + textChars.fontFamily + "  fontSize: " + textChars.fontSize + "  textboxVisibility: " + textChars.textboxVisibility);
		console.log("textChars: " + textChars.chars);
		if (textChars.startx) {
		console.log("startx: " + textChars.startx + "   starty: " + textChars.starty);
		}
		textChars.textboxVisibility = "visible";
    return [textChars];

  };

  const onMouseMove = (x, y, chars) => {
    if (!textChars) return;
	};
  
	const onMouseUp = (x, y, chars, canvas) => {
    if (!textChars) return;
		// console.log("MouseUp textChars.chars: " + textChars.chars);
    // onMouseMove(x, y);
		// drawText( textChars.chars, textChars.startx, textChars.starty, canvas );
	  	
    // context.fillText(chars, x, y);
    var CanvasTextWrapper = require('canvas-text-wrapper').CanvasTextWrapper;	
    // canvas.width = 100;
		// canvas.height = 100;
    context = canvas.getContext('2d');
		context.fillStyle = textChars.color;
		context.x = 200;
		var font = textChars.fontSize + "px " + textChars.fontFamily + ", serif";
		CanvasTextWrapper(canvas, chars, {font: font, strokeText: false, paddingX: textChars.startx, paddingY: textChars.starty, allowNewLine: true, renderHDPI: false });

		const item = textChars;
		textChars = null;
		return [item];
	};
/*
	const onMouseUp = (x, y, chars, canvas) => {
    if (!textChars) return;
		// console.log("MouseUp textChars.chars: " + textChars.chars);
    // onMouseMove(x, y);

		const item = textChars;
		// textChars = null;
		return [item];
	};
	
	const drawText = (item) => {
    // if (!textChars) return;
    var CanvasTextWrapper = require('canvas-text-wrapper').CanvasTextWrapper;	
    // canvas.width = 100;
		// canvas.height = 100;
    context = canvas.getContext('2d');
		context.fillStyle = item.color;
		context.x = 200;
		var font = item.fontSize + "px " + item.fontFamily + ", serif";
		CanvasTextWrapper(canvas, item.chars, {font: font, strokeText: false, paddingX: item.startx, paddingY: item.starty, allowNewLine: true, renderHDPI: false });
  };

  
	const drawText = (chars, startx, starty, canvas) => {
    context = canvas.getContext('2d');
    context.save();
    
		// var ctx = document.getElementById('canvas').getContext('2d');
    context.font = '24px serif';
    context.fillText(chars, startx, starty);
    
		// canvas = findDOMNode('canvasText');
	  CanvasTextWrapper(canvas, chars, {paddingX: 20, allowNewLine: true, renderHDPI: true});	
    
		context.restore();
  };

    // const draw = item => drawText( item );
    const draw = (item) => { 
			drawText 
		};
*/
  return {
    onMouseDown,
    onMouseMove,
    onMouseUp
  };
};
