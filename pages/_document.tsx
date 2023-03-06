import { Html, Head, Main, NextScript } from 'next/document'

function AppDocument() {
  return (
    <Html>
      <Head prefix="og: https://ogp.me/ns#" />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default AppDocument
