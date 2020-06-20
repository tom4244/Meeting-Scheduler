import React from "react";
import ReactDOM, { render } from "react-dom";
import routes from "./routes";
import { hot } from 'react-hot-loader/root';

class App extends React.Component {
	render() {
	  return (
			<div routes={ routes } />
	  );
  }
}

export default hot(App)
{/*   no longer using the Grid, 
       but left here for an example
const Grid = styled.div`
  display: grid;
	width: 100%;
	height: 1000px;
	grid-template-columns: 400px 400px 1fr;
	grid-template-rows: 100px 200px 200px 200px 200px 1fr;
	grid-template-areas: 
	  "header header header"
    "main main main"
		"main main main"
		"main main main"
		"main main main"
		"footer footer footer";
`;
*/}

