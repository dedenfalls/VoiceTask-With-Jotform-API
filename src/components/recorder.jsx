/* eslint-disable no-alert */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const axios = require('axios');

class Recorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      taskName: '',
      recordURL: '',
      duration: 0,
      noTaskName: false,
    };
    this.mediaRecorder = null;
    this.taskArray = [];
    this.chunks = [];
    this.blob = null;
    this.haveRecord = false;
    this.started = false;
    this.timer = null;
    this.preciseTime = 0;
    this.everRecorded = false;
    this.inpref = React.createRef();
    this.showAudio = false;
    this.preventer = false;
    this.fromStartRecording = false;
    this.flagAddTask = false;
  }

  componentDidMount = () => {
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
      this.chunks = [...this.chunks, ev.data];
    };
    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.chunks, { type: 'audio/mp3;' });

      const audioURL = window.URL.createObjectURL(blob);
      this.setState({ recordURL: audioURL });
      this.blob = blob;
    };
  };

  updateTaskName = (event) => {
    this.inpref.current.placeholder = '';
    this.setState({ taskName: event.target.value, noTaskName: false });
  }

  toggleRecord = () => {
    const { mediaRecorder } = this;

    if (mediaRecorder.state === 'paused') {
      this.haveRecord = false;
      this.setState({ isRecording: true });
      mediaRecorder.resume();
      this.timer = setInterval(this.calculateDuration, 25);
      console.log(mediaRecorder.state);
    } else {
      mediaRecorder.pause();
      clearInterval(this.timer);
      console.log(mediaRecorder.state);
      this.setState({ isRecording: false });
      this.haveRecord = true;
    }
  }

  convertBlobToBase64ThenSave = () => {
    const { selectedForm } = this.props;
    if (!selectedForm) {
      alert('You have not selected a subtopic to add task. Please select or create one');
      return;
    }
    const { taskName } = this.state;
    if (this.blob === null && taskName === '') {
      this.inpref.current.placeholder = 'This area is required';
      this.inpref.current.focus();
      this.setState({ noTaskName: true });
      alert('Please enter a name and voice');
      return;
    }
    if (taskName === '') {
      this.inpref.current.placeholder = 'This area is required';
      this.inpref.current.focus();
      this.setState({ noTaskName: true });
      this.noTaskName = true;
      return;
    }
    if (this.chunks.length === 0) {
      alert('please record a voice for this task');
      return;
    }
    this.everRecorded = false;
    this.flagAddTask = false;
    const reader = new FileReader();
    reader.readAsDataURL(this.blob);
    reader.onloadend = () => {
      this.addVoiceTask(reader.result);
    };
  }

  addVoiceTask = async (voice) => {
    const { taskName } = this.state;
    const copy = (` ${taskName}`).slice(1);
    this.setState({ taskName: '' });
    const { selectedForm, needRefresh } = this.props;
    const response = await axios({
      method: 'post',
      url: `https://api.jotform.com/form/${selectedForm}/submissions`,
      data: {
        7: copy,
        8: voice,

      },
      params: {
        apiKey: global.JF.getAPIKey(),
      },
    });
    console.log(response);
    this.blob = null;
    this.chunks = [];
    this.showAudio = false;
    needRefresh();
  }

  endRecording = () => {
    window.streamReference.getAudioTracks().forEach((track) => {
      track.stop();
    });
    this.setState({ duration: 0, isRecording: false });
    this.mediaRecorder.stop();
    this.haveRecord = true;
    this.started = false;
    this.showAudio = true;
    this.preventer = false;
    this.flagAddTask = true;
    clearInterval(this.timer);
  }

  clearRecording = () => {
    if (this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.stop();
    }
    if (!this.fromStartRecording) {
      window.streamReference.getAudioTracks().forEach((track) => {
        track.stop();
      });
    } else {
      this.fromStartRecording = false;
    }
    this.chunks = [];
    this.setState({ recordURL: '', duration: 0 });
    this.blob = null;
    this.haveRecord = false;
    this.started = false;
    this.showAudio = false;
    this.everRecorded = false;
    this.preventer = false;
  }

  calculateDuration = () => {
    const { duration } = this.state;
    if (this.preciseTime === 39) {
      console.log('one sec');
      this.preciseTime = 0;
      this.setState({ duration: duration + 1 });
      return;
    }

    this.preciseTime++;
  }

  startRecording = async () => {
    let isMicEnabled = true;
    navigator.permissions.query({ name: 'microphone' }).then((permstatus) => {
      if (permstatus.state === 'denied') {
        alert('Please enable microphone permission');
        isMicEnabled = false;
      }
    });
    if (!isMicEnabled) {
      return;
    }
    let response = null;
    if (!this.preventer) {
      this.flagAddTask = false;
      this.preventer = true;
      response = await navigator.mediaDevices.getUserMedia({ audio: true });
      window.streamReference = response;
      this.mediaRecorder = new MediaRecorder(response);
      this.fillSaveFile();
      this.fromStartRecording = true;
      this.clearRecording();
      const { mediaRecorder } = this;
      this.started = true;
      this.showAudio = false;
      this.haveRecord = false;
      this.setState({ isRecording: true });
      mediaRecorder.start();
      this.everRecorded = true;
      const inc = setInterval(this.calculateDuration, 25);
      this.timer = inc;
    }
  }

  handleEnterKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.convertBlobToBase64ThenSave();
    }
  }

  render() {
    const {
      taskName, duration, isRecording, noTaskName, recordURL,
    } = this.state;
    return (
      <>
        <h3 className="header">Please Enter a Brief Task Name For Voice Record</h3>
        <div>
          <input onKeyDown={this.handleEnterKeyDown} ref={this.inpref} onChange={this.updateTaskName} className="inp" value={taskName} />
          {noTaskName && <p className="warner">*Please provide a name above for the task</p>}
        </div>
        {this.showAudio && (
          <div>
            <audio controls className="recordAudio" src={recordURL} />
          </div>
        )}
        {this.started && (
          <h1 className="indicator">
            {duration}
            &nbsp;
            Seconds
          </h1>
        )}
        {!this.started && (
          <button type="button" className="btn btn-secondary padd" onClick={this.startRecording}>
            {this.everRecorded ? 'Restart Recording' : 'Start Recording'}
          </button>
        )}
        {this.started && (
          <button type="button" className="btn btn-secondary padd" onClick={this.toggleRecord}>
            {!isRecording ? 'Continue Recording' : 'Pause Recording'}
          </button>
        )}
        {(isRecording || (this.haveRecord && this.started)) && (<button type="button" className="btn btn-secondary padd" onClick={this.endRecording}> End Recording </button>)}
        {this.haveRecord && this.started && (<button type="button" className="btn btn-secondary padd" onClick={this.clearRecording}> Clear Recording </button>)}
        {this.flagAddTask && (<button type="button" className="btn btn-secondary padd" onClick={this.convertBlobToBase64ThenSave}> Add Task </button>)}
      </>
    );
  }
}
export default Recorder;

Recorder.propTypes = {
  needRefresh: PropTypes.func.isRequired,
  selectedForm: PropTypes.string.isRequired,
};
