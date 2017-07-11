import React from 'react';
import YourSide from './YourSide.jsx';
import TheirSide from './TheirSide.jsx';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      yours: {
        name: '',
        image: '',
        body: '',
      },
      theirs: {
        name: '',
        image: '',
        body: '',
      }
    }

    this.getProjectData = this.getProjectData.bind(this);
    this.updatePostBody = this.updatePostBody.bind(this);
    setInterval(this.getProjectData, 1000);
  }

  render() {
    return (
      <div>
        <div className='row'>
          <YourSide name={this.state.yours.name} image={this.state.yours.image} body={this.state.yours.body} updateBody={this.updatePostBody} />
          <TheirSide name={this.state.theirs.name} image={this.state.theirs.image} body={this.state.theirs.body} />
        </div>
        <div className='row text-center'>
          <button id='accept' className='btn btn-success' onClick={() => this.updatePostBody(null, true)}>Accept this agreement</button>
        </div>
      </div>
    );
  }

  componentWillMount() {
    this.getProjectData();
  }

  getProjectData() {
    const xhr = new XMLHttpRequest;
    xhr.open('GET', 'http://localhost:3000/project/5961542d933efc06b4b52cb5');
    xhr.send();

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;
      const projectData = JSON.parse(xhr.response);

      this.setState({
        yours: {
          name: projectData.yours.profile.username,
          image: projectData.yours.profile.image,
          body: projectData.yours.post.text,
        },
        theirs: {
          name: projectData.theirs.profile.username,
          image: projectData.theirs.profile.image,
          body: projectData.theirs.post.text,
        },
      });
    }
  }

  updatePostBody(text, agreed) {
    const xhr = new XMLHttpRequest;
    xhr.open('Post', 'http://localhost:3000/project/5961542d933efc06b4b52cb5');
    xhr.setRequestHeader('Content-Type', 'application/json');

    const sendData = {};
    if (text) sendData.text = text;
    sendData.agreed = agreed ? true : false;

    xhr.send(JSON.stringify(sendData));

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;
      this.getProjectData();
    }
  }
};
