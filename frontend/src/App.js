import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/jobs/')
      .then(res => setJobs(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Job Listings</h1>
      <ul>
        {jobs.map(job => (
          <li key={job.id}>
            <h3>{job.title}</h3>
            <p>{job.company}, {job.location}</p>
            <p>Salary: ${job.salary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default App;