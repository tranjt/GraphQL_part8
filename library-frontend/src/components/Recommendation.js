
import React from 'react'
import { USER, ALL_BOOKS } from '../queries'
import { useQuery } from '@apollo/client'


const Recommendation = (props) => {
  const result = useQuery(USER)
  const booksResult = useQuery(ALL_BOOKS)
  if (result.loading) {
    return <div>loading...</div>
  }

  const books = booksResult.data.allBooks
  const filteredBooks = books.filter(b => b.genres.includes(result.data.me.favoriteGenre))
  if (!props.show) {
    return null
  }
  return (
    <div>
      <h2> Recommendations</h2>
      books in your favorite genre <b>{result.data.me.favoriteGenre}</b>

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
    </div>
  )
}

export default Recommendation