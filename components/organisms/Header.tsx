import GitHubLink from '@components/molecules/GitHubLink'
import LangSwitch from '@components/molecules/LangSwitch'
import React from 'react'

interface Props {
  langMap: Map<string, Map<string, string>>
}
function Header({ langMap }: Props) {
  return (
    <header className="border-b-2 w-full mx-2">
      <div className="flex justify-between">
        <div className="flex justify-start items-center">
          <span className="mx-1">source &#64;</span>
          {/* TODO: */}
          <GitHubLink />
        </div>
        <LangSwitch langMap={langMap} />
      </div>
    </header>
  )
}

export default Header
