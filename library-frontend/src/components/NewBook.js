import React, { useState } from 'react'
import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS, USER, ALL_RECOMMENDED_BOOKS } from '../queries'
import { useMutation } from '@apollo/client'

const NewBook = ({ show }) => {
  const [title, setTitle] = useState('')
  const [author, setAuhtor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.log(error)
    },
    update: (store, response) => {
      let dataInStore = store.readQuery({ query: ALL_BOOKS })
      const book = response.data.addBook
      store.writeQuery({
        query: ALL_BOOKS,
        data: {
          ...dataInStore,
          allBooks: [...dataInStore.allBooks, book]
        }
      })

      dataInStore = store.readQuery({ query: USER })
      if (dataInStore) {
        const favoriteGenre = dataInStore.me.favoriteGenre
        dataInStore = store.readQuery({
          query: ALL_RECOMMENDED_BOOKS,
          variables: { favoriteGenre }
        })
        if (book.genres.includes(favoriteGenre)) {
          store.writeQuery({
            query: ALL_RECOMMENDED_BOOKS,
            variables: { favoriteGenre },
            data: {
              ...dataInStore,
              allBooks: [...dataInStore.allBooks, book]
            }
          })
        }
      }
    }
  })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    createBook({
      variables: { title, author, published: Number(published), genres }
    })
    setTitle('')
    setPublished('')
    setAuhtor('')
    setGenres([])
    setGenre('')

  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook