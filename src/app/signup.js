import React, { Component } from 'react';

export default class Signup extends Component {
  render() {

    return (
      <div>
        <h1>This is the Signup Page</h1>
        <form action="/signup" method="post">
            <div>
                <label>Username:</label>
                <input type="text" name="username"/>
            </div>
            <div>
                <label>Email:</label>
                <input type="text" name="email"/>
            </div>    
            <div>
                <label>Password:</label>
                <input type="password" name="password"/>
            </div>
            <div>
                <input type="submit" value="Sign Up"/>
            </div>
        </form>                  
      </div>
    );
  }
}