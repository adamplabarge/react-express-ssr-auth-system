import React, { Component } from 'react';
import {
  Redirect,
  Route,
  Switch,
  NavLink,
  Link
} from 'react-router-dom';

import Home from './home';
import About from './about';
import Dashboard from './dashboard';
import Login from './login';
import Signup from './signup';

export default class App extends Component {
  render() {
    return (
      <div>
        <header className="navbar navbar-expand navbar-dark flex-column flex-md-row bd-navbar">
          <nav className="navbar-nav bd-navbar-nav flex-row">
            <NavLink to="/" exact className="nav-link">Home</NavLink>
            <NavLink to="/about" className="nav-link">About</NavLink>
            <NavLink to="/dashboard" exact className="nav-link">Dashboard</NavLink>
            <NavLink to="/signup" className="nav-link">Signup</NavLink>
            <NavLink to="/login" className="nav-link">Login</NavLink>
          </nav>
        </header>
        <main>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/home" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/dashboard" exact component={Dashboard} />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
          </Switch>
        </main>
      </div>
    );
  }
}