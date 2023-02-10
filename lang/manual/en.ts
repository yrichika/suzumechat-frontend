// FIXME: Rough translation
export const en = new Map<string, string>([
  ['title', 'How To Use'],
  [
    'initial',
    'In SuzumeChat, users who create text chat channels (chat channels are like chat rooms) are called hosts, and people who participate in them are called guests. Before starting SuzumeChat, please share your "codename" and "passphrase" with the people you want to chat with. A "passphrase" is a sentence or sentences used only by you and the guests so that you can verify that the guests are actually the people you know. For example, here, the codename is "john doe", and the passphrase is "Proud, for the human biggest enemy."',
  ],
  [
    'top-page',
    'On the SuzumeChat top page, enter a name for the channel that guests can easily recognize. A "channel name" is almost the same as a chat room name.',
  ],
  [
    'host-page',
    "You will be redirected to the host's chat page. In addition to the chatting functionality, in the host's page your can also manage guests. There is a URL at the top of the screen. The URL has the following format. Please copy it and share it with the people you want to chat with. You can share this URL by however your want(by voice, SMS, another chat app, just anything). It's not very important how you send this URL to your guests.",
  ],
  ['host-page-visitor-url', '/visitor/random_text'],
  ['guest-page-indicator', '[The guest side window]'],
  [
    'visitor-page-before-send',
    'When a guest accesses this URL, this screen will be displayed. The guest should enter his/her name and the passphrase that you and the guest have already decided. Here, suppose the guest entered "john doe" as the codename, and the passphrase as "Proud, for the human biggest enemy."',
  ],
  [
    'visitor-page-before-send-note-1',
    'this passphrase will be encrypted, and not stored on our servers',
  ],
  [
    'visitor-page-before-send-note-2',
    'If you want to try it yourself instead of chatting with guests, open another browser window and access the URL.',
  ],
  ['visitor-page-before-send-note-3', ''], // NOT USED for the English version.
  [
    'visitor-page-after-send',
    'When the guest send the codename and passphrase as a request, the guest will be in a waiting state for approval. The guest will wait on this screen until you (the host) approves or denies the request',
  ],
  [
    'host-page-accept-button',
    'The host\'s screen will display the guest\'s codename and passphrase. If this person is using the correct passphrase, click the "Accept" button',
  ],
  [
    'guest-page',
    "By accepting the guest, the guest's screen will automatically be redirected to the chat page. Now all you have to do is text chat with the guest! All messages are encrypted and automatically deleted. No messages are stored on our servers!",
  ],
  [
    'host-page-end-chat-button',
    "To end the chat channel, click the End Chat button. This will also redirect all guests' screen to the end page. All chat messages are deleted from the browsers.",
  ],
])
