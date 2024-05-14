import React, { useState } from 'react';
import BookDisplay from './BookDisplay';
import './App.css';

function ImageInput() {
  const [imageURL, setImageURL] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setIsLoading(true);
  };

  return (
    <div className="image-input-container">
      {!submitted ? (
        <>
          <h1 className="image-input-title">📚 Book UI</h1>
          <p className="image-input-description">Enter the URL of an image and discover the magic! 🎩✨</p>
          <form className="image-input-form" onSubmit={handleSubmit}>
            <label className="image-input-label">
              <input className="image-input-field" type="text" placeholder="Image URL" value={imageURL} onChange={e => setImageURL(e.target.value)} />
            </label>
            <button className="image-input-submit" type="submit">✨</button>
          </form>
        </>
      ) : (
        <BookDisplay imageURL={imageURL} isLoading={isLoading} setIsLoading={setIsLoading} />
      )}
    </div>
  );
}

export default ImageInput;