import React, { Component } from 'react';
import Recorder from './recorder';
import Lister from './lister';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toBeEdited: null,
    };
  }

  setToBeEdited = (submissionId) => {
    this.setState({ toBeEdited: submissionId });
  }

  render() {
    const { toBeEdited } = this.state;
    return (
      <>
        <Recorder toBeEdited={toBeEdited} />
        <Lister />
      </>
    );
  }
}

export default Main;
