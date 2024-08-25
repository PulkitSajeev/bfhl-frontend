import React, { useState } from 'react';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
    setError('');
  };

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      if (!Array.isArray(parsedData.data)) {
        throw new Error('Invalid input format');
      }

      const response = await fetch('https://bfhl-backend-zeta.vercel.app/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      });

      const data = await response.json();
      setApiResponse(data);
    } catch (err) {
      setError('Invalid JSON input. Please try again.');
    }
  };


  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedFilters((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const renderFilteredResponse = () => {
    if (!apiResponse) return null;

    const { numbers, alphabets, highest_lowercase_alphabet } = apiResponse;
    const filteredData = [];

    if (selectedFilters.includes('Numbers')) {
      filteredData.push(`Numbers: ${numbers.join(', ')}`);
    }

    if (selectedFilters.includes('Alphabets')) {
      filteredData.push(`Alphabets: ${alphabets.join(', ')}`);
    }

    if (selectedFilters.includes('Highest lowercase alphabet')) {
      filteredData.push(`Highest lowercase alphabet: ${highest_lowercase_alphabet.join(', ')}`);
    }

    return filteredData.length > 0 ? filteredData.join(' | ') : 'No data selected';
  };

  return (
    <div className="App">
      <h1>BFHL API Frontend</h1>
      <input
        type="text"
        placeholder='{"data": ["A","C","z"]}'
        value={jsonInput}
        onChange={handleInputChange}
        style={{ width: '80%', padding: '10px', marginBottom: '20px' }}
      />
      <button onClick={handleSubmit} style={{ padding: '10px 20px' }}>
        Submit
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {apiResponse && (
        <div style={{ marginTop: '20px' }}>
          <select multiple={true} onChange={handleFilterChange} style={{ padding: '10px' }}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>
          <div style={{ marginTop: '20px' }}>
            <h2>Filtered Response</h2>
            <p>{renderFilteredResponse()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

