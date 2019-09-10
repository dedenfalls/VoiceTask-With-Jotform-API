/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'underscore';
import Task from './task';
import './task.css';


const axios = require('axios');

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
    const periodicCaller = setInterval(this.retrieveVoiceTasks, 1500);
    this.refresher = periodicCaller;
    this.retrieveVoiceTasks();
  }

  componentWillUnmount = () => {
    if (this.refresher) {
      clearInterval(this.refresher);
    }
  }

  retrieveVoiceTasks = () => {
    const { selectedForm } = this.props;

    axios({
      method: 'get',
      url: `https://api.jotform.com/form/${selectedForm}/submissions`,
      params: {
        apiKey: global.JF.getAPIKey(),
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
    // console.log(helper);
    if (taskArray.length === 0) {
      this.setState({ taskArray: helper });
      return;
    }
    if (!isEqual(helper, taskArray)) {
      this.setState({ taskArray: helper });
    }
  }

  render() {
    // const { isRetrieveRequested } = this.state;
    const { taskArray } = this.state;
    return (
      <>
        {!taskArray.length && (<h5>You have no tasks please add one</h5>)}
        <ul className="nobull">
          {taskArray.map((task) => (
            <li key={task.id}>
              <Task
                id={task.id}
                value={task.name}
                voice={task.voice}
                refresh={this.retrieveVoiceTasks}
              />
            </li>
          ))}
        </ul>
      </>
    );
  }
}

export default Lister;

Lister.propTypes = {
  selectedForm: PropTypes.string.isRequired,
};
