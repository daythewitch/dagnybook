import React, { useEffect, useState } from 'react';
import BookInfo from './BookInfo';

function BookList({ bookTitles }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const bookPromises = bookTitles.map(title =>
        fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`)
          .then(response => response.json())
          .then(data => {
            if (data.docs.length > 0) {
              const firstBook = data.docs[0];
              const workKey = firstBook.key.replace('/works/', '');
              return fetch(`https://openlibrary.org/works/${workKey}.json`)
                .then(response => response.json())
                .then(book => {
                  if (book && book.authors && book.authors.length > 0) {
                    return fetch(`https://openlibrary.org${book.authors[0].author.key}.json`)
                      .then(response => response.json())
                      .then(author => {
                        return {
                          title: book.title,
                          author: author.name || "Unknown",
                          summary: book.description ? book.description : "No description available",
                          coverImageUrl: book.covers && book.covers.length > 0 ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg` : "",
                          rating: 4 // This could be replaced with actual data if available
                        };
                      });
                  }
                });
            }
          })
      );
      const booksData = await Promise.all(bookPromises);
      setBooks(booksData.filter(book => book)); // Filter out any undefined entries
    };

    fetchBooks();
  }, [bookTitles]);

  return (
    <div className="book-list-grid">
      {books.map((book, index) => (
        <BookInfo key={`${book.title}-${book.author}`} {...book} />
      ))}
    </div>
  );
}

export default BookList;

