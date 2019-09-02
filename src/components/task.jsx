/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
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

  render() {
    const { props } = this;
    return (
      <div>

        {props.value}
        ID:
        {props.id !== '-1' && props.id}
        <audio controls src={this.blobify()} />
      </div>
    );
  }
}

Task.propTypes = {
  value: PropTypes.string,
  id: PropTypes.string,
  voice: PropTypes.string,
};
Task.defaultProps = {
  value: '',
  id: '-1 ',
  voice: '',
};

export default Task;
