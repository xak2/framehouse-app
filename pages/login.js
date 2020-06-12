import React from 'react'
import { useState } from 'react'
import useUser from '../lib/useUser'
import Layout from '../components/UnauthenticatedLayout'
import Form from '../components/Form'
import fetchJson from '../lib/fetchJson'

const Login = () => {
    const { mutateUser } = useUser({
        redirectTo: '/customers',
        redirectIfFound: true,
    })

    const [errorMsg, setErrorMsg] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()

        const body = {
            username: e.currentTarget.username.value,
            password: e.currentTarget.password.value,
        }

        try {
            const res = await mutateUser(
                fetchJson('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                })
            )
            if (res.error) {
                setErrorMsg(res.error)
            }
        } catch (error) {
            console.error('An unexpected error happened:', error)
            setErrorMsg(error.data.message)
        }
    }

    return (
        <Layout>
            <Form isLogin errorMessage={errorMsg} onSubmit={handleSubmit} />
        </Layout>
    )
}

export default Login