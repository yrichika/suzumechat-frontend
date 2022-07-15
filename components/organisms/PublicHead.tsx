import React from 'react'
import BasicHead from '@components/molecules/BasicHead'

interface Props {
  title: string
}

function PublicHead({ title }: Props) {
  return (
    <BasicHead title={title}>
      <meta
        property="og:url"
        content="TODO:@routes.TopController.index().absoluteURL(true)"
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="SuzumeChat" />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content="Totally Anonymous and Private Web Chat App"
      />

      {/* <meta name="twitter:card" content="summary">
        <meta name="twitter:site" content="@@#"> */}

      <meta
        name="description"
        content="Totally Anonymous and Private Web Chat App"
      />
    </BasicHead>
  )
}

export default PublicHead
