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
import useHostStore from '@stores/useHostStore'

function Home() {
  const [channelNameInput, setChannelNameInput] = useState('')
  const router = useRouter()

  const setChannelName = useHostStore(state => state.setChannelName)
  const setSecretKey = useHostStore(state => state.setSecretKey)
  const setLoginChannelToken = useHostStore(state => state.setLoginChannelToken)

  useEffect(() => {
    csrfTokenService()
  }, [])

  function postChannelName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    createChannelService(channelNameInput).then(createdChannel => {
      if (!createdChannel) {
        // just ignoring is fine for now. Usually it's validation error from backend
        return
      }
      setChannelName(channelNameInput)
      setLoginChannelToken(createdChannel.hostChannelToken)
      setSecretKey(createdChannel.secretKey)

      const redirectTo = '/host/view'
      router.push(`${redirectTo}/${createdChannel.hostChannelToken}`)
    })
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
            <form onSubmit={postChannelName}>
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
                      value={channelNameInput}
                      onChange={event =>
                        setChannelNameInput(event.target.value)
                      }
                      required
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
