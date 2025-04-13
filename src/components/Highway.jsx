import React from 'react';
import './Highway.css';

export default function Highway() {
  return (
    <div className="highway">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="line" style={{ top: `${i * 60}px` }} />
      ))}
    </div>
  );
}
