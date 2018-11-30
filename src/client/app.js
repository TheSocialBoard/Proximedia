import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  
  render() {
    return (
      <div>
        <h1>Hello, World!</h1>
        <button>
          <a href='/auth/github' target='_blank' >Sign in with GitHub</a>
        </button>
      </div>
    );
  };
};

export default App;
