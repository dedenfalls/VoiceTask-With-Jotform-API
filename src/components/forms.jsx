/* eslint-disable linebreak-style */
/* eslint-disable no-plusplus */
/* eslint-disable no-alert */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'underscore';
import Form from './form';
import './task.css';

const axios = require('axios');

class Forms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forms: [],
      formName: '',
    };
    this.refresher = null;
  }

  componentDidMount() {
    const periodicCaller = setInterval(this.retrieveForms, 1500);
    this.refresher = periodicCaller;
    this.retrieveForms();
  }

  componentWillUnmount = () => {
    if (this.refresher) {
      clearInterval(this.refresher);
    }
  }


  retrieveForms = () => {
    const helper = [];
    const { forms } = this.state;
    axios({
      method: 'get',
      url: `https://api.jotform.com/user/forms?apikey=${global.JF.getAPIKey()}`,
    }).then((res) => {
      const response = res.data.content;

      for (let i = 0; i < response.length; i++) {
        const { title } = response[i];
        const { length } = title;

        if (title.includes('_voiceTask', (length - 10)) && response[i].status !== 'DELETED') {
          helper.push({ title: title.substring(0, length - 10), id: response[i].id });
          console.log(response[i].title);
        }
      }

      if (!isEqual(helper, forms)) {
        console.log('different');
        this.setState({ forms: helper });
      }
    });
  }

  addForm = async () => {
    const { formName } = this.state;
    if (formName === '') {
      alert('Please enter a name for subtopic');
      return;
    }
    const formData = new FormData();
    formData.append('properties[title]', `${formName}_voiceTask`);
    formData.append('questions[7][inputTextMask]', '');
    formData.append('questions[7][maxSize]', '');
    formData.append('questions[7][name]', 'typeA7');
    formData.append('questions[7][order]', '1');
    formData.append('questions[7][qid]', '7');
    formData.append('questions[7][type]', 'control_textbox');
    formData.append('questions[7][subLabel]', '');
    formData.append('questions[7][text]', 'Type a question');
    formData.append('questions[8][cols]', '40');
    formData.append('questions[8][maxSize]', '');
    formData.append('questions[8][name]', 'typeA');
    formData.append('questions[8][order]', '2');
    formData.append('questions[8][qid]', '8');
    formData.append('questions[8][type]', 'control_textarea');
    formData.append('questions[8][subLabel]', '');
    formData.append('questions[8][text]', 'Type a question');
    formData.append('questions[8][wysiwyg]', 'Disable');
    formData.append('questions[8][subLabel]', '');
    formData.append('questions[8][entryLimit]', 'None-0');
    formData.append('questions[8][entryLimitMin]', 'None-0');

    let response = null;
    response = await axios({
      config: {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
      method: 'post',
      url: `https://api.jotform.com/user/forms?apikey=${global.JF.getAPIKey()}`,
      data: formData,

    });
    if (response) {
      this.retrieveForms();
    }
    this.setState({ formName: '' });
  }

  setName = (event) => {
    this.setState({ formName: event.target.value });
  }

  render() {
    const { forms, formName } = this.state;
    const { setSelectedForm, selected } = this.props;
    return (
      <>
        <input className="subtopicInp" value={formName} type="text" onChange={this.setName} />
        <button type="button" className="btn btn-secondary addTaskButton" onClick={this.addForm}>Add New Subtopic</button>
        <br />
        <br />
        <br />
        {!forms.length && (<h4>You have no subtopics yet. Please add one</h4>)}
        <ul className="nobull">
          {forms.map((form) => (
            <li key={form.id}>
              <Form
                selected={selected}
                setSelectedForm={setSelectedForm}
                id={form.id}
                title={form.title}
                refresh={this.retrieveForms}
              />
            </li>
          ))}
        </ul>
      </>
    );
  }
}

Forms.propTypes = {
  setSelectedForm: PropTypes.func.isRequired,
  selected: PropTypes.string,
};
Forms.defaultProps = {
  selected: null,
};

export default Forms;
