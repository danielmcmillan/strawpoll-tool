import React, { Component } from 'react';
import { CSVLink } from 'react-csv'
import AddPollsForm from './AddPollsForm';
import PollsTable from './PollsTable';
import Button from './Button';
import * as strawPoll from './strawPoll';

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    maxHeight: '100%',
    width: 800,
    maxWidth: '100%',
    backgroundColor: '#ddd',
    borderRadius: 10,

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },

  table: {
    flex: 1,
  },

  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },

  addButton: {
    flex: 1,
    marginLeft: 10,
  },
};

const computePollList = polls =>
  Object.keys(polls).map(id => ({
    ...polls[id],
    id,
    average: strawPoll.computeAverage(polls[id]),
    voteCount: strawPoll.computeTotalVoteCount(polls[id]),
  }))
  .sort((pollA, pollB) => pollA.average < pollB.average ? 1 : -1)
  .map((poll, index) => ({
    ...poll,
    rank: index + 1,
  }));

const csvDataFromPollList = pollList => pollList.map(poll => {
  const {options, votes} = poll;
  const data = {
    rank: poll.rank,
    url: strawPoll.getURL(poll.id),
    title: poll.title,
    average: poll.average,
    totalVotes: poll.voteCount,
  };
  if (options != null && votes != null && options.length === votes.length) {
    options.forEach((option, index) => {
      const vote = votes[index];
      data[option] = vote;
    });
  }
  return data;
});

class App extends Component {
  state = {
    isAddFormOpen: false,
    polls: {},
    selectedPoll: null,
  };

  componentDidMount() {
    const hash = window.location.hash;
    if (hash.indexOf('#') === 0) {
      const idsAndURLs = (hash.substring(1)).split(',');
      this.handlePollsAdded(idsAndURLs);
    }
  }

  updateHash = polls => {
    // Update hash in the URL
    window.location.hash = Object.keys(polls).join(',');
  }

  loadPoll = async pollID => {
    let poll = null;
    try {
      const pollData = await strawPoll.loadPoll(pollID);
      poll = {...this.state.polls[pollID], ...pollData};
    } catch (error) {
      poll = {...this.state.polls[pollID], error: error.message};
    }

    // Check poll was not deleted
    if (this.state.polls[pollID] != null) {
      this.setState({polls: {...this.state.polls, [pollID]: poll}});
    }
  }

  handlePollsAdded = idsAndURLs => {
    const pollIDs = idsAndURLs.map(strawPoll.parseIDOrURL).filter(id => id != null);
    // Filter out already added polls
    const newPollIDs = pollIDs.filter(pollID => this.state.polls[pollID] == null);

    const polls = {...this.state.polls};
    newPollIDs.forEach(pollID => {
      polls[pollID] = {
        isLoading: true,
        error: null,
      }
    });
    this.setState({polls, isAddFormOpen: false});

    // Asynchronously start loading details for new polls
    newPollIDs.forEach(pollID => this.loadPoll(pollID));

    this.updateHash(polls);
  }

  handleRemovePoll = pollID => {
    const polls = this.state.polls;
    delete polls[pollID];
    this.setState({polls});
    this.updateHash(polls);
  }

  handleClickPoll = pollID => {
  }

  render() {
    const pollList = computePollList(this.state.polls);
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <PollsTable
            style={styles.table}
            polls={pollList}
            onRemovePoll={this.handleRemovePoll}
            onClickPoll={this.handleClickPoll}
          />
          <div style={styles.buttonContainer}>
            {pollList.length > 0 &&
              <CSVLink className='strawpoll-tool-button' data={csvDataFromPollList(pollList)} filename="polls.csv">Export</CSVLink>
            }
            <Button
              style={styles.addButton}
              onClick={() => this.setState({isAddFormOpen: true})}
            >Add Polls</Button>
          </div>

          {this.state.isAddFormOpen &&
            <AddPollsForm
              onCancel={() => this.setState({isAddFormOpen: false})}
              onSubmit={this.handlePollsAdded}
            />
          }
        </div>
      </div>
    );
  }
}

export default App;
