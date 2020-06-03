import React, { Component } from 'react'
import { Customizer } from '@fluentui/react'
import {
  Stack,
  mergeStyles,
  initializeIcons
} from 'office-ui-fabric-react'
import Head from 'next/head'

initializeIcons()

export default class Layout extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Customizer>
        <Head>
          <title>FrameHouse App</title>
        </Head>
        <div className="container">
          {this.props.children}
        </div>
        <style jsx global>{`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        color: #333;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          'Helvetica Neue', Arial, Noto Sans, sans-serif, 'Apple Color Emoji',
          'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
      }
      .container {        
        min-height: 97vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    `}</style>
      </Customizer>
    )
  }
}