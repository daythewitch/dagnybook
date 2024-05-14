import React, { useState } from 'react';

function ShowMoreText({ text, maxLength }) {
  const [showFullText, setShowFullText] = useState(false);

  if (text.length <= maxLength) {
    return <p>{text}</p>;
  }

  return (
    <div>
            {showFullText ? <p>{text.toString()}</p> : <p>{`${text.toString().substring(0, maxLength)}...`}</p>}
      <button onClick={() => setShowFullText(!showFullText)}>
        {showFullText ? 'See Less' : 'See More'}
      </button>
    </div>
  );
}

export default ShowMoreText;