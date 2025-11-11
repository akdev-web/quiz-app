import React from 'react'

const AlertMessage = (message) => {

  const defaultStyle = 'px-4 py-2 text-sm rounded-md my-2';
  const styles = {
    err: 'bg-red-200 text-red-800',
    ok: 'bg-green-200 text-green-800',
    default: 'bg-gray-200 text-gray-800',
  }

  console.log(message);

  return (
    <p className={`${defaultStyle} ${styles[message.type] || styles.default}`} >
        {message.msg}
    </p>
  )
}

export default AlertMessage