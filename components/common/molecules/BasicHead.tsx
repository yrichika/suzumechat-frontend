import Head from 'next/head'
import React from 'react'

interface Props {
  children: any
  title: string
}

function BasicHead({ children, title }: Props) {
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1 viewport-fit=cover"
      />

      <link rel="shortcut icon" type="image/png" href="/icon.svg" />
      <link rel="icon" href="/icon.svg" />
      <link rel="apple-touch-icon" href="/icon.svg" />

      {children}

      <title>{title}</title>
    </Head>
  )
}

export default BasicHead
