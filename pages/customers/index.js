// [bug] если после обновления списка клиентов использовать фильтр, используются начальные пропы
// [mustd] доделать details

import React, { setState, useState, useEffect } from 'react'
import moment from 'moment'
import {
    DetailsList,
    DetailsListLayoutMode,
    Selection,
    MarqueeSelection,
    mergeStyles,
    mergeStyleSets,
    getTheme,
    OverflowSet,
    SearchBox,
    initializeIcons,
    FontIcon,
    DefaultButton
} from '@fluentui/react'
import useSWR from 'swr'
import fetch from '../../lib/fetchJson'
import Layout from '../../components/Layout'
import AddCustomer from './add'
import RemoveCustomer from './remove'
import Router from 'next/router'

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

/*
function Test() {
    const { data, revalidate } = useSWR('/api/customers', fetch, {
        // revalidate the data per second
        refreshInterval: 1000
    })
    const [value, setValue] = useState('')

    if (!data) return <h1>loading...</h1>

    return (
        <div>
            <h2>Todo List</h2>
            <form onSubmit={async ev => {
                ev.preventDefault()
                setValue('')
                await fetch(`/api/customers?add=${value}`)
                revalidate()
            }}>
                <input placeholder='enter something' value={value} onChange={ev => setValue(ev.target.value)} />
            </form>
            <ul>
                {data.map(item => <li key={item}>{item}</li>)}
            </ul>
            <DefaultButton text="Clear All" onClick={async () => {
                await fetch(`/api/customers?clear=1`)
                revalidate()
            }} />
        </div>
    )
}
*/

class CustomerList extends React.Component {

    constructor(props) {
        super(props)

        this._selection = new Selection({
            onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() })
        })

        this._allItems = this.props.data

        this._columns = [
            {
                key: 'id',
                name: 'Action',
                fieldName: 'id',
                minWidth: 10,
                maxWidth: 50,
                isResizable: false
            },
            { key: 'name', name: 'Name', fieldName: 'name', minWidth: 50, maxWidth: 200, isResizable: true, isSorted: true, isSortedDescending: false, onColumnClick: this.onColumnClick },
            { key: 'mail', name: 'Mail', fieldName: 'mail', minWidth: 50, maxWidth: 200, isResizable: true },
            { key: 'status', name: 'Status', fieldName: 'status', minWidth: 100, maxWidth: 800, isResizable: true, onColumnClick: this.onColumnClick },
            { key: 'date_added', name: 'Date added', fieldName: 'date_added', minWidth: 100, maxWidth: 100, isResizable: true, onColumnClick: this.onColumnClick },
            { key: 'date_modified', name: 'Last changes', fieldName: 'date_modified', minWidth: 100, maxWidth: 100, isResizable: true, onColumnClick: this.onColumnClick }
        ]

        this.state = {
            items: this._allItems,
            selectionDetails: this._getSelectionDetails()
        }

        this._updateCustomerList = this._updateCustomerList.bind(this)

    }

    render() {
        return (
            <Layout>
                <OverflowSet
                    items={[
                        { key: 'search', onRender: () => { return <SearchBox placeholder="Search" onChange={this._onFilter} styles={{ root: { marginBottom: 0, width: 200 } }} /> } },
                        { key: 'add' },
                        { key: 'remove' }
                    ]}
                    onRenderItem={this._onRenderItem}
                />
                <MarqueeSelection selection={this._selection}>
                    <DetailsList
                        items={this.state.items}
                        columns={this._columns}
                        onRenderItemColumn={renderItemColumn}
                        setKey="set"
                        layoutMode={DetailsListLayoutMode.justified}
                        selection={this._selection}
                        enterModalSelectionOnTouch={true}
                        onItemInvoked={this._onItemInvoked}
                        selectionPreservedOnEmptyClick={false}
                    />
                </MarqueeSelection>
            </Layout>
        );
    }

    async _updateCustomerList() {
        const data = await fetch('http://localhost/framehouse-app/php/customers.php?action=load')
        return (
            this.setState({ items: data }),
            this._selection.setAllSelected(false)
        )
    }

    _onRenderItem = (item) => {
        const selectedCustomers = this._selection.getSelection()
        if (item.onRender) {
            return item.onRender(item);
        }
        if (item.key === 'add') return <AddCustomer handler={this._updateCustomerList} />
        else if (item.key === 'remove') return <RemoveCustomer selectedCustomers={selectedCustomers} user={this.props.user} handler={this._updateCustomerList} />
        else return <CommandBarButton iconProps={{ iconName: item.icon }} menuProps={item.subMenuProps} text={item.name} />
    }

    _getSelectionDetails() {
        const selectionCount = this._selection.getSelectedCount()

        switch (selectionCount) {
            case 0:
                return 'No items selected';
            case 1:
                return '1 item selected: ' + (this._selection.getSelection()[0]).name;
            default:
                return `${selectionCount} items selected`;
        }
    }

    _onFilter = (ev, text) => {
        this.setState({
            items: text ? this._allItems.filter(i => i.name.toLowerCase().indexOf(text) > -1) : this._allItems,
        });
    };

    _onItemInvoked = (item) => {
        Router.push(`/customer/${item.id}`)
    };
}

function renderItemColumn(item, index, column) {
    const fieldContent = item[column.fieldName]
    switch (column.key) {
        case 'id': {
            let link = '/customer/' + fieldContent
            return <a href={link}><FontIcon iconName="EntryView" className={classes.icon} /></a>
        }
        case 'name': return <span className={mergeStyles({ fontWeight: 'bold' })}>{fieldContent}</span>
        case 'mail': {
            let mailTo = 'mailto: ' + fieldContent
            return <a href={mailTo} className={classes.link}>{fieldContent}</a>
        }
        case 'date_added': return <span>{moment.unix(fieldContent).format("DD.MM.YYYY H:m")}</span>
        case 'date_modified': return <span>{moment.unix(fieldContent).format("DD.MM.YYYY H:m")}</span>
        default: return <span>{fieldContent}</span>
    }
}

export async function getServerSideProps() {
    const data = await fetch('http://localhost/framehouse-app/php/customers.php?action=load')
    return {
        props: { data }
    }
}

export default CustomerList