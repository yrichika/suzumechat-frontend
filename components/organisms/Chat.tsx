import React, { useRef } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import ChatMessage from 'types/ChatMessage'
import { breakLines } from '@utils/Util'
import useChat from '@hooks/useChat'

type Props = {
  codename: string
  chatMessages: ChatMessage[]
  nameTextColor: string
  color: string
  sendChatMessage: (messageInput: string) => void
}

function Chat({
  codename,
  chatMessages,
  nameTextColor,
  color,
  sendChatMessage,
}: Props) {
  const nodeRef = useRef(null) // this is for avoiding CSSTransition warning
  const { messageInput, setMessageInput, handleMessage, sendShortcut } =
    useChat(sendChatMessage)

  return (
    <div className="grid grid-rows-2 md:grid-rows-1 grid-cols-1 md:grid-cols-2 gap-4">
      <div className="justify-center order-last md:order-first mx-2">
        <hr className="mx-2 my-2 md:invisible" />
        <p className="text-lg ml-2 mb-2">
          <span
            className={`border rounded-full px-2 bg-${color} ${nameTextColor}`}
          >
            {codename}
          </span>
        </p>
        <textarea
          name="message_input"
          id="messageInput"
          className="shadow border border-blue-600 rounded w-full px-2"
          value={messageInput}
          onChange={event => setMessageInput(event.target.value)}
          onKeyDown={sendShortcut}
        ></textarea>
        <ul className="mt-4">
          <li className="flex justify-center">
            <button
              id="sendChatMessageButton"
              className="lang-send-button btn btn-blue"
              onClick={() => handleMessage()}
              data-lang="send-button"
            ></button>
          </li>
          <li className="flex justify-center">
            <div
              className="text-sm text-gray-400 scc-tip"
              data-lang="send-button-message"
            ></div>
          </li>
        </ul>
      </div>

      <div className="justify-center mx-2">
        <div className="flex justify-center">
          <span className="text-lg" data-lang="chat-label"></span>
        </div>
        <hr className="my-2 border-2" />

        <TransitionGroup component="div">
          {chatMessages.map(message => (
            <CSSTransition
              nodeRef={nodeRef}
              key={message.timestamp}
              timeout={500}
              classNames="fade-chat-message"
            >
              {message.name === codename ? (
                <p ref={nodeRef} className="flex justify-start mb-2">
                  <span
                    className={`rounded-full px-2 self-start bg-${color} ${nameTextColor}`}
                  >
                    {message.name}
                  </span>
                  <span className={`mr-2 self-start text-${color}"`}>&gt;</span>
                  <span
                    className={`rounded border shadow px-2 border-${color}`}
                    dangerouslySetInnerHTML={{
                      __html: breakLines(message.message),
                    }}
                  ></span>
                </p>
              ) : (
                <p ref={nodeRef} className="flex justify-end mb-2">
                  <span
                    className={`rounded border shadow px-2 border-${message.color}`}
                    dangerouslySetInnerHTML={{
                      __html: breakLines(message.message),
                    }}
                  ></span>
                  <span className={`ml-2 self-end text-${message.color}`}>
                    &lt;
                  </span>
                  <span
                    className={`rounded-full px-2 self-end bg-${message.color} ${nameTextColor}`}
                  >
                    {message.name}
                  </span>
                </p>
              )}
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    </div>
  )
}

export default Chat
