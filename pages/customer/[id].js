import React, { setState } from 'react'
import { withRouter } from 'next/router'
import fetch from '../../lib/fetchJson'
import axios from 'axios'
import Layout from '../../components/Layout'
import {
    Stack,
    Text,
    Spinner,
    SpinnerSize,
    TextField,
    CommandBar,
    DetailsList,
    DetailsListLayoutMode,
    OverflowSet,
    CommandBarButton,
    FontIcon,
    getTheme,
    mergeStyles,
    mergeStyleSets,
    DetailsHeader,
    Selection,
    MarqueeSelection
} from '@fluentui/react'
import Router from 'next/router'
import moment from 'moment'
import CreateProject from './create-project'

const theme = getTheme();
const classes = mergeStyleSets({
    icon: {
        fontSize: 16,
        color: theme.palette.themePrimary,
        verticalAlign: 'middle',
        selectors: {
            ':hover': {
                color: '#00508A'
            }
        }
    },
    link: {
        fontSize: 14,
        color: theme.palette.themePrimary,
        textDecoration: 'none',
        selectors: {
            ':hover': {
                textDecoration: 'underline',
                color: '#00508A'
            }
        }
    }
})

class Customer extends React.Component {

    _isMounted = false

    constructor(props) {
        super(props)
        this.state = {
            id: this.props.router.query.id,
            customer: '',
            projects: []
        }
        this._columns = [
            { key: 'id', name: 'Action', fieldName: 'id', minWidth: 10, maxWidth: 50, isResizable: false },
            { key: 'designation', name: 'Designation', fieldName: 'designation', minWidth: 100, maxWidth: 100, isResizable: false },
            { key: 'name', name: 'Name', fieldName: 'name', minWidth: 50, isResizable: true },
            { key: 'date_added', name: 'Date added', fieldName: 'date_added', minWidth: 120, maxWidth: 120, isResizable: true },
            { key: 'date_modified', name: 'Last changes', fieldName: 'date_modified', minWidth: 120, maxWidth: 120, isResizable: true }
        ]
    }

    _updateData = () => {
        var self = this
        axios.get(`http://94.101.224.59/php/customer.php?id=${this.state.id}`)
            .then(function (response) {
                self.setState({ customer: response.data })
            })
        axios.get(`http://94.101.224.59/php/projects.php?load=${this.state.id}`)
            .then(function (response) {
                if (response.data !== null) {
                    self.setState({ projects: response.data })
                }
            })
    }

    componentDidMount() {
        var self = this
        self._isMounted = true
        axios.get(`http://94.101.224.59/php/customer.php?id=${this.state.id}`)
            .then(function (response) {
                if (self._isMounted) {
                    self.setState({ customer: response.data })
                }
            })
        axios.get(`http://94.101.224.59/php/projects.php?load=${this.state.id}`)
            .then(function (response) {
                if (self._isMounted) {
                    if (response.data !== null) {
                        self.setState({ projects: response.data })
                    }
                }
            })
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    _onRenderItem = (item) => {
        if (item.onRender) {
            return item.onRender(item)
        }
        if (item.key === 'create') return <CreateProject handler={this._updateData} cid={this.state.id} />
        else return <CommandBarButton {...item} />
    }

    render() {
        const { customer, projects } = this.state
        if (customer) {
            let projectList
            if (projects.length === 0) {
                projectList = (
                    <Stack styles={{ root: { textAlign: 'center', padding: 20 } }}><Text variant='large'>Nothing found</Text></Stack>
                )
            } else {
                projectList = (
                    <DetailsList
                        items={projects}
                        columns={this._columns}
                        setKey="set2"
                        onRenderItemColumn={renderItemColumn}
                        layoutMode={DetailsListLayoutMode.justified}
                        onItemInvoked={(item) => Router.push(`/project/${item.id}`)}
                        selectionPreservedOnEmptyClick={false}
                    />
                )
            }
            return (
                <Layout>
                    <Stack>
                        <Stack tokens={{ padding: '0px 10px' }}>
                            <Text variant='xLarge'>{customer.name}</Text>
                        </Stack>
                        <Stack horizontal tokens={{ childrenGap: 5, padding: 10 }}>
                            <Stack horizontal tokens={{ childrenGap: 10 }} styles={{ root: { width: '50%' } }}>
                                <Stack.Item styles={{ root: { width: '50%' } }}>
                                    <Text variant='large'>Customer data</Text>
                                    <Stack horizontal>
                                        <CommandBar items={[
                                            {
                                                key: 'save',
                                                text: 'Save changes',
                                                iconProps: { iconName: 'Save' },
                                                onClick: () => console.log('save'),
                                            }
                                        ]} styles={{ root: { padding: 0 } }} />
                                    </Stack>
                                    <TextField label="Customer or company name" defaultValue={customer.name} />
                                    <TextField label="Phone number" defaultValue={customer.phone} />
                                    <TextField label="Email address" defaultValue={customer.mail} />
                                </Stack.Item>
                                <Stack.Item align="end" styles={{ root: { width: '50%' } }}>
                                    <TextField label="Status" defaultValue={customer.status} />
                                    <TextField label="Date created" defaultValue={moment.unix(customer.date_added).format("DD.MM.YYYY H:m")} />
                                    <TextField label="Date modified" defaultValue={moment.unix(customer.date_modified).format("DD.MM.YYYY H:m")} />
                                </Stack.Item>
                            </Stack>
                            <Stack.Item styles={{ root: { width: '50%' } }}>
                                <Text variant='large'>Last changes</Text>
                                <Spinner size={SpinnerSize.medium} />
                            </Stack.Item>
                        </Stack>
                        <Stack horizontal tokens={{ childrenGap: 5, padding: '10px 10px 0' }}>
                            <Text variant='large'>Customer projects</Text>
                        </Stack>
                        <Stack horizontal tokens={{ childrenGap: 5, padding: '0 10px' }}>
                            <OverflowSet
                                items={[
                                    {
                                        key: 'create',
                                        text: 'Create project',
                                        iconProps: { iconName: 'FabricNewFolder' }
                                    },
                                    {
                                        key: 'delete',
                                        text: 'Delete project',
                                        iconProps: { iconName: 'Delete' },
                                        disabled: true,
                                        onClick: () => console.log('remove'),
                                    }
                                ]}
                                onRenderItem={this._onRenderItem}
                            />
                        </Stack>
                        {projectList}
                    </Stack>
                </Layout>
            )
        } else {
            return (<Layout><Spinner size={SpinnerSize.large} /></Layout>)
        }
    }

}

function renderItemColumn(item, index, column) {
    const fieldContent = item[column.fieldName]
    switch (column.key) {
        case 'id': {
            let link = '/project/' + fieldContent
            return <a href={link}><FontIcon iconName="TrackersMirrored" className={classes.icon} /></a>
        }
        case 'name': return <span className={mergeStyles({ fontWeight: 'bold' })}>{fieldContent}</span>
        case 'date_added': return <span>{moment.unix(fieldContent).format("DD.MM.YYYY H:m")}</span>
        case 'date_modified': return <span>{moment.unix(fieldContent).format("DD.MM.YYYY H:m")}</span>
        default: return <span>{fieldContent}</span>
    }
}

export default withRouter(Customer)