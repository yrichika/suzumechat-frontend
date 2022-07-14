import BasicHead from '@components/molecules/BasicHead'
import React from 'react'

interface Props {
  title: string
}

function RestrictedHead({ title }: Props) {
  return (
    <BasicHead title={title}>
      <meta name="robots" content="none,noarchive" />
      <meta
        name="description"
        content="Totally Anonymous and Private Web Chat App"
      />
    </BasicHead>
  )
}

export default RestrictedHead
