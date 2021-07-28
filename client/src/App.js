import React from 'react';
import logo from './camera.svg';
import './App.css';

function App() {
  const [loading,setLoading]=React.useState(false);
  const[uploaded,setUploaded]=React.useState(false)
  async function takeScreenshots() {
    setUploaded(false)
    setLoading(true)
    fetch('http://localhost:9000/takeSS', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(res => res.json()).then(function(res) {
      fetch('http://localhost:9000/saveGDrive', {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(res)
      }).then(res => res.text()).then(res => setLoading(false),setUploaded(true), setTimeout(() => setUploaded(false), 2000))
    })
  }
  return (
    <div className="App">
      
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button type="button" class={loading ? "col-2 btn btn-warning text-black text-wrap": "col-2 btn btn-success text-white text-wrap"} onClick={takeScreenshots}>
          {
            loading ? <div>Loading ...</div> : <div>Take screenshots</div>
          }
        </button>
        {
          uploaded ? <p class="h6 mt-3">Uploaded Successfully to the Drive!</p> : <p></p>
        }
      </header>
    </div>
  );
}

export default App;
