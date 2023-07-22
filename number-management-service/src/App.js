import React, { useState } from 'react';
import axios from 'axios';

const NumberManagementService = () => {
  const [inputUrls, setInputUrls] = useState('');
  const [result, setResult] = useState(null);

  const handleFetchData = () => {
    const urls = inputUrls.split(',').map(url => url.trim());
    const validUrls = urls.filter(url => isValidUrl(url));
    const fetchDataPromises = validUrls.map(url => axios.get(url).then(response => response.data));

    Promise.all(fetchDataPromises)
      .then(results => {
        const mergedNumbers = results.flatMap(data => data.numbers);
        mergedNumbers.sort((a, b) => a - b);
        setResult(mergedNumbers);
      })
      .catch(error => {
        setResult([]);
        console.error('Error fetching data:', error);
      });
  };

  const isValidUrl = url => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <div>
      <h1>Number Management Service using React</h1>
      <p>Enter URLs (comma-separated):</p>
      <input type="text" value={inputUrls} onChange={e => setInputUrls(e.target.value)} />
      <button onClick={handleFetchData}>Fetch Data</button>

      {result && result.length > 0 && (
        <div>
          <h2>Results: sorted URLs</h2>
          <pre>{JSON.stringify({ numbers: result }, null, 2)}</pre>
        </div>
      )}

      {result && result.length === 0 && (
        <div>
          <h2>Error:</h2>
          <p>Error while fetching URLs</p>
        </div>
      )}
    </div>
  );
};

export default NumberManagementService;
