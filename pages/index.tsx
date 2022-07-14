import type { NextPage } from 'next'
import Public from '@components/templates/Public'
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
