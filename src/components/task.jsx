/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './task.css';

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
  }

  stop = () => {
    this.myRef.current.currentTime = 0;
    this.myRef.current.pause();
  }

  render() {
    const { props } = this;
    return (
      <div>

        {props.value}
        ID:
        {props.id !== '-1' && props.id}
        <button type="button" className="button" onClick={this.stop}>■</button>
        <audio controls className="audio" ref={this.myRef} src={this.blobify()} />
      </div>
    );
  }
}

Task.propTypes = {
  value: PropTypes.string,
  id: PropTypes.string,
  voice: PropTypes.string,
};
let badID = -1;
Task.defaultProps = {
  value: '',
  id: badID--,
  voice: '',
};

export default Task;
