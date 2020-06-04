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
    mergeStyleSets
} from '@fluentui/react'
import ImportFile from './import-file'

class Project extends React.Component {

    _isMounted = false

    constructor(props) {
        super(props)
        this.state = {
            id: this.props.router.query.id,
            project: ''
        }
        this._columns = [
            { key: 'id', name: 'Action', fieldName: 'id', minWidth: 50, maxWidth: 50, isResizable: false },
            { key: 'designation', name: 'Designation', fieldName: 'designation', minWidth: 100, maxWidth: 150, isResizable: false },
            { key: 'ano', name: 'Anotation', fieldName: 'ano', minWidth: 100, isResizable: true },
            { key: 'width', name: 'Width', fieldName: 'width', minWidth: 100, maxWidth: 150, isResizable: false },
            { key: 'height', name: 'Height', fieldName: 'height', minWidth: 100, maxWidth: 150, isResizable: false },
            { key: 'length', name: 'Length', fieldName: 'length', minWidth: 100, maxWidth: 150, isResizable: false },
            { key: 'grossa', name: 'Gross area', fieldName: 'grossa', minWidth: 100, maxWidth: 150, isResizable: false },
            { key: 'neta', name: 'Neto area', fieldName: 'neta', minWidth: 100, maxWidth: 150, isResizable: false }
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

    onRenderCell = (nestingDepth, item, itemIndex) => {
        return (
            <DetailsRow
                columns={this._columns}
                groupNestingDepth={nestingDepth}
                item={item}
                itemIndex={itemIndex}
                selection={this.selection}
                selectionMode={SelectionMode.multiple}
            />
        );
    };

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
                    </Stack>
                </Layout>
            )
        } else {
            return (<Layout><Spinner size={SpinnerSize.large} /></Layout>)
        }
    }

}

export default withRouter(Project)