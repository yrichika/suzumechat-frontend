import Public from '@components/common/templates/Public'
import React from 'react'
import { langMap } from '@lang/manual/langMap'
import Image from 'next/image'
import Link from 'next/link'
import BackToTopLink from '@components/manual/BackToTopLink'

// TODO: show larger image by clicking
function Manual() {
  const url = process.env.NEXT_PUBLIC_FRONT_URL
  return (
    <Public langMap={langMap}>
      <main className="container mx-auto px-5 py-5">
        <h1
          className="text-3xl text-gray-800 text-center"
          data-lang="title"
        ></h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <div className="col-span-1 md:col-span-2">
            <p className="lg:pl-10 xl:pl-36 leading-7" data-lang="initial"></p>
          </div>

          <hr className="md:hidden" />

          <div className="manual-image-container">
            <Image
              src="/images/manual/1.png"
              alt="top page"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="pl-5">
            <p className="leading-7" data-lang="top-page"></p>
          </div>

          <hr className="md:hidden" />

          <div className="manual-image-container">
            <Image
              src="/images/manual/2_1.png"
              alt="host page"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="pl-5">
            <p className="leading-7" data-lang="host-page"></p>
            <p>
              <code>
                <span>{url}</span>
                <span data-lang="host-page-visitor-url"></span>
              </code>
            </p>
          </div>

          <hr className="md:hidden" />

          <div className="manual-image-container">
            <Image
              src="/images/manual/3.png"
              layout="fill"
              alt="visitor page"
              objectFit="contain"
            />
          </div>
          <div className="pl-5">
            <span
              className="text-lg text-bold text-red-500"
              data-lang="guest-page-indicator"
            ></span>
            <p className="leading-7" data-lang="visitor-page-before-send"></p>
            <ul className="list-disc pl-3 space-y-1">
              <li
                className="text-xs"
                data-lang="visitor-page-before-send-note-1"
              ></li>
              <li
                className="text-xs"
                data-lang="visitor-page-before-send-note-2"
              ></li>
              <li
                className="text-xs"
                data-lang="visitor-page-before-send-note-3"
              ></li>
            </ul>
          </div>

          <hr className="md:hidden" />

          <div className="manual-image-container">
            <Image
              src="/images/manual/4.png"
              layout="fill"
              alt="visitor page: waiting status"
              objectFit="contain"
            />
          </div>
          <div className="pl-5">
            <span
              className="text-lg text-bold text-red-500"
              data-lang="guest-page-indicator"
            ></span>
            <p className="leading-7" data-lang="visitor-page-after-send"></p>
          </div>

          <hr className="md:hidden" />

          <div className="manual-image-container">
            <Image
              src="/images/manual/5_1.png"
              layout="fill"
              alt="host page: accepting visitor's join request"
              objectFit="contain"
            />
          </div>
          <div className="pl-5">
            <p className="leading-7" data-lang="host-page-accept-button"></p>
          </div>

          <hr className="md:hidden" />

          <div className="manual-image-container">
            <Image
              src="/images/manual/6.png"
              layout="fill"
              alt="guest page"
              objectFit="contain"
            />
          </div>
          <div className="pl-5">
            <span
              className="text-lg text-bold text-red-500"
              data-lang="guest-page-indicator"
            ></span>
            <p className="leading-7" data-lang="guest-page"></p>
          </div>

          <hr className="md:hidden" />

          <div className="manual-image-container">
            <Image
              src="/images/manual/8_1.png"
              alt="host page: explanation for end chat button"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="pl-5">
            <p className="leading-7" data-lang="host-page-end-chat-button"></p>
          </div>
        </div>
      </main>
    </Public>
  )
}

export default Manual
