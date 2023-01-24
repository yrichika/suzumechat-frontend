import React, { useEffect } from 'react'
import PublicHead from '@components/common/organisms/PublicHead'
import { initLanguage } from '@utils/LanguageSwitch'
import Footer from '@components/common/organisms/Footer'
import Header from '@components/common/organisms/Header'
import { hideTips } from '@utils/Util'

interface Props {
  children: any
  langMap: Map<string, Map<string, string>>
}

function Public({ children, langMap }: Props) {
  useEffect(() => {
    initLanguage(langMap)
    hideTips('.sc-tip')
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
