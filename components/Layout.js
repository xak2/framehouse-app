import React, { Component } from 'react'
import { Customizer } from '@fluentui/react'
import {
  Stack,
  DefaultPalette,
  mergeStyleSets,
  initializeIcons,
  registerOnThemeChangeCallback
} from 'office-ui-fabric-react'
import { Depths } from '@uifabric/fluent-theme'
import Head from 'next/head'
import useUser from '../lib/useUser'
import Header from './Header'
import Navigation from './Navigation'

initializeIcons()

const Layout = (props) => {
  const { user } = useUser({ redirectTo: '/login' })
  if (!user || user.isLoggedIn === false) {
    return <div>loading...</div>
  }
  const styles = mergeStyleSets({
    root: { background: DefaultPalette.white },
    navigation: { background: DefaultPalette.white, padding: 5, width: '250px' },
    item: { background: DefaultPalette.white, padding: 10, width: '1200px', boxShadow: Depths.depth8 }
  });
  const tokens = {
    fiveGapStack: { childrenGap: 5, padding: 10 },
    tenGapStack: { childrenGap: 10 }
  };
  return (
    <Customizer>
      <Head>
        <title>FrameHouse App</title>
      </Head>
      <Header />
      <Stack
        horizontal
        disableShrink
        tokens={tokens.fiveGapStack}
        className={styles.root}
      >
        <Stack.Item align="auto" className={styles.navigation}>
          <Navigation />
        </Stack.Item>
        <Stack.Item align="auto" className={styles.item}>
          {props.children}
        </Stack.Item>
      </Stack>
      <style jsx global>{`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }
      body {
        margin: 50px 0 0 0;
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
export default Layout