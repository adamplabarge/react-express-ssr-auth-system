import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Redirect,
  Route,
  Switch,
  NavLink,
  Link
} from 'react-router-dom';
import Cookies from 'universal-cookie';

import Home from './home';
import About from './about';
import Dashboard from './dashboard';
import Login from './login';
import Signup from './signup';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_sid: props.user_sid
    };
  }

  render() {
    const user_sid = this.state.user_sid;
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
          <p>The user_sid is: {user_sid ? user_sid : 'none'}.</p>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/home" component={Home} />
            <Route path="/about" component={About} />
            <PrivateRoute path="/dashboard" exact user_sid={user_sid} component={Dashboard}/>
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
          </Switch>
        </main>
      </div>
    );
  }
}

const PrivateRoute = ({ component: Component, user_sid: user_sid, ...rest }) => (
  <Route render={props => (
    user_sid ? (
      <Component {...props}/>
    ) : (
      <Redirect to="/login"/>
    )
  )}/>
)

export default App;