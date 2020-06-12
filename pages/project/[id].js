import React from 'react'
import { withRouter } from 'next/router'
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
    GroupedList,
    DetailsRow,
    Selection,
    SelectionMode,
    FontIcon,
    getTheme,
    mergeStyles,
    mergeStyleSets,
    IconButton
} from '@fluentui/react'
import ImportFile from './import-file'

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
    },
    columnStatus: {
        textAlign: 'right',
        padding: '5px 0 0 0 !important',
        selectors: {
            ':before': {
                padding: '5px 0 0 0 !important'
            },
            ':after': {
                padding: '5px 0 0 0 !important'
            }
        }
    }
})

class Project extends React.Component {

    _isMounted = false

    constructor(props) {
        super(props)
        this.state = {
            id: this.props.router.query.id,
            project: ''
        }
        this._columns = [
            //{ key: 'id', name: 'Action', fieldName: 'id', minWidth: 50, maxWidth: 50, isResizable: false },
            { key: 'designation', name: 'Designation', fieldName: 'designation', minWidth: 100, maxWidth: 100, isResizable: false },
            { key: 'width', name: 'Width', fieldName: 'width', minWidth: 50, maxWidth: 50, isResizable: false },
            { key: 'height', name: 'Height', fieldName: 'height', minWidth: 50, maxWidth: 50, isResizable: false },
            { key: 'length', name: 'Length', fieldName: 'length', minWidth: 50, maxWidth: 50, isResizable: false },
            { key: 'grossa', name: 'Gross area', fieldName: 'grossa', minWidth: 70, maxWidth: 70, isResizable: false },
            { key: 'neta', name: 'Neto area', fieldName: 'neta', minWidth: 70, maxWidth: 70, isResizable: false },
            { key: 'comment', name: 'Comment', fieldName: 'comment', isResizable: false },
            { key: 'status', name: 'Status', fieldName: 'status', minWidth: 45, maxWidth: 45, isResizable: false, className: classes.columnStatus }
        ]
        this._columns_bvn = [
            //{ key: 'id', name: 'Action', fieldName: 'id', minWidth: 50, maxWidth: 50, isResizable: false },
            { key: 'designation', name: 'Designation', fieldName: 'designation', minWidth: 100, maxWidth: 100, isResizable: false },
            { key: 'width', name: 'Width', fieldName: 'width', minWidth: 50, maxWidth: 50, isResizable: false },
            { key: 'height', name: 'Height', fieldName: 'height', minWidth: 50, maxWidth: 50, isResizable: false },
            { key: 'length', name: 'Length', fieldName: 'length', minWidth: 50, maxWidth: 50, isResizable: false },
            { key: 'quantity', name: 'Quantity', fieldName: 'quantity', minWidth: 70, maxWidth: 70, isResizable: false },
            { key: 'comment', name: 'Comment', fieldName: 'comment', isResizable: false },
            { key: 'status', name: 'Status', fieldName: 'status', minWidth: 90, maxWidth: 90, isResizable: false, className: classes.columnStatus }
        ]
        this.selection = new Selection({})
    }

    _updateData = () => {
        var self = this
        axios.get(`http://localhost/framehouse-app/php/project.php?load=${this.state.id}`)
            .then(function (response) {
                self.setState({ project: response.data })
            })
    }

