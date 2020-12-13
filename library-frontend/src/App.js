
import React, { useState, useEffect } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendation from './components/Recommendation'
import { BOOK_ADDED } from './queries'
import Notification from './components/Notification'


const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [notification, setNotification] = useState({ text: null })
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      displayNotification(`${addedBook.title} added`)
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
      <Authors show={page === 'authors'} token={token} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} />
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