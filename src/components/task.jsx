/* eslint-disable no-console */
/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './task.css';

const axios = require('axios');

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirm: false,
    };
    this.myRef = React.createRef();
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
    // this.setState({ data: voice, URL: soundURL });
  }

  setConfirm = () => {
    this.setState({ confirm: true });
  }

  resetConfirm = () => {
    this.setState({ confirm: false });
  }

  stop = () => {
    this.myRef.current.currentTime = 0;
    this.myRef.current.pause();
  }

  delete = () => {
    const { id, refresh } = this.props;
    axios({

      method: 'delete',
      url: `https://api.jotform.com/submission/${id}`,
      params: {
        apiKey: global.JF.getAPIKey(),
      },
    }).then((response) => this.setRetrievedTasks(response))
      .catch((err) => console.log(err));
    refresh();
  }

  render() {
    const { props } = this;
    const { confirm } = this.state;
    return (
      <>
        <hr className="hr" />
        <h3 style={{ fontWeight: '400' }}>{props.value}</h3>
        <div className="merge">
          <button type="button" className="button" onClick={this.stop}>■</button>
          <audio controls ref={this.myRef} className="audio" src={this.blobify()} />
        </div>

        <button type="button" className="btn btn-danger paddDelete" onClick={this.setConfirm}>Delete</button>
        {confirm === true && (
          <div
            className="popup"
            id="exampleModal"
            role="dialog"
            aria-labelledby="exampleModalLabel"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Warning! You are about to delete a task
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={this.resetConfirm}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <h4>Do you really want to delete this task?</h4>
                  {<p className="confirm_area">{props.value}</p>}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                    onClick={this.resetConfirm}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => this.delete()}
                    className="btn btn-danger paddDelete"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

Task.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  voice: PropTypes.string,
  refresh: PropTypes.func.isRequired,
};

Task.defaultProps = {
  value: '',
  voice: '',
};

export default Task;
