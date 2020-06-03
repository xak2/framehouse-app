import React from 'react'
import Router from 'next/router'
import useUser from '../lib/useUser'
import {
  Spinner,
  SpinnerSize
} from '@fluentui/react'
import Layout from '../components/UnauthenticatedLayout'

const Index = () => {
  const { user } = useUser({ redirectTo: '/login' })

  if (!user || user.isLoggedIn === false) {
    return <Layout><Spinner size={SpinnerSize.large} /></Layout>
  } else {
    Router.push('/dashboard')
    return <Layout><Spinner size={SpinnerSize.large} /></Layout>
  }
  return ( <Layout><Spinner size={SpinnerSize.large} /></Layout> )

}

export default Index