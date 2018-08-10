import React, { Component } from 'react';

class Button extends Component {
  render() {
    return (
      <button
        className='strawpoll-tool-button'
        {...this.props}
        style={this.props.style}
      >{this.props.children}</button>
    );
  }
}

export default Button;
