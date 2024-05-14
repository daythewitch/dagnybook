import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';

function ImageLoading({ imageUrl }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
  }, [imageUrl]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img
        src={imageUrl}
        onLoad={() => setLoading(false)}
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