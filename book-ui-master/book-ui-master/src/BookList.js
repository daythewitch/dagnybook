import React, { useEffect, useState } from 'react';
import BookInfo from './BookInfo';

function BookList({ bookTitles }) {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('alphabetical'); // New state for sorting

  const handleSortChange = () => {
    setSortCriteria(prevCriteria => prevCriteria === 'alphabetical' ? 'rating' : 'alphabetical');
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortCriteria === 'alphabetical') {
      return a.title.localeCompare(b.title);
    } else {
      return b.rating - a.rating;
    }
  });

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
                        return fetch(`https://openlibrary.org/works/${workKey}/ratings.json`)
                          .then(response => response.json())
                          .then(ratings => {
                            const averageRating = ratings.summary ? ratings.summary.average : 'No rating available';
                            return {
                              title: book.title,
                              author: author.name || 'Unknown',
                              summary: book.description ? book.description : 'No description available',
                              coverImageUrl: book.covers && book.covers.length > 0 ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg` : '',
                              rating: averageRating,
                            };
                          });
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
    <div className="book-list-container">
      <div className="search-sort-container">
        <input
          className="search-bar"
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="sort-button" onClick={handleSortChange}>
          {sortCriteria === 'alphabetical' ? '★' : '🔤'} <span className="sort-icon"></span>
        </button>
      </div>
      <div className="book-list-grid">
        {sortedBooks.map((book, index) => (
          <BookInfo key={`${book.title}-${book.author}`} {...book} />
        ))}
      </div>
    </div>
  );
}

export default BookList;