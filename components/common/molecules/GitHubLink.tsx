import React from 'react'

function GitHubLink() {
  return (
    <span>
      GitHub&#40;
      <a
        href="https://github.com/yrichika/suzumechat-frontend"
        className="text-blue-500 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Frontend
      </a>
      |
      <a
        href="https://github.com/yrichika/suzumechat-backend"
        className="text-blue-500 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Backend
      </a>
      &#41;
    </span>
  )
}

export default GitHubLink
