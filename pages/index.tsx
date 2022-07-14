import type { NextPage } from 'next'
import { useEffect, useRef } from 'react'
import Public from '@components/layouts/Public'
import { langMap } from '@lang/index/langMap'

const Home: NextPage = () => {
  return (
    <Public langMap={langMap}>
      <p data-lang="subtitle">placeholder</p>
      <p data-lang="fake">placeholder2</p>
    </Public>
  )
}

export default Home
