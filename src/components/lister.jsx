/* eslint-disable no-console */
/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import { isEqual } from 'underscore';
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
    this.refresher = null;
  }

  componentDidMount() {
    const periodicCaller = setInterval(this.retrieveVoiceTasks, 3000);
    this.refresher = periodicCaller;
    this.retrieveVoiceTasks();
  }

  componentWillUnmount = () => {
    clearInterval(this.refresher);
  }

  retrieveVoiceTasks = () => {
    axios({
      method: 'get',
      url: 'https://api.jotform.com/form/92323722053954/submissions',
      params: {
        apiKey: credentials.apiKey,
      },
    }).then((response) => this.setRetrievedTasks(response))
      .catch((err) => console.log(err));
    // this.setState({isRetrieveRequested: true});
  }

  setRetrievedTasks = (tasks) => {
    const { taskArray } = this.state;
    if (!tasks.data) {
      alert('a problem occured while retrieving tasks');
      return;
    }
    const helper = [];
    tasks.data.content.forEach((task) => {
      const name = Object.values(task.answers).filter((o) => o.name === 'typeA7')[0].answer;
      const voice = Object.values(task.answers).filter((o) => o.name === 'typeA')[0].answer;

      helper.push({ id: task.id, name, voice });
    });
    console.log(helper);
    if (taskArray.length === 0) {
      this.setState({ taskArray: helper });
      return;
    }
    let val = 0;
    if (isEqual(helper, taskArray)) {
      val = 1;
    }
    if (!val) {
      this.setState({ taskArray: helper });
    }
  }

  render() {
    // const { isRetrieveRequested } = this.state;
    const { taskArray } = this.state;
    return (
      <>
        <ul className="nobull">
          {taskArray.map((task) => (
            <li key={task.id}>
              <Task value={task.name} voice={task.voice} />
            </li>
          ))}
        </ul>
      </>
    );
  }
}

export default Lister;
