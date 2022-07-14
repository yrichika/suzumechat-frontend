import { AppProps } from 'next/app'
import React, { useEffect } from 'react'
import PublicHead from '../organisms/PublicHead'
import { initLanguage, setLanguage } from '../../utils/LanguageSwitch'

interface Props {
  children: any
  langMap: Map<string, Map<string, string>>
}

function Public({ children, langMap }: Props) {
  useEffect(() => {
    initLanguage(langMap)
  }, [])

  return (
    <>
      <PublicHead title="SuzumeChat" />

      <div className="mx-auto mb-3 bg-gray-100">
        <header className="border-b-2 w-full mx-2">
          <div className="flex justify-between">
            <div className="flex justify-start items-center">
              <span className="mx-1">source &#64;</span>
              {/* TODO: */}
              <a
                className="text-blue-500 underline"
                href="#"
                target="_blank"
                rel="noopener nofererrer"
              >
                GitHub
              </a>
            </div>
            <div className="flex justify-end mr-2">
              <button
                className="text-blue-500 underline m-3"
                onClick={() => setLanguage('en', langMap)}
              >
                English
              </button>
              <button
                className="text-blue-500 underline m-3"
                onClick={() => setLanguage('ja', langMap)}
              >
                日本語
              </button>
            </div>
          </div>
        </header>
      </div>

      {children}

      <div className="border-t-2 mt-2 bg-gray-100">
        <div className="text-center">
          <span className="mx-1">support &#64;</span>
          <a
            className="text-blue-500 underline"
            href="#"
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
    </>
  )
}

export default Public
