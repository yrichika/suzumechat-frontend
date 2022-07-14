import React from 'react'

function Footer() {
  return (
    <div className="border-t-2 mt-2 bg-gray-100">
      <div className="text-center">
        <span className="mx-1">support &#64;</span>
        <a
          className="text-blue-500 underline"
          href="#" // TODO:
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </a>
      </div>
      <footer className="mt-2">
        <p className="text-center">&copy; yrichika</p>
      </footer>
    </div>
  )
}

export default Footer
