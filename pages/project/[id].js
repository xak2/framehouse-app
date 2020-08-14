import React from 'react'
import { withRouter } from 'next/router'
import axios from 'axios'
import Layout from '../../components/Layout'
import {
    Stack,
    Text,
    Spinner,
    SpinnerSize,
    DetailsList,
    OverflowSet,
    CommandBarButton,
    DetailsRow,
    Selection,
    SelectionMode,
    TooltipHost,
    DirectionalHint,
    getTheme,
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
        },
        height: '16px'
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
            { key: 'status', name: 'Status', fieldName: 'status', minWidth: 90, maxWidth: 90, isResizable: false }
        ]
        this._columns_bvn = [
            //{ key: 'id', name: 'Action', fieldName: 'id', minWidth: 50, maxWidth: 50, isResizable: false },
            { key: 'designation', name: 'Designation', fieldName: 'designation', minWidth: 100, maxWidth: 100, isResizable: false },
            { key: 'quantity', name: 'Quantity', fieldName: 'quantity', minWidth: 70, maxWidth: 70, isResizable: false },
            { key: 'width', name: 'Width', fieldName: 'width', minWidth: 50, maxWidth: 50, isResizable: false },
            { key: 'height', name: 'Height', fieldName: 'height', minWidth: 50, maxWidth: 50, isResizable: false },
            { key: 'length', name: 'Length', fieldName: 'length', minWidth: 75, maxWidth: 75, isResizable: false },
            { key: 'comment', name: 'Comment', fieldName: 'comment', isResizable: false },
            { key: 'status', name: 'Status', fieldName: 'status', minWidth: 90, maxWidth: 90, isResizable: false }
        ]
        this.selection = new Selection({})
    }

    _updateData = () => {
        var self = this
        axios.get(`http://app.frame-house.eu/php/project.php?load=${this.state.id}`)
            .then(function (response) {
                if (self._isMounted) {
                    console.log('Reloaded')
                    self.setState({ project: response.data })
                    self._updateData()
                }
            })
    }

    componentDidMount() {
        this._isMounted = true
        this._updateData()
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
                    <b>{item.finished} of {fieldContent}</b>
                )
            }
            case 'width': {
                let width = fieldContent / 10
                return `${width}mm`
            }
            case 'height': {
                let height = fieldContent / 10
                return `${height}mm`
            }
            case 'length': {
                let length = fieldContent / 10
                return `${length}mm`
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
                //console.log(`${item.designation}${item.ano}: ${item.finished} < ${item.quantity}`)
                return (
                    <TooltipHost content={item.finished_by == null ? 'Not finished' : `Finished by ${item.finished_by} at ${item.finished_at}`} directionalHint={DirectionalHint.leftCenter}>
                        <IconButton
                            menuProps={menuProps}
                            iconProps={{ iconName: item.finished < item.quantity ? "Processing" : "CompletedSolid" }}
                            className={classes.icon}
                        />
                    </TooltipHost>
                )
            }
            default:
                return <span>{fieldContent}</span>
        }
    }

    _onRenderRow = props => {
        const customStyles = {}
        if (props) {
            if (props.itemIndex % 2 === 0) {
                customStyles.root = {
                    backgroundColor: theme.palette.themeLighterAlt
                }
            }

            return <DetailsRow {...props} styles={customStyles} />
        }
        return null
    }

    _onRenderGroupHeader = props => {
        if (props) {
            return (
                <div>
                    <div>{`Custom header for ${props.group.name}`} <TooltipHost content="Emoji">
                        <IconButton iconProps={{ iconName: 'Emoji2' }} title="Emoji" />
                    </TooltipHost>
                    </div>
                </div>
            )
        }
        return null
    }

    render() {
        const { project } = this.state
        //console.log(project)
        //console.log('re-render')
        if (project) {
            let packingList
            if (!project.groups) {
                packingList = (
                    <Stack styles={{ root: { textAlign: 'center', padding: 20 } }}><Text variant='large'>Walls not found</Text></Stack>
                )
            } else {
                packingList = (
                    <DetailsList
                        items={project.items}
                        groups={project.groups}
                        columns={this._columns}
                        onRenderItemColumn={this._renderItemColumn}
                        selectionMode={SelectionMode.none}
                        onRenderRow={this._onRenderRow}
                        groupProps={{
                            showEmptyGroups: true,
                        }}
                    />
                )
            }
            let packingListParts
            if (!project.groups_bvn) {
                packingListParts = (
                    <Stack styles={{ root: { textAlign: 'center', padding: 20 } }}><Text variant='large'>Single elements not found</Text></Stack>
                )
            } else {
                packingListParts = (
                    <DetailsList
                        items={project.items}
                        groups={project.groups_bvn}
                        columns={this._columns_bvn}
                        onRenderItemColumn={this._renderItemColumnBvn}
                        selectionMode={SelectionMode.multiple}
                        onRenderRow={this._onRenderRow}
                        groupProps={{
                            showEmptyGroups: true,
                            //onRenderHeader: this._onRenderGroupHeader
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