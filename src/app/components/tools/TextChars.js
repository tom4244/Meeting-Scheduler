import { v4 } from 'uuid';
// import { findDOMNode } from 'react-dom';
import css from './TextChars.css';

export const TOOL_TEXT = 'textChars';


export default (context) => {
  let textChars= null;

  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width + x;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }
      
  const onMouseDown = (x, y, size, color, fill, fillColor, chars, fontFamily, fontSize, textboxVisibility, clear, canvas) => {
    textChars = {
      id: v4(),
      tool: TOOL_TEXT,
			startx: x,
			starty: y,
			size,
			color,
			fill,
			fillColor,
      chars,
			fontFamily,
			fontSize,
			textboxVisibility
    },
	  clear = clear;
		canvas = canvas;
		context = canvas.getContext('2d');
		textChars.textboxVisibility = "visible";
		context.fillStyle = textChars.color;
		var font = textChars.fontSize + "px " + textChars.fontFamily + ", serif";
    context.font = font;
		context.textAlign = "start";
		var lineHeight = textChars.fontSize * 1.2;
    wrapText(context, textChars.chars, x, y, canvas.width, lineHeight); 
    return [textChars];
  };

  const onMouseMove = (x, y, chars) => {
    if (!textChars) return;
	};
  
	const onMouseUp = (x, y, chars, canvas) => {
    if (!textChars) return;
    
		
		
		const item = textChars;
		textChars = null;
		return [item];
	};
  
	return {
    onMouseDown,
    onMouseMove,
    onMouseUp
  };
};
