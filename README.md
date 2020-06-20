# Meeting Scheduler

Make and view meeting or class schedules and use a real-time 
online whiteboard in your browser on desktop, tablet, or smartphone.

* Registered users can be selected conveniently in drop-down menus when scheduling meetings. 
* Meeting times and dates are displayed in dynamic tables. 
* Users can share an online real-time whiteboard.
* Sign up and Login authenticates users and keeps track of schedules between logins.

This project uses React, Javascript, NodeJS, Express, Nginx, Socket.io, Canvas, PostgreSQL, Knex, Flexbox, and Styled-components.

<img src="./images/schedulePage.jpg">

<img src="./images/whiteboard.jpg">

# Installation
* Set up an Express server with an Nginx server used as a reverse proxy (optional). 
* Select the port to be used for the static and socket.io server.
* Put the certificate paths, ports, and jwt secret appropriate for your implemention in config.js. 
* Install PostgreSQL. 
* Create user, meetings, and meeting_entries database tables with columns as used in POSTs and GETs in
  server/routes.js files (examples to be provided here soon).
* Install nodeJS.
* Run "npm install" to install all needed nodejs packages.
* Run "npm start" to start the Express server. Start the Nginx server and PostgreSQL. 

# Notes
* Meeting Scheduler is configured for http for easy experimentation, but with changes for https (strongly advised) included as comments. 
* Meeting Scheduler was originally designed to be used for a teaching or tutoring online tool, so a user type of "student" that can attend, but not set up meetings, is included as an initially disabled option.
