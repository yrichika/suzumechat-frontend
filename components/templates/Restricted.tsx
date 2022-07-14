import React, { useEffect } from 'react'
import { initLanguage } from '@utils/LanguageSwitch'
import RestrictedHead from '@components/organisms/RestrictedHead'
import Footer from '@components/organisms/Footer'
import Header from '@components/organisms/Header'

interface Props {
  children: any
  langMap: Map<string, Map<string, string>>
}

function Restricted({ children, langMap }: Props) {
  useEffect(() => {
    initLanguage(langMap)
  }, [])
  return (
    <>
      <RestrictedHead title="SuzumeChat | Joining a chat room..." />
      <div className="mx-auto mb-3 bg-gray-100">
        <Header langMap={langMap} />
      </div>

      {children}

      <Footer />
    </>
  )
}

export default Restricted
