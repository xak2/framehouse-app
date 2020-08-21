import React from 'react'
import App from 'next/app'
import { Provider } from 'react-redux'
import { SWRConfig } from 'swr'
import fetch from '../lib/fetchJson'
import withRedux from 'next-redux-wrapper'
import store from '../redux/store'

export class MyApp extends App {

  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
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
        <Provider store={store}>
          <Component {...pageProps} {...this.state} />
        </Provider>
      </SWRConfig>
    )
  }
}

const makeStore = () => store

export default withRedux(makeStore)(MyApp)