import React from 'react'

function Rating({value, text, color}) {
  return (
    <div>
      <span className="text-warning">
        {'★'.repeat(Math.floor(value))}
        {'☆'.repeat(5 - Math.floor(value))}
      </span>
      <span className="ms-2">{text}</span>
    </div>
  )
}

export default Rating