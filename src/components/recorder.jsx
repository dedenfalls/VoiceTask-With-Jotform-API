/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
import React, { Component } from 'react';

const credentials = require('../credentials');
const axios = require('axios');

class Recorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      taskName: '',
      recordURL: '',
    };
    this.mediaRecorder = null;
    this.taskArray = [];
    this.chunks = [];
    this.blob = null;
  }

  componentDidMount = () => {
    global.JF.initialize({ apiKey: credentials.apiKey });
    global.JF.login(
      function success() {
        console.log('welcome');
      },
      function error() {
        console.log('hata');
      },
    );
    const constraints = {
      audio: true, video: false,
    };

    if (navigator.mediaDevices === undefined) {
      console.log('unable to connect to audio recording device');
    } else {
      navigator.mediaDevices.enumerateDevices()
        .then(() => {
          console.log('Got some devices huh?');
        })
        .catch((err) => {
          console.log(err.name, err.message);
        });
    }
    navigator.mediaDevices.getUserMedia(constraints)
      .then((mediaobj) => this.fillSaveFile(mediaobj));
  }

  fillSaveFile = (media) => {
    this.mediaRecorder = new MediaRecorder(media);
    this.mediaRecorder.ondataavailable = (ev) => {
      // eslint-disable-next-line react/destructuring-assignment
      // this.setState({ chunks: this.state.chunks.concat(ev.data) });
      this.chunks = [...this.chunks, ev.data];
    };
    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.chunks, { type: 'audio/mp3;' });

      const videoURL = window.URL.createObjectURL(blob);
      this.chunks = [];
      this.setState({ recordURL: videoURL });
      this.blob = blob;
      //  console.log(data);
    };
  };

  updateTaskName = (event) => {
    this.setState({ taskName: event.target.value });
  }

  toggleRecord = () => {
    const { isRecording } = this.state;
    const { mediaRecorder } = this;

    if (mediaRecorder === null) {
      alert('please provide access to your microphone');
      return;
    }

    if (!isRecording) {
      if (mediaRecorder.state === 'recording') {
        console.log('already recording');
        return;
      }
      mediaRecorder.start();
      this.setState({ isRecording: true });
      console.log(mediaRecorder.state);
    } else {
      if (mediaRecorder.state === 'inactive') {
        console.log('already not recording');
        return;
      }
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      this.setState({ isRecording: false });
    }
  }

  convertBlobToBase64 = () => {
    const { taskName } = this.state;
    if (this.blob === null || taskName === '') {
      alert('please enter a name and voice');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.blob);
    reader.onloadend = () => {
      this.addVoiceTask(reader.result);
    };
  }

  addVoiceTask = (voice) => {
    const { taskName } = this.state;
    axios({
      method: 'post',
      url: 'https://api.jotform.com/form/92323722053954/submissions',
      data: {
        7: taskName,
        8: voice,

      },
      params: {
        apiKey: credentials.apiKey,
      },
    }).then((response) => console.log(response));
    this.blob = null;
    this.setState({ taskName: '' });
  }

  render() {
    const { taskName } = this.state;
    const { isRecording } = this.state;
    const { recordURL } = this.state;
    return (
      <>

        <h2>Please Enter a Brief Task Name For Voice Record</h2>
        <input onChange={this.updateTaskName} />
        <audio controls src={recordURL} />
        <button type="button" onClick={this.toggleRecord}>
          {!isRecording ? 'Start Record' : 'Stop Record'}
        </button>
        <button type="button" onClick={this.convertBlobToBase64}> Add Task </button>
        <h3>{taskName}</h3>
      </>
    );
  }
}
export default Recorder;
