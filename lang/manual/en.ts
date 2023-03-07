// FIXME: Rough translation
export const en = new Map<string, string>([
  ['title', 'How To Use'],
  [
    'initial',
    'In SuzumeChat, the users who create text chat channels, which are similar to chat rooms, are referred to as "hosts," while those who participate in them are referred to as "guests." Before using SuzumeChat, please share your "codename" and "passphrase" with the individuals with whom you wish to chat. A "passphrase" is a sentence or set of sentences known only to you and the guests, allowing you to verify the identity of those participating. For instance, in this scenario, the codename is "John Doe," and the passphrase is "Proud, for the human biggest enemy."',
  ],
  [
    'top-page',
    'On the SuzumeChat homepage, enter a name for the channel that guests can easily recognize. A "channel name" is almost the same as a chat room name.',
  ],
  [
    'host-page',
    "You will be directed to the host's chat page, where you can chat with other users and manage your guests. A URL is located at the top of the screen, with the following format. Simply copy and share it with the individuals with whom you wish to chat. You may share this URL using any method you prefer, such as by voice, SMS, or another chat app. It is not crucial how you send the URL to your guests.",
  ],
  ['host-page-visitor-url', '/visitor/[random_text]'],
  ['guest-page-indicator', '[The Guest Page (NOT your browser window)]'],
  [
    'visitor-page-before-send',
    'Once a guest accesses the URL, the following screen will appear. The guest should enter their name and the previously agreed-upon passphrase. In this example, let us assume that the guest entered "John Doe" as their codename and "Proud, for the human biggest enemy" as their passphrase.',
  ],
  [
    'visitor-page-before-send-note-1',
    'this passphrase will be encrypted and not stored on our servers.',
  ],
  [
    'visitor-page-before-send-note-2',
    'If you prefer to test this app instead of chatting with guests, simply open another browser window and access the URL.',
  ],
  ['visitor-page-before-send-note-3', ''], // NOT USED for the English version.
  [
    'visitor-page-after-send',
    'Once the guest submits their codename and passphrase, they will enter a waiting state until you (the host) either approve or deny their request. The guest will remain on this screen until you make a decision.',
  ],
  [
    'host-page-accept-button',
    'The host\'s screen will display the guest\'s codename and passphrase. If this person is using the correct passphrase, click the "Accept" button to allow them to join.',
  ],
  [
    'guest-page',
    'Once the guest is accepted, their screen will be automatically redirected to the chat page, and you can start chatting with them. All messages are encrypted and will be automatically deleted. We do not store any messages on our servers.',
  ],
  [
    'host-page-end-chat-button',
    'To end the chat channel, click on the "End Chat" button. This will redirect all guests to the end page, and all chat messages will be deleted from the browsers.',
  ],
])
