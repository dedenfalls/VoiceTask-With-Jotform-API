/* eslint-disable no-console */
/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import Task from './task';
import './task.css';

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
    this.retrieveVoiceTasks();
  }

  retrieveVoiceTasks = () => {
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
    if (!tasks.data) {
      alert('a problem occured while retrieving tasks');
    }
    tasks.data.content.forEach((task) => {
      const name = Object.values(task.answers).filter((o) => o.name === 'typeA7')[0].answer;
      const voice = Object.values(task.answers).filter((o) => o.name === 'typeA')[0].answer;
      const helper = taskArray;
      helper.push({ id: task.id, name, voice });
      this.setState({ taskArray: helper });
    });
    console.log(taskArray);
    this.setState({ taskArray });
  }

  // console.log(window.URL.createObjectURL(mp3));

  render() {
    // const { isRetrieveRequested } = this.state;
    const { taskArray } = this.state;
    return (
      <>
        <ul className="nobull">
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
