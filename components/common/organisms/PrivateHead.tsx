import BasicHead from '@components/common/molecules/BasicHead'
import React from 'react'

interface Props {
  title: string
}

function PrivateHead({ title }: Props) {
  return (
    <BasicHead title={title}>
      <meta name="robots" content="none,noarchive" />
    </BasicHead>
  )
}

export default PrivateHead
