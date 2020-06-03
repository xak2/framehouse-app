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
    }

    componentDidMount() {
        var self = this
        self._isMounted = true
        axios.get(`http://localhost/framehouse-app/php/project.php?load=${this.state.id}`)
            .then(function (response) {
                console.log(response)
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
        if (item.key === 'import') return <ImportFile pid={this.state.id} />
        else return <CommandBarButton {...item} />
    }

    render() {
        const { project } = this.state
        if (project) {
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
                    </Stack>
                </Layout>
            )
        } else {
            return (<Layout><Spinner size={SpinnerSize.large} /></Layout>)
        }
    }

}

export default withRouter(Project)