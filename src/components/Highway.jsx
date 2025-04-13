import React from 'react';
import './Highway.css';

export default function Highway() {
  return (
    <div className="highway">
      {/* Side stripes */}
      <div className="side-stripe left-stripe" />
      <div className="side-stripe right-stripe" />

      {/* Lane dividers (center + two more) */}
      {[...Array(15)].map((_, i) => (
        <>
          <div key={`line1-${i}`} className="line" style={{ left: '33%', top: `${i * 60}px` }} />
          <div key={`line2-${i}`} className="line" style={{ left: '50%', top: `${i * 60}px` }} />
          <div key={`line3-${i}`} className="line" style={{ left: '67%', top: `${i * 60}px` }} />
        </>
      ))}
    </div>
  );
}
