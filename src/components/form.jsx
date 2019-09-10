/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirm: false,
    };
  }

  setSelected = () => {
    const { setSelectedForm, id } = this.props;
    setSelectedForm(id);
  }

  setConfirm = () => {
    this.setState({ confirm: true });
  }

  resetConfirm = () => {
    this.setState({ confirm: false });
  }

  delete = () => {
    const { id, refresh, setSelectedForm } = this.props;
    axios({
      method: 'delete',
      url: `https://api.jotform.com/form/${id}?apikey=${global.JF.getAPIKey()}`,
    }).then((resp) => console.log(resp));
    setSelectedForm(null);
    refresh();
  }

  render() {
    const { title, selected, id } = this.props;
    const { confirm } = this.state;

    return (
      <>
        <button className={`list-group-item list-group-item-info forms special list-group-item-action ${selected === id ? 'active' : ''}`} onClick={this.setSelected} type="button">
          {title}
        </button>
        <button type="button" className="btn btn-danger paddDelete deleteForms" onClick={this.setConfirm}>Delete</button>
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
                    Warning! You are about to delete a subtopic
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
                  <h4>Do you really want to delete this subtopic?</h4>
                  {<p className="confirm_area">{title}</p>}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary paddDelete"
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

Form.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  setSelectedForm: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired,
};
Form.defaultProps = {
  title: '',
};

export default Form;
