import React from 'react';
import ShowMoreText from './ShowMoreText'; 
import ImageLoading from './ImageLoading';

function StarRating({ rating }) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < Math.floor(rating)) {
      stars.push(<span key={i} className="star filled">&#9733;</span>);
    } else if (i < rating) {
      stars.push(<span key={i} className="star half-filled">&#9733;</span>);
    } else {
      stars.push(<span key={i} className="star">&#9733;</span>);
    }
  }
  return <div className="star-rating">{stars}</div>;
}

function BookInfo({ title, author, summary, coverImageUrl, rating }) {
  return (
    <div className="book-info">
      <div className="cover-image-wrapper">
        <ImageLoading imageUrl={coverImageUrl} alt={`Cover of the book ${title}`} className="book-cover" />
      </div>
      <div className="book-details">
        <h2 className="book-title">{title}</h2>
        <h3 className="book-author">by {author}</h3>
        <StarRating rating={rating} />
        <ShowMoreText text={summary} maxLength={50} />
      </div>
    </div>
  );
}

export default BookInfo;