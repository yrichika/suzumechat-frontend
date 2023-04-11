# SuzumeChat Frontend

**The documentation is still in progress!**
## Basic Usages

This is a simple Next.js project with few additions (only Cypress has been added, but it shouldn't affect the basic Next.js project).

But before you start developing locally, please start [the backend for this project](https://github.com/yrichika/suzumechat-backend); otherwise, this app will not be functional."


```bash
# run the development server
yarn dev

# run unit tests
yarn test
```

## Key Exchange

Codename and passphrase are encrypted using public key encryption. Chat messages are encrypted using secret key encryption.

Here is how they are exchanged in SuzumeChat:

```mermaid
sequenceDiagram
  autonumber
  actor Host
  participant Backend
  actor Visitor
  Host ->> Host: Generate Host Pub/Pri Keys
  Host ->> Backend: Host Public Key
  Backend ->> Backend: Save the Host Public Key
  Backend ->> Backend: Generate a Chat Secret Key (Common Key)
  Backend ->> Host: Chat Secret Key
  Visitor ->> Backend: Access Visitor Page
  Backend ->> Visitor: the Host Public Key
  Visitor ->> Visitor: Generate Visitor Pub/Pri Keys
  Visitor ->> Visitor: Encrypt [codename] and [passphrase] with<br>(1)the Host Public Key <br>and (2)the Visitor Secret Key
  Visitor ->> Host: (1)the Visitor Public Key,<br>(2)Encrypted data<br>Not saved or cached at the backend
  Host ->> Host: Decrypt with (1) the Host Private Key<br>and (2) the Visitor Public Key
  Host ->> Backend: Tells the backend the host<br> is accepting visitor's request
  Backend ->> Visitor: Chat Secret Key
```

Although chat secret keys are encrypted using SSL/TLS (which only provides encryption for HTTPS), I am considering encrypting them with the Host/Visitor public key as well. Please share your thoughts via GitHub Issues or [Twitter](https://twitter.com/SangoIsland).

