import React from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'

function AppFeatureList() {
  return (
    <section className="ml-2 mt-5 mb-10 lg:ml-10">
      <h2 className="hidden" data-lang="feature-h"></h2>

      <ul className="list-inside space-y-3">
        <li className="text-base md:text-lg lg:text-2xl px-2 text-gray-800">
          <i className="bi bi-person-x-fill text-yellow-500 pr-2"></i>
          <span data-lang="feature-item-1"></span>
        </li>
        <li className="text-base md:text-lg lg:text-2xl px-2 text-gray-800">
          <i className="bi bi-eye-slash-fill text-yellow-500 pr-2"></i>
          <span data-lang="feature-item-2"></span>
        </li>
        <li className="text-base md:text-lg lg:text-2xl px-2 text-gray-800">
          <i className="bi bi-file-earmark-break-fill text-yellow-500 pr-2"></i>
          <span data-lang="feature-item-3"></span>
        </li>
        <li className="text-base md:text-lg lg:text-2xl px-2 text-gray-800">
          <i className="bi bi-shield-lock-fill text-yellow-500 pr-2"></i>
          <span data-lang="feature-item-4"></span>
        </li>
        <li className="text-base md:text-lg lg:text-2xl px-2 text-gray-800">
          <i className="bi bi-alarm-fill text-yellow-500 pr-2"></i>
          <span data-lang="feature-item-5"></span>
        </li>
        <li className="text-base md:text-lg lg:text-2xl px-2 text-gray-800">
          <i className="bi bi-file-lock-fill text-yellow-500 pr-2"></i>
          <span data-lang="feature-item-6"></span>
        </li>
        <li className="text-base md:text-lg lg:text-2xl px-2 text-gray-800">
          <i className="bi bi-trash-fill text-yellow-500 pr-2"></i>
          <span data-lang="feature-item-7"></span>
        </li>
        <li className="text-base md:text-lg lg:text-2xl px-2 text-gray-800">
          <i className="bi bi-github text-yellow-500 pr-2"></i>
          <span data-lang="feature-item-8"></span>
        </li>
        <li className="text-base md:text-lg lg:text-2xl px-2 text-gray-800">
          <i className="bi bi-twitter text-yellow-500 pr-2"></i>
          <span data-lang="feature-item-9"></span>
        </li>
      </ul>
    </section>
  )
}

export default AppFeatureList
