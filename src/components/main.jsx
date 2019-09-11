import React, { Component } from 'react';
import Recorder from './recorder';
import Lister from './lister';
import Login from './login';
import Forms from './forms';
import './task.css';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      selectedForm: null,
      taskAdded: false,
    };
  }

  setSelectedForm = (formID) => {
    this.setState({ selectedForm: formID });
    console.log(formID);
  }

  setIsLoggedIn = () => {
    this.setState({ isLoggedIn: true });
  }

  setTaskAdded = () => {
    this.setState({ taskAdded: true });
    console.log('setted');
  }

  unsetTaskAdded = () => {
    this.setState({ taskAdded: false });
    console.log('unsetted');
  }

  render() {
    const { selectedForm, taskAdded, isLoggedIn } = this.state;
    return (
      <>
        {!isLoggedIn && (<Login setIsLoggedIn={this.setIsLoggedIn} />)}
        {isLoggedIn && (
          <div className="flex-container">
            <div className="formSelect">
              <div className="innerFormSelect">
                <Forms setSelectedForm={this.setSelectedForm} selected={selectedForm} />
              </div>
            </div>
            <div className="tasks">
              <Recorder needRefresh={this.setTaskAdded} selectedForm={selectedForm} />
              {!selectedForm && (
                <h5 className="selectSubtopic">
                  You have not selected a subtopic yet. Please select or create one from left
                </h5>
              )}
              {selectedForm && (
                <Lister
                  unset={this.unsetTaskAdded}
                  isNeeded={taskAdded}
                  selectedForm={selectedForm}
                />
              )}
            </div>
          </div>
        )}
      </>
    );
  }
}

export default Main;