    componentDidMount() {
        var self = this
        self._isMounted = true
        axios.get(`http://localhost/framehouse-app/php/project.php?load=${this.state.id}`)
            .then(function (response) {
                if (self._isMounted) {
                    if (response.data !== null) {
                        self.setState({ project: response.data })
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
        if (item.key === 'import') return <ImportFile handler={this._updateData} pid={this.state.id} />
        else return <CommandBarButton {...item} />
    }

    _renderItemColumn(item, index, column) {
        const fieldContent = item[column.fieldName];

        switch (column.key) {
            case 'designation': {
                return (
                    <b>{item.designation}{item.ano}</b>
                )
            }
            case 'status': {
                const menuProps = {
                    items: [
                        {
                            key: 'completed',
                            text: 'Mark as completed',
                            iconProps: { iconName: 'Completed' }
                        },
                        {
                            key: 'calendarEvent',
                            text: 'Mark as shiped',
                            iconProps: { iconName: 'DeliveryTruck' }
                        }
                    ],
                    directionalHintFixed: false
                }
                return (
                    <IconButton
                        menuProps={menuProps}
                        iconProps={{ iconName: item.status == 'ready' ? "CompletedSolid" : "Processing" }}
                        className={classes.icon}
                    />
                )
            }
            default:
                return <span>{fieldContent}</span>
        }
    }

    _renderItemColumnBvn(item, index, column) {
        const fieldContent = item[column.fieldName];

        switch (column.key) {
            case 'designation': {
                return (
                    <b>{item.designation}{item.ano}</b>
                )
            }
            case 'quantity': {
                return (
                    <>{item.finished} of {fieldContent}</>
                )
            }
            case 'width': {
                let width = fieldContent / 10
                return width
            }
            case 'height': {
                let height = fieldContent / 10
                return height
            }
            case 'length': {
                let length = fieldContent / 10
                return length
            }
            case 'status': {
                const menuProps = {
                    items: [
                        {
                            key: 'completed',
                            text: 'Mark as completed',
                            iconProps: { iconName: 'Completed' }
                        },
                        {
                            key: 'calendarEvent',
                            text: 'Mark as shiped',
                            iconProps: { iconName: 'DeliveryTruck' }
                        }
                    ],
                    directionalHintFixed: false
                }
                console.log(`${item.finished} >= ${item.quantity}`)
                return (
                    <>
                        <IconButton
                            iconProps={{ iconName: "Info" }}
                            className={classes.icon}
                        />
                        <IconButton
                            menuProps={menuProps}
                            iconProps={{ iconName: item.quantity > item.finished ? "Processing" : "CompletedSolid" }}
                            className={classes.icon}
                        />
                    </>
                )
            }
            default:
                return <span>{fieldContent}</span>
        }
    }

    render() {
        console.log(this.state)
        const { project } = this.state
        if (project) {
            let packingList
            if (!project.groups) {
                packingList = (
                    <Stack styles={{ root: { textAlign: 'center', padding: 20 } }}><Text variant='large'>Nothing found</Text></Stack>
                )
            } else {
                packingList = (
                    <DetailsList
                        items={project.items}
                        groups={project.groups}
                        columns={this._columns}
                        onRenderItemColumn={this._renderItemColumn}
                        groupProps={{
                            showEmptyGroups: true,
                        }}
                    />
                )
            }
            let packingListParts
            if (!project.groups_bvn) {
                packingListParts = (
                    <Stack styles={{ root: { textAlign: 'center', padding: 20 } }}><Text variant='large'>Nothing found</Text></Stack>
                )
            } else {
                packingListParts = (
                    <DetailsList
                        items={project.items}
                        groups={project.groups_bvn}
                        columns={this._columns_bvn}
                        onRenderItemColumn={this._renderItemColumnBvn}
                        groupProps={{
                            showEmptyGroups: true,
                        }}
                    />
                )
            }
            return (
                <Layout>
                    <Stack>
                        <Stack tokens={{ padding: '0px 10px' }}>
                            <Text variant='xLarge'>{project.name}</Text>
                        </Stack>
                        <Stack horizontal tokens={{ childrenGap: 5, padding: '0 10px' }}>
                            <OverflowSet
                                items={[
                                    {
                                        key: 'import'
                                    },
                                    {
                                        key: 'delete',
                                        text: 'Delete group',
                                        iconProps: { iconName: 'Delete' },
                                        disabled: true,
                                        onClick: () => console.log('remove'),
                                    }
                                ]}
                                onRenderItem={this._onRenderItem}
                            />
                        </Stack>
                        {packingList}
                        {packingListParts}
                    </Stack>
                </Layout>
            )
        } else {
            return (<Layout><Spinner size={SpinnerSize.large} /></Layout>)
        }
    }

}

export default withRouter(Project)