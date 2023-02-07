import Link from 'next/link'
import React from 'react'

interface Props {
  dataLang: string
}

function BackToTopLink({ dataLang }: Props) {
  return (
    <nav className="container mx-auto px-5 py-2">
      <div className="text-center">
        <Link href="/">
          <a className="text-blue-500 underline" data-lang={dataLang}></a>
        </Link>
      </div>
    </nav>
  )
}

export default BackToTopLink
