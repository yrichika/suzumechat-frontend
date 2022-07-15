import { Html, Head, Main, NextScript } from 'next/document'

function AppDocument() {
  // TODO: Open Graph: head prefix="og: ..."
  return (
    // TODO: is there any way to auto detect lang?
    <Html lang="ja">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default AppDocument
