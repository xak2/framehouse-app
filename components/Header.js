import React from 'react'
import {
    Layer,
    getTheme,
    mergeStyles,
    mergeStyleSets,
    FontIcon
} from '@fluentui/react'
import { Depths } from '@uifabric/fluent-theme'
import Link from 'next/link'
import useUser from '../lib/useUser'
import { useRouter } from 'next/router'
import fetchJson from '../lib/fetchJson'

const theme = getTheme();
const classes = mergeStyleSets({
    header: {
        backgroundColor: theme.palette.themePrimary,
        color: theme.palette.white,
        textAlign: 'right',
        lineHeight: '50px',
        padding: '0 20px',
        boxShadow: Depths.depth8
    },
    icon: {
        fontSize: 20,
        color: '#fff',
        margin: '0 15px 0 15px',
        verticalAlign: 'middle'
    },
    link: {
        fontSize: 14,
        color: '#fff',
        textDecoration: 'none',
        selectors: {
            ':hover': {
                textDecoration: 'underline'
            }
        }
    }
})

const Header = () => {
    const { user, mutateUser } = useUser()
    const router = useRouter()
    return (
        <Layer>
            <div className={classes.header}>
                <Link href="/profile"><a className={classes.link}>Welcome, {user.name}</a></Link>
                <a href="/" onClick={
                    async e => {
                        e.preventDefault()
                        await mutateUser(fetchJson('/api/logout'))
                        router.push('/login')
                    }
                }><FontIcon iconName="SignOut" className={classes.icon} /></a>
            </div>
        </Layer>
    )
}

export default Header