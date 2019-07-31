import Document, {
  Html,
  Head,
  Main,
  NextScript,
  NextDocumentContext,
} from 'next/document'
import { ServerStyleSheet } from 'styled-components'

const globalStyle = `
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: sans-serif;  
}

@font-face{
  font-family: OCR-A;
  src: url(/static/OCR-A.ttf);
  font-weight: normal;
  font-style: normal;
}
`
class MyDocument extends Document {
  static async getInitialProps(ctx: NextDocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <style>{globalStyle}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
