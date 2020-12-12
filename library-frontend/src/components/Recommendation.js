
import React, { useState } from 'react'
import { ALL_RECOMMENDED_BOOKS, USER } from '../queries'
import { useApolloClient } from '@apollo/client'
import BookTable from './BookTable'


const Recommendation = ({ show }) => {
  const [books, setBooks] = useState([])
  const [favoriteGenre, setFavoriteGenre] = useState(null)
  const client = useApolloClient()

  if (!show) {
    return null
  }

  client.query({
    query: USER
  }).then((result) => {
    setFavoriteGenre(result.data.me.favoriteGenre)
  })

  if (favoriteGenre) {
    client.query({
      query: ALL_RECOMMENDED_BOOKS,
      variables: { favoriteGenre }
    }).then((result) => {
      setBooks(result.data.allBooks)
    })
  }

  if (books.length === 0) {
    return (
      <div>No recommendations found</div>
    )
  }

  return (
    <div>
      <h2> Recommendations</h2>
      books in your favorite genre <b>{favoriteGenre}</b>
      <BookTable books={books} />
    </div>
  )
}

export default Recommendation