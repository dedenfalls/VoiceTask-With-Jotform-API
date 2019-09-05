/* eslint-disable no-console */
/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './task.css';

const axios = require('axios');
const credentials = require('../credentials');

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.myRef = React.createRef();
  }

  blobify = () => {
    const { voice } = this.props;

    const byteString = atob(voice.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'audio/mp3' });
    const soundURL = window.URL.createObjectURL(blob);
    return soundURL;
    // this.setState({ data: voice, URL: soundURL });
  }

  stop = () => {
    this.myRef.current.currentTime = 0;
    this.myRef.current.pause();
  }

  delete = () => {
    const { id } = this.props;
    axios({
      method: 'delete',
      url: `https://api.jotform.com/submission/${id}`,
      params: {
        apiKey: credentials.apiKey,
      },
    }).then((response) => this.setRetrievedTasks(response))
      .catch((err) => console.log(err));
  }

  render() {
    const { props } = this;
    return (
      <div>
        <hr className="hr" />
        {props.value}
        <div className="merge">
          <button type="button" className="button" onClick={this.stop}>■</button>
          <audio controls ref={this.myRef} className="audio" src={this.blobify()} />
        </div>
        <div>
          <button type="button" className="deleteButton" onClick={this.delete}>Delete</button>

        </div>
        <br />
        <br />
      </div>
    );
  }
}

Task.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  voice: PropTypes.string,
};

Task.defaultProps = {
  value: '',
  voice: '',
};

export default Task;
