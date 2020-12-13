
import React, { useState, useEffect } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendation from './components/Recommendation'
import Notification from './components/Notification'
import { BOOK_ADDED, ALL_BOOKS, USER, ALL_RECOMMENDED_BOOKS } from './queries'


const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [notification, setNotification] = useState({ text: null })
  const client = useApolloClient()

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map(p => p.title).includes(object.title)

    let dataInStore = client.readQuery({ query: ALL_BOOKS })

    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: {
          ...dataInStore,
          allBooks: [...dataInStore.allBooks, addedBook]
        }
      })

      dataInStore = client.readQuery({ query: USER })
      if (dataInStore) {
        const favoriteGenre = dataInStore.me.favoriteGenre
        dataInStore = client.readQuery({
          query: ALL_RECOMMENDED_BOOKS,
          variables: { favoriteGenre }
        })
        if (addedBook.genres.includes(favoriteGenre)) {
          client.writeQuery({
            query: ALL_RECOMMENDED_BOOKS,
            variables: { favoriteGenre },
            data: {
              ...dataInStore,
              allBooks: [...dataInStore.allBooks, addedBook]
            }
          })
        }
      }
    }
  }


  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      displayNotification(`${addedBook.title} added`)
      updateCacheWith(addedBook)
    }
  })

  const displayNotification = (text) => {
    setNotification({ text })
    setTimeout(() => {
      setNotification({ text: null })
    }, 5000)
  }


  useEffect(() => {
    const savedToken = window.localStorage.getItem('user-token')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])


  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ?
          <button onClick={() => setPage('add')}>add book</button> :
          null
        }
        {token ?
          <button onClick={() => setPage('recommendation')}>recommendation</button> :
          null
        }
        {token ?
          <button onClick={logout} >logout</button> :
          <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Notification message={notification} />
      <Authors show={page === 'authors'}
        token={token}
      />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'}
        updateCacheWith={updateCacheWith}
      />
      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
      />
      <Recommendation show={page === 'recommendation'} />
    </div>
  )
}

export default App