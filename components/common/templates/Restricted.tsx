import React, { useEffect } from 'react'
import { initLanguage } from '@utils/LanguageSwitch'
import RestrictedHead from '@components/common/organisms/RestrictedHead'
import Footer from '@components/common/organisms/Footer'
import Header from '@components/common/organisms/Header'
import { hideTips } from '@utils/Util'

interface Props {
  children: any
  langMap: Map<string, Map<string, string>>
}

function Restricted({ children, langMap }: Props) {
  useEffect(() => {
    initLanguage(langMap)
    hideTips('.sc-tip')
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
