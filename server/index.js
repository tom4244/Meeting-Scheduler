import path from 'path';
import bodyParser from 'body-parser';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config.js';
import users from './routes/users';
import auth from './routes/auth';
import events from './routes/events';
import classes from './routes/classes';
import studentClasses from './routes/studentClasses';
import pastClasses from './routes/pastClasses';
import pastStudentClasses from './routes/pastStudentClasses';
import classEntries from './routes/classEntries';
import cancellations from './routes/cancellations';
import uploadPhoto from './routes/uploadPhoto';
import selfIntro from './routes/selfIntro';
import uploadSubjects from './routes/uploadSubjects';
import config from './config';
import helmet from 'helmet';

const rateLimit = require("express-rate-limit");
const fs = require('fs-extra');
const express = require('express');
const app = require('express')();
app.use(express.static(__dirname + '/static', { dotfiles: 'allow' } ));
app.use(helmet());
// For express-rate-limit:   ------------
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);
/*  ************  Rate limiter **************
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
//  apply to all requests
// app.use(limiter); // RESTORE LIMITER HERE
// end of express-rate-limit -----------
*/
/* *********** Switch to this to use https ***********
const server = require('https').createServer({
    key: fs.readFileSync(config.keyfile),
    ca: fs.readFileSync(config.cafile),
    cert: fs.readFileSync(config.certfile),
    requestCert: false,
    rejectUnauthorized: false	
},app);
*/
const server = require('http').createServer(app);
const	io = require('socket.io')(server);
const port = config.port;
io.on("connection", socket => {
   console.log("New client connected");
   socket.on("incoming data", (data) => {
     socket.broadcast.emit("outgoing data", {num: data});
		 console.log("outgoing socket data: ", {num: data});
   });
   socket.on("disconnect", () => console.log("Client disconnected"));
 });
server.listen(port, () => console.log(`Listening on port ${port}`));

var db = require('./db');

app.use(bodyParser.json());

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/events', events);
app.use('/api/classes', classes);
app.use('/api/studentClasses', studentClasses);
app.use('/api/pastClasses', pastClasses);
app.use('/api/pastStudentClasses', pastStudentClasses);
app.use('/api/classEntries', classEntries);
//app.use('/api/classes/move', classes);
app.use('/api/cancellations', cancellations);
app.use('/api/uploadPhoto', uploadPhoto); 
app.use('/api/selfIntro', selfIntro); 
app.use('/api/uploadSubjects', uploadSubjects); 

const compiler = webpack(webpackConfig);

app.use(webpackMiddleware(compiler, {
  hot: true,
  publicPath: webpackConfig.output.publicPath,
  noInfo: true
}));

app.use(webpackHotMiddleware(compiler));

/* Temporarily use this to allow other development pages to get 
//   images from this server
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})
*/

// Use these lines to enable 
//   .css files referenced in index.html
// var express = require('express');
// app.use(express.static(__dirname));
app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, './index.html'));
});

// A user connects to the server (opens a socket)
io.sockets.on('connection', function (socket) {

// ---- socket.io connection test ----
// (2): The server recieves a ping event
// from the browser on this socket
// socket.on('how are you', function ( data ) {
//   console.log('socket: server receives how are you (2)');
  // (3): Emit a response event to all listeners
  // with the data from the 'how are you' event
// io.sockets.emit( 'fine', data );   
// console.log('socket: server sends fine to all (3)');
// });
// -------------------------------------
  console.log('Socket connection in index.js');
  socket.on('addItem', (data) => {
		console.log('Adding drawing from: ' + data.tool);
		socket.broadcast.emit('addItem', data);
	});
	socket.on('clear', () => {
		socket.broadcast.emit('clear');
	});
	socket.on('undo', () => {
		socket.broadcast.emit('undo');
	});
	socket.on('redo', () => {
		socket.broadcast.emit('redo');
	});
});

