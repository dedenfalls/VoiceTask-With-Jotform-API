/* eslint-disable linebreak-style */
/* eslint-disable no-alert */
/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './task.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      pass: '',
    };
  }

  savePass = (event) => {
    this.setState({ pass: event.target.value });
  }

  saveUser = (event) => {
    this.setState({ user: event.target.value });
  }

  submit = () => {
    const { pass } = this.state;
    const { user } = this.state;
    const { setIsLoggedIn } = this.props;
    if (pass === '' || user === '') {
      alert('Please Provide Your Credentials');
      return;
    }

    const login = {
      username: user,
      password: pass,
      appName: 'Voice Task Tracker',
      access: 'Full',
      expandLimit: 'yes',
    };
    global.JF.userLogin(login, (res) => {
      console.log(res);
      global.JF.initialize({ apiKey: res.appKey });
      console.log(res.appKey);
      setIsLoggedIn();
    }, (e) => {
      alert('your credentials are wrong. Please correct them');
      console.log(e);
      this.setState({ pass: '', user: '' });
    });
  }

  handleEnterKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.submit();
    }
  }

  render() {
    const { pass, user } = this.state;
    return (
      <>
        <div>
          <h1 className="header">Please Login to Your Jotform Account</h1>
          <input type="text" onKeyDown={this.handleEnterKeyDown} className="inpLogin" value={user} onChange={this.saveUser} placeholder=" Username" />
          <br />
          <input type="password" onKeyDown={this.handleEnterKeyDown} className="inpLogin" value={pass} onChange={this.savePass} placeholder=" Password" />
          <br />
          <br />
          <button type="submit" className="btn btn-success login" onClick={this.submit}>Login</button>
        </div>
      </>
    );
  }
}

export default Login;

Login.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
};
