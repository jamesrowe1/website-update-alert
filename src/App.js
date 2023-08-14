// src/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './App.css';

const socket = io.connect('http://localhost:5000'); // Replace with your server URL

function App() {
  const [content, setContent] = useState('');

  useEffect(() => {
    // Get initial content
    axios.get('http://localhost:5000')
      .then(response => {
        setContent(response.data);
      })
      .catch(error => {
        console.error('Error getting initial content:', error.message);
      });

    // Listen for website updates
    socket.on('websiteUpdate', updatedContent => {
      setContent(updatedContent);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Website Update Alert</h1>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </header>
    </div>
  );
}

export default App;
