import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './app';

ReactDOM.render(
    <Router>
        <App {...window.__APP_INITIAL_STATE__} />
    </Router>,
    document.getElementById('root')
);