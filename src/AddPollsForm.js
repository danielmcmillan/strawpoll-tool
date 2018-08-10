import React, { Component } from 'react';
import Button from './Button';

// All or part of the URL immediately preceding the ID
const urlPrefix = 'strawpoll.me/';

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#5555',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  form: {
    maxWidth: '100%',
    width: 500,
    backgroundColor: '#fff',
    borderRadius: 10,
    boxShadow: '6px 6px rgba(0,0,0,10%)',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },

  label: {
    textAlign: 'center',
    margin: 10,
  },

  textArea: {
    flex: 1,
    resize: 'vertical',
    minHeight: 50,
    height: 200,
    margin: 10,
  },

  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
  },

  button: {
    flex: 1,
    margin: 10,
  },
};

class AddPollsForm extends Component {
  state = {
    text: "",
  };

  _parseLine = idOrURL => {
    const trimmed = idOrURL.trim();
    if (trimmed.length === 0) {
      return null;
    }
    if (trimmed.includes('/')) {
      // Assume URL
      const prefixStart = trimmed.indexOf(urlPrefix);
      if (prefixStart < 0) {
        return null;
      }
      const idStart = prefixStart + urlPrefix.length;
      const idEnd = trimmed.indexOf('/', idStart);
      const id = trimmed.substring(idStart, idEnd >= 0 ? idEnd : trimmed.length);
      if (id.length > 0) {
        return id;
      } else {
        return null;
      }
    } else {
      // Assume it's already an ID
      return trimmed;
    }
  }

  _handleSubmit = () => {
    const ids = this.state.text.split('\n').map(this._parseLine).filter(id => id != null);
    this.props.onSubmit(ids);
  }

  render() {
    return (
      <div style={{...styles.container, ...this.props.style}}>
        <div style={styles.form}>
          <p style={styles.label}>Enter the URL or ID for one or more polls, one per line.</p>
          <textarea
            style={styles.textArea}
            value={this.state.text}
            onChange={event => this.setState({text: event.target.value})}
          ></textarea>
          <div style={styles.buttonContainer}>
            <Button style={styles.button} onClick={this.props.onCancel}>Cancel</Button>
            <Button style={styles.button} onClick={this._handleSubmit}>Add</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default AddPollsForm;
