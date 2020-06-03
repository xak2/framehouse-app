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
    DetailsHeader,
    Selection,
    MarqueeSelection
} from '@fluentui/react'
import { Depths } from '@uifabric/fluent-theme'
import moment from 'moment'
import CreateProject from './create-project'

class Customer extends React.Component {

    _isMounted = false

    constructor(props) {
        super(props)
        this.state = {
            id: this.props.router.query.id,
            customer: ''
        }
        this._columns = [
            {
                key: 'id',
                name: 'Action',
                fieldName: 'id',
                minWidth: 10,
                maxWidth: 50,
                isResizable: false
            },
            { key: 'name', name: 'Name', fieldName: 'name', minWidth: 50, maxWidth: 200, isResizable: true },
            { key: 'mail', name: 'Mail', fieldName: 'mail', minWidth: 50, isResizable: true }
        ]
    }

    componentDidMount() {
        var self = this
        self._isMounted = true
        axios.get(`http://localhost/framehouse-app/php/customer.php?id=${this.state.id}`)
            .then(function (response) {
                if (self._isMounted) {
                    self.setState({ customer: response.data })
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    _onRenderItem = (item) => {
        if (item.onRender) {
            return item.onRender(item)
        }
        if (item.key === 'create') return <CreateProject handler={this._updateCustomerList} />
        else return <CommandBarButton iconProps={item.iconProps} text={item.text} onClick={item.onClick} />
    }

    render() {
        const { customer } = this.state
        if (customer) {
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
                                        iconProps: { iconName: 'FabricNewFolder' },
                                        onClick: () => console.log('add'),
                                    },
                                    {
                                        key: 'delete',
                                        text: 'Delete project',
                                        iconProps: { iconName: 'Delete' },
                                        onClick: () => console.log('remove'),
                                    }
                                ]}
                                onRenderItem={this._onRenderItem}
                            />
                        </Stack>
                        <DetailsList
                            items={[]}
                            columns={this._columns}
                            setKey="set2"
                            layoutMode={DetailsListLayoutMode.justified}
                            onItemInvoked={() => console.log('invoked')}
                            selectionPreservedOnEmptyClick={false}
                            styles={{ root: { boxShadow: Depths.depth4 } }}
                        />
                    </Stack>
                </Layout>
            )
        } else {
            return (<Layout><Spinner size={SpinnerSize.large} /></Layout>)
        }
    }

}

export default withRouter(Customer)