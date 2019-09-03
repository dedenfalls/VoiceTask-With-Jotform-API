/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
import React, { Component } from 'react';


const axios = require('axios');
const credentials = require('../credentials');

class Recorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      taskName: '',
      recordURL: '',
    };
    this.startRecording = this.startRecording.bind(this);
    this.mediaRecorder = null;
    this.taskArray = [];
    this.chunks = [];
    this.blob = null;
    this.haveRecord = false;
    this.started = false;
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
    navigator.permissions.query({ name: 'microphone' }).then((permstatus) => {
      if (permstatus.state !== 'granted') {
        alert('Please enable microphone permission');
      }
    });

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
  }

  fillSaveFile = () => {
    this.mediaRecorder.ondataavailable = (ev) => {
      console.log('incoming data');

      // eslint-disable-next-line react/destructuring-assignment
      // this.setState({ chunks: this.state.chunks.concat(ev.data) });
      this.chunks = [...this.chunks, ev.data];
    };
    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.chunks, { type: 'audio/mp3;' });

      const audioURL = window.URL.createObjectURL(blob);
      this.setState({ recordURL: audioURL });
      this.blob = blob;
      //  console.log(data);
    };
  };

  updateTaskName = (event) => {
    this.setState({ taskName: event.target.value });
  }

  toggleRecord = () => {
    const { mediaRecorder } = this;

    if (mediaRecorder.state === 'paused') {
      this.haveRecord = false;
      this.setState({ isRecording: true });
      mediaRecorder.resume();
      console.log(mediaRecorder.state);
    } else {
      mediaRecorder.pause();
      console.log(mediaRecorder.state);
      this.setState({ isRecording: false });
      this.haveRecord = true;
    }
  }

  convertBlobToBase64ThenSave = () => {
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
    let { taskName } = this.state;
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
    this.chunks = [];
    taskName = '';
    this.setState({ taskName });
  }

  endRecording = () => {
    window.streamReference.getAudioTracks().forEach((track) => {
      track.stop();
    });

    this.mediaRecorder.stop();
    this.haveRecord = true;
    this.started = false;
  }

  clearRecording = () => {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.stop();
    }
    this.chunks = [];
    this.setState({ recordURL: '' });
    this.blob = null;
    this.haveRecord = false;
    this.started = false;
  }

  async startRecording() {
    const response = await navigator.mediaDevices.getUserMedia({ audio: true });
    window.streamReference = response;

    console.log(this.mediaRecorder);

    this.mediaRecorder = new MediaRecorder(response);
    console.log('hey');

    this.fillSaveFile();
    this.clearRecording();
    const { mediaRecorder } = this;
    this.started = true;

    this.haveRecord = false;
    this.setState({ isRecording: true });
    console.log('yey');
    mediaRecorder.start();
  }

  render() {
    const { taskName } = this.state;
    const { isRecording } = this.state;
    const { recordURL } = this.state;
    return (
      <>

        <h2>Please Enter a Brief Task Name For Voice Record</h2>
        <input onChange={this.updateTaskName} value={taskName} />
        <audio controls src={recordURL} />
        {!this.started && (<button type="button" onClick={this.startRecording}> Start Recording </button>)}
        {this.started && (
          <button type="button" onClick={this.toggleRecord}>
            {!isRecording ? 'Continue Recording' : 'Stop Recording'}
          </button>
        )}
        {this.haveRecord && this.started && (<button type="button" onClick={this.endRecording}> End Recording </button>)}
        {this.haveRecord && this.started && (<button type="button" onClick={this.clearRecording}> Clear Recording </button>)}
        <button type="button" onClick={this.convertBlobToBase64ThenSave}> Add Task </button>
      </>
    );
  }
}
export default Recorder;
