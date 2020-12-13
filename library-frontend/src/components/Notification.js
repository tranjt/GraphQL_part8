import React from 'react'

const Notification = ({ message }) => {

  const divStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderSadius: 5,
    padding: 10,
    marginBottom: 10,
  }


  if (message.text === null) {
    return null
  }

  return (
    <div style={divStyle}>
      {message.text}
    </div>
  )
}

export default Notification