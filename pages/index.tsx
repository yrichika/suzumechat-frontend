import type { NextPage } from 'next'
import Public from '@components/templates/Public'
import { langMap } from '@lang/index/langMap'
import Image from 'next/image'
import AppFeatureList from '@components/organisms/AppFeatureList'
import TermOfService from '@components/organisms/TermOfService'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import createChannelService from '@services/createChannelService'
import csrfTokenService from '@services/csrfTokenService'

// export function getServerSideProps(context: any) {
//   return csrfTokenService(context)
// }

function Home() {
  const [channelName, setChannelName] = useState('')
  const router = useRouter()

  useEffect(() => {
    csrfTokenService()
  }, [])

  function postData(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    createChannelService(channelName, router)
  }

  return (
    <Public langMap={langMap}>
      <main className="container mx-auto px-5">
        <div className="flex justify-center mt-3">
          <Image src="/icon.svg" alt="icon" width="120px" height="120px" />
        </div>
        <div className="flex justify-center mt-5">
          <h1 className="flex-initial text-3xl text-gray-800">SuzumeChat</h1>
          <div className="flex-initial mt-2 ml-2">
            <span>(beta)</span>
          </div>
        </div>
        <section className="mb-10">
          <h2 className="hidden">Application</h2>
          <div className="flex justify-center mt-5">
            <form onSubmit={postData}>
              <ul>
                <li>
                  <div className="w-full text-center">
                    <label
                      htmlFor="channelName"
                      className="block"
                      data-lang="lang-input-label-channelName"
                    ></label>
                    <input
                      type="text"
                      id="channelName"
                      name="channelName"
                      className="wp-text-input h-8 w-auto sm:w-80 px-2"
                      placeholder="Feel Safe To Chat"
                      value={channelName}
                      onChange={event => setChannelName(event.target.value)}
                    ></input>
                  </div>
                </li>
              </ul>
              <div className="mt-5">
                <p
                  className="text-center text-lg text-gray-800"
                  data-lang="subtitle"
                ></p>
                <p
                  className="md:text-center sm:mx-4 text-md text-gray-600"
                  data-lang="description"
                ></p>
              </div>
              <div className="text-center mt-5">
                <button
                  type="submit"
                  className="btn btn-blue"
                  data-lang="create-button"
                ></button>
              </div>
            </form>
          </div>
        </section>

        <hr className="my-3 mx-2" />
        <AppFeatureList />
        <hr className="my-3 mx-2" />
        <TermOfService />
      </main>
    </Public>
  )
}

export default Home
