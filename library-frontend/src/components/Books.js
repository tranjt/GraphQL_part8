import React, { useState } from 'react'
import { ALL_BOOKS } from '../queries'
import { useQuery } from '@apollo/client'

const Books = (props) => {
  const [genreFilter, setGenreFilter] = useState('all genres')
  const result = useQuery(ALL_BOOKS)
  let filteredBooks = []

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks
  const genres = books.map(book => book.genres).flat()
  const uniqueGenres = Array.from(new Set(genres))
  uniqueGenres.push('all genres')
  filteredBooks = genreFilter === 'all genres' ?
    books :
    books.filter(b => b.genres.includes(genreFilter))

  const handleClick = ({ genre }) => {
    setGenreFilter(genre)
  }

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {filteredBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      {uniqueGenres.map(genre =>
        <button key={genre} onClick={() => handleClick({ genre })}>{genre}</button>
      )}

    </div>
  )
}

export default Books