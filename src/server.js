import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import morgan from 'morgan';
import cookiesMiddleware from 'universal-cookie-express';

import React from 'react';
import { StaticRouter as Router } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import App from './app/app';
import template from './template';

import prettyjson from 'prettyjson';

import User from './models/user';


// invoke an instance of express application.
const app = express();

app.use('/assets', express.static('assets'));

// set our application port
app.set('port', 9000);

// set morgan to log info about our requests for development use.
app.use(morgan('combined'));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());


// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: false
    }
}));


// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});


// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }    
};


// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
    const context = {};
    const initialState = {
        user_sid: req.cookies.user_sid
    };
    const appString = renderToString(
        <Router context={context} location={req.url}>
            <App {...initialState}/>
        </Router>
    );
    res
        .status(200)
        .send(template({
            body: appString,
            title: 'Home Page',
            initialState: JSON.stringify(initialState)
        }));
});


// route for user signup
app.route('/signup')
    .get(sessionChecker, (req, res) => {
        const context = {};
        const initialState = {
            user_sid: req.cookies.user_sid
        };
        const appString = renderToString(
            <Router context={context} location={req.url}>
                <App {...initialState}/>
            </Router>
        );
        res
            .status(200)
            .send(template({
                body: appString,
                title: 'Signup Page',
                initialState: JSON.stringify(initialState)
            }));
    })
    .post((req, res) => {
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        .then(user => {
            req.session.user = user.dataValues;
            res.redirect('/dashboard');
        })
        .catch(error => {
            res.redirect('/signup');
        });
    });


// route for user Login
app.route('/login')
    .get(sessionChecker, (req, res) => {
        const context = {};
        const initialState = {
            user_sid: req.cookies.user_sid
        };
        const appString = renderToString(
            <Router context={context} location={req.url}>
                <App {...initialState}/>
            </Router>
        );
        res
            .status(200)
            .send(template({
                body: appString,
                title: 'Login Page',
                initialState: JSON.stringify(initialState)
            }));
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;

        User.findOne({ where: { username: username } })
            .then(function (user) {
                if (!user) {
                    res.redirect('/login');
                } else if (!user.validPassword(password)) {
                    res.redirect('/login');
                } else {
                    req.session.user = user.dataValues;
                    res.redirect('/dashboard');
                }
            });
    });


// route for user's dashboard
app.get('/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        const context = {};
        const initialState = {
            user_sid: req.cookies.user_sid
        };
        const appString = renderToString(
            <Router context={context} location={req.url}>
                <App {...initialState}/>
            </Router>
        );
        res
            .status(200)
            .send(template({
                body: appString,
                title: 'Dashboard Page',
                initialState: JSON.stringify(initialState)
            }));
    } else {
        res.redirect('/login');
    }
});


// route for user logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});


// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});


// start the express server
app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));