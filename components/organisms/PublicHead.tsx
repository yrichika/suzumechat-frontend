import Head from 'next/head'
import React from 'react'

interface Props {
  title: string
}

function PublicHead({ title }: Props) {
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
      {/* <link rel="apple-mobile-web-app-title" content="SuzumeChat"/> */}

      <meta
        property="og:url"
        content="TODO:@routes.TopController.index().absoluteURL(true)"
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="SuzumeChat" />
      <meta property="og:title" content="{title}" />
      <meta
        property="og:description"
        content="Totally Anonymous and Private Web Chat App"
      />

      <meta
        name="description"
        content="Totally Anonymous and Private Web Chat App"
      />

      <title>{title}</title>
    </Head>
  )
}

export default PublicHead
