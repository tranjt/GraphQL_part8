import React, { useState } from 'react'
import { UPDATE_AUTHOR, ALL_AUTHORS } from '../queries'
import { useMutation } from '@apollo/client'
import Select from 'react-select'

const AuthorYearForm = ({ authors }) => {
  const [selectedOption, setSelectedOption] = useState(null)
  const [year, setYear] = useState('')

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.log(error)
    }
  })
  const options = authors.map(a => {
    return { value: a.name, label: a.name }
  })

  const submit = async (event) => {
    event.preventDefault()

    const numYear = Number(year)
    const name = selectedOption.value
    updateAuthor({
      variables: { name, numYear }
    })
    setYear('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div style={{ width: 300 }}>
          name
          <Select
            defaultValue={selectedOption}
            onChange={setSelectedOption}
            options={options}
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