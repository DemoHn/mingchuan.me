import App from 'next/app'
import Head from 'next/head'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import '../components/PostContent/styles.scss'

const theme = {
  colors: {
    primary: '#0070f3',
  },
}

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

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }: any) {
    let pageProps = {}

    if (Component.getInitialgiProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props
    return (      
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <style>{globalStyle}</style>
        </Head>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>      
      </>
    )
  }
}
