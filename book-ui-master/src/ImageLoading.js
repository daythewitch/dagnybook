import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';

function ImageLoading({ imageUrl }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;

    // Simulate network delay by adding a timeout
    img.onload = () => setTimeout(() => setLoading(false), 500);

  }, [imageUrl]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img
        src={imageUrl}
        style={{
          filter: loading ? 'grayscale(100%)' : 'none',
          opacity: loading ? 0.5 : 1,
          width: '100%',
          height: 'auto',
        }}
        alt="content"
      />
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
          <CircularProgress />
        </div>
      )}
    </div>
  );
}

export default ImageLoading;
