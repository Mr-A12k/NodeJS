import React from 'react';
import { useLocation } from 'react-router-dom';
import '../App.css';

const Result = () => {
  const location = useLocation();
  const { finalCount } = location.state || { finalCount: 0 };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Final Count: {finalCount}</h1>
    </div>
  );
};

export default Result;
