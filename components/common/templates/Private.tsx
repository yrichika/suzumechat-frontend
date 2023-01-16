import Header from '@components/common/organisms/Header'
import PrivateHead from '@components/common/organisms/PrivateHead'
import { initLanguage } from '@utils/LanguageSwitch'
import React, { useEffect } from 'react'

interface Props {
  children: any
  langMap: Map<string, Map<string, string>>
  channelName: string
}

function Private({ children, langMap, channelName }: Props) {
  useEffect(() => {
    initLanguage(langMap)
  }, [])
  return (
    <>
      <PrivateHead title={channelName} />
      <div className="mx-auto mb-3 bg-gray-100">
        <Header langMap={langMap} />
      </div>

      {children}
    </>
  )
}

export default Private
