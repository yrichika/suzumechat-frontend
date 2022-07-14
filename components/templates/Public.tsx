import React, { useEffect } from 'react'
import PublicHead from '@components/organisms/PublicHead'
import { initLanguage } from '@utils/LanguageSwitch'
import Footer from '@components/organisms/Footer'
import Header from '@components/organisms/Header'

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
        <Header langMap={langMap} />
      </div>

      {children}

      <Footer />
    </>
  )
}

export default Public
