import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

const styles = {
  table: {
  },
};

const getURL = id => `https://www.strawpoll.me/${id}`;

const renderName = poll => {
  let value = 'Loading...';
  if (poll.title != null) {
    value = poll.title;
  } else if (poll.error != null) {
    value = `Error: ${poll.error}`;
  }

  return (
    <a target='_blank' href={getURL(poll.id)}>{value}</a>
  );
};

class PollsTable extends Component {

  render() {
    return (
      // <div style={{...styles.container, ...this.props.style}}>
      // </div>
      <ReactTable
        className='-striped -highlight'
        style={{...styles.table, ...this.props.style}}
        data={this.props.polls}
        columns={[
          {
            Header: 'Rank',
            accessor: 'rank',
            width: 100,
          },
          {
            Header: 'Poll',
            Cell: row => renderName(row.original),
          },
          {
            Header: 'Average',
            accessor: 'average',
          },
          {
            Header: '',
            id: 'delete',
            Cell: () => '\u274C',
            sortable: false,
            resizable: false,
            width: 40,
            style: { textAlign: 'center', color: 'red' },
          },
        ]}
        pageSize={Math.max(this.props.polls.length, 5)}
        showPagination={false}
        getTdProps={(state, rowInfo, column) => {
          if (!rowInfo) return {}
          const poll = rowInfo.original

          return column.id === 'delete' ? {
            onClick: () => {
              this.props.onRemovePoll(poll.id);
            },
            style: { cursor: 'pointer' }
          } : {
            onClick: () => {
              this.props.onClickPoll(poll.id);
            }
          }
        }}
      />
    );
  }
}

export default PollsTable;
