import React from 'react'
import App from 'next/app'
import { SWRConfig } from 'swr'
import fetch from '../lib/fetchJson'

export default class MyApp extends App {

  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  state = {
    user: {
      id: 2,
      name: 'Vyacheslav Stefanovich'
    }
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <SWRConfig
        value={{
          fetcher: fetch,
          onError: err => {
            console.error(err)
          },
        }}
      >
        <Component {...pageProps} {...this.state} />
      </SWRConfig>
    )
  }
}