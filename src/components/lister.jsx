/* eslint-disable no-console */
/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import Task from './task';

const axios = require('axios');
const credentials = require('../credentials');

class Lister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskArray: [],
      // isRetrieveRequested: false,
    };
  }

  componentDidMount() {
    this.retrieveVoiceTask();
  }

  retrieveVoiceTask = () => {
    axios({
      method: 'get',
      url: 'https://api.jotform.com/form/92323722053954/submissions',
      params: {
        apiKey: credentials.apiKey,
      },
    }).then((response) => this.setRetrievedTasks(response));
    // this.setState({isRetrieveRequested: true});
  }

  setRetrievedTasks = (tasks) => {
    const { taskArray } = this.state;
    tasks.data.content.forEach((task) => {
      const name = Object.values(task.answers).filter((o) => o.name === 'typeA7')[0].answer;
      const voice = Object.values(task.answers).filter((o) => o.name === 'typeA')[0].answer;
      taskArray.push({ id: task.id, name, voice });
    });
    console.log(taskArray);
    this.setState({ taskArray });
  }

  blobify = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'audio/mp3' });
  }

  // const mp3 = this.blobify(data);
  // console.log(window.URL.createObjectURL(mp3));

  render() {
    // const { isRetrieveRequested } = this.state;
    const { taskArray } = this.state;
    return (
      <>
        <ul>
          {taskArray.map((task) => (
            <li key={task.id}>
              <Task id={task.id} value={task.name} voice={task.voice} />
            </li>
          ))}
        </ul>
      </>
    );
  }
}

export default Lister;
