import Router from 'next/router'
import { Nav } from 'office-ui-fabric-react'

const Navigation = () => {
    return (
        <Nav
            onLinkClick={(e, item) => {
                Router.push(item.path)
            }}
            styles={{
                root: {
                    boxSizing: 'border-box',
                    overflowY: 'auto'
                }
            }}
            groups={[
                {
                    links: [
                        { key: 'Dashboard', name: 'Dashboard', path: '/dashboard', icon: 'ViewDashboard' },
                        { key: 'Customers', name: 'Customers', path: '/customers', icon: 'People' },
                        { key: 'ProjectProgress', name: 'Project progress', path: '/dashboard/progress', icon: 'TimelineProgress' },
                        { key: 'Tasks', name: 'Tasks', path: '/dashboard/tasks', icon: 'TaskGroup' },
                        { key: 'Schedule', name: 'Schedule', path: '/dashboard/schedule', icon: 'Calendar' },
                        { key: 'Storehouse', name: 'Storehouse', path: '/dashboard/storehouse', icon: 'Quantity' },
                        { key: 'Settings', name: 'Account settings', path: '/profile', icon: 'PlayerSettings' },
                        { key: 'SignOut', name: 'Sign out', icon: 'Lock' }
                    ]
                }
            ]}
        />
    )
}

export default Navigation