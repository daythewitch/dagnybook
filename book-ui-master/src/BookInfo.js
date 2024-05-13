import React from 'react';
import ShowMoreText from './ShowMoreText'; 

function StarRating({ rating }) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span key={i} className={i < rating ? "star filled" : "star"}>
        &#9733;
      </span>
    );
  }
  return <div>{stars}</div>;
}

function BookInfo({ title, author, summary, coverImageUrl, rating }) {
  return (
    <div className="book-info">
      <img src={coverImageUrl} alt={`Cover of the book ${title}`} className="book-cover" />
      <h2>{title}</h2>
      <h3>by {author}</h3>
      <StarRating rating={rating} />
      <ShowMoreText text={summary} maxLength={50} /> {}
    </div>
  );
}

export default BookInfo;