import React, { Component } from 'react';
import Button from './Button';


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
    zIndex: 1,
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

  _handleSubmit = () => {
    const idsAndURLs = this.state.text.split('\n');
    this.props.onSubmit(idsAndURLs);
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
