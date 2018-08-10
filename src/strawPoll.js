// All or part of the URL immediately preceding the ID
const urlPrefix = 'strawpoll.me/';

// Get the URL for getting poll data
const getAPIURL = id => `https://www.strawpoll.me/api/v2/polls/${id}`;

// Get normal poll URL
export const getURL = id => `https://www.strawpoll.me/${id}`;

/**
 * Get poll ID from an ID or URL.
 * @param idOrURL Either a Straw Poll ID, or a Straw Poll URL.
 * @return The poll ID, or null if invalid.
 */
export const parseIDOrURL = idOrURL => {
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

/**
 * Computer the average score for a given Straw Poll.
 * @param poll Object with Straw Poll data (options and votes).
 */
export const computeAverage = poll => {
  const {options, votes} = poll;
  if (options == null || votes == null || votes.length !== options.length) {
    return null;
  }
  let totalScore = 0;
  let totalVoteCount = 0;
  options.forEach((option, index) => {
    const score = Number(option);
    if (!isNaN(score)) {
      const voteCount = votes[index]
      totalScore += score * voteCount;
      totalVoteCount += voteCount;
    }
  });
  if (totalVoteCount <= 0) {
    return null;
  }
  return totalScore / totalVoteCount;
};

export const computeTotalVoteCount = poll => {
  if (poll.votes != null) {
    return poll.votes.reduce((total, voteCount) => total + voteCount, 0);
  }
  return null;
}

export const loadPoll = async pollID => {
  const result = await fetch(getAPIURL(pollID));
  return await result.json();
};
