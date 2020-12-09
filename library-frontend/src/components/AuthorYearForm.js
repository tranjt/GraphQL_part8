import React, { useState } from 'react'
import { UPDATE_AUTHOR, ALL_AUTHORS } from '../queries'
import { useMutation } from '@apollo/client'

const AuthorYearForm = () => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.log(error)
    }
  })


  const submit = async (event) => {
    event.preventDefault()

    const numYear = Number(year)
    updateAuthor({
      variables: { name, numYear }
    })
    setName('')
    setYear('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born
          <input
            type='number'
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )

}

export default AuthorYearForm