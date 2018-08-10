import React, { Component } from 'react';
import AddPollsForm from './AddPollsForm';
import Button from './Button';

const styles = {
  container: {
    maxHeight: '100%',
    minHeight: 200,
    width: 800,
    maxWidth: '100%',
    minWidth: '50vw',
    margin: '50px auto',
    backgroundColor: '#ddd',
    borderRadius: 10,

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },

  table: {
    flex: 1,
  },

  addButton: {
    margin: 10,
  },
};

class App extends Component {
  state = {
    isAddFormOpen: false,
    polls: {},
    selectedPoll: null,
  };

  loadPoll = pollID => {

  }

  handlePollsAdded = pollIDs => {
    // Filter out already added polls
    const newPollIDs = pollIDs.filter(pollID => this.state.polls[pollID] == null);

    const polls = {...this.state.polls};
    newPollIDs.forEach(pollID => {
      polls[pollID] = {
        isLoading: true,
        didFail: false,
      }
    });
    this.setState({polls, isAddFormOpen: false});

    // Asynchronously start loading details for new polls
    newPollIDs.forEach(pollID => this.loadPoll(pollID));
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.table}>
        </div>
        <Button
          style={styles.addButton}
          onClick={() => this.setState({isAddFormOpen: true})}
        >Add Polls</Button>

        {this.state.isAddFormOpen &&
          <AddPollsForm
            onCancel={() => this.setState({isAddFormOpen: false})}
            onSubmit={this.handlePollsAdded}
          />
        }
      </div>
    );
  }
}

export default App;
