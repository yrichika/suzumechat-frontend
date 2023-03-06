# SuzumeChat Frontend

**The documentation is still in progress!**
## Basic Usages

Before you start this frontend server, you need to start the SuzumeChat backend server.

```bash
# run the development server
yarn dev

# run unit tests
yarn test
```

## Key Exchange

Codename and passphrase are encrypted by public key encryption.
Chat messages are encrypted by secret key encryption.

Here is how they are exchanged in SuzumeChat.

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
  Visitor ->> Backend: Access Vistior Page
  Backend ->> Visitor: the Host Public Key
  Visitor ->> Visitor: Generate Visitor Pub/Pri Keys
  Visitor ->> Visitor: Encrypt [codename] and [passphrase] with<br>(1)the Host Public Key <br>and (2)the Visitor Secret Key
  Visitor ->> Host: (1)the Visitor Public Key,<br>(2)Encrypted data<br>Not saved or cached at the backend
  Host ->> Host: Decrypt with (1) the Host Private Key<br>and (2) the Visitor Public Key
  Host ->> Backend: Tells the backend the host<br> is accepting visitor's request
  Backend ->> Visitor: Chat Secret Key
```
