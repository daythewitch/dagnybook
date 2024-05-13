import React, { useState } from 'react';
import BookDisplay from './BookDisplay';
import './App.css';

function ImageInput() {
  const [imageURL, setImageURL] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setIsLoading(true);
  };

  return (
    <div>
      {!submitted ? (
        <form className="image-input-form" onSubmit={handleSubmit}>
        <label>
          Image URL:
          <input className="image-input-field" type="text" value={imageURL} onChange={e => setImageURL(e.target.value)} />
        </label>
        <input className="image-input-submit" type="submit" value="Submit" />
      </form>
      ) : (
        <BookDisplay imageURL={imageURL} isLoading={isLoading} setIsLoading={setIsLoading} />
      )}
    </div>
  );
}

export default ImageInput;