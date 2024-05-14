import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookList from './BookList';
import ImageLoading from './ImageLoading';

function BookDisplay({ imageURL, setIsLoading, isLoading}) { 
    const [books, setBooks] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/process_files', {
                url: imageURL
              });
          setBooks(response.data.books);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [ imageURL, setIsLoading ]); 

  const bookTitles = books.map(book => book.title);

  return (
    <div className="book-list-display">
      {isLoading ? (
        <ImageLoading imageUrl={imageURL}/>
      ) : (
        <BookList bookTitles={bookTitles} />
      )}
    </div>
  );
}

export default BookDisplay;