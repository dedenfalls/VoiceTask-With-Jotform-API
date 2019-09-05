import React, { Component } from 'react';
import Recorder from './recorder';
import Lister from './lister';
import Login from './login';
import './task.css';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toBeEdited: null,
      apiKey: null,
    };
  }

  setApiKey = (key) => {
    this.setState({ apiKey: key });
  }

  setToBeEdited = (submissionId) => {
    this.setState({ toBeEdited: submissionId });
  }

  render() {
    const { toBeEdited } = this.state;
    const { apiKey } = this.state;
    return (
      <>
        {!apiKey && (<Login setApi={this.setApiKey} />)}
        {apiKey && (<Recorder toBeEdited={toBeEdited} apiKey={apiKey} />)}
        {apiKey && (<Lister apiKey={apiKey} />)}
      </>
    );
  }
}

export default Main;
