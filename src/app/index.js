import 'core-js/stable';
import "regenerator-runtime/runtime";
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader'
import Routes from './routes';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './rootReducer';
import { setCurrentUser } from './actions/authActions';
import { composeWithDevTools } from 'redux-devtools-extension';
import setAuthorizationToken from './utils/setAuthorizationToken';
import jwtDecode from 'jwt-decode';

const store = createStore(
	rootReducer, 
	composeWithDevTools(
	// applyMiddleware(...middleware),
	  applyMiddleware(thunk)
  )
);

if (localStorage.jwtToken) {
  setAuthorizationToken(localStorage.jwtToken);
	store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
}

const render = (Component) => {
  ReactDOM.render( 
 	  <Provider store={store}>
   	  <AppContainer> 
   	    <Component />
   	  </AppContainer>
 	  </Provider>, document.getElementById('routes')
  );
};

render(Routes);

// For hot module reloading (HMR) during development
if (module.hot) {
	module.hot.accept('./routes', () => { 
		const App = require('./routes').default;
		render(App);
	});
}
