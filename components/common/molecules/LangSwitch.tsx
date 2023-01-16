import { setLanguage } from '@utils/LanguageSwitch'
import React from 'react'

interface Props {
  langMap: Map<string, Map<string, string>>
}

function LangSwitch({ langMap }: Props) {
  return (
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
  )
}

export default LangSwitch
