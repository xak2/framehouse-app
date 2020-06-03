import React from 'react'
import { withRouter } from 'next/router'
import fetch from '../../lib/fetchJson'
import axios from 'axios'
import Layout from '../../components/Layout'
import {
    Stack,
    Text,
    Selection,
    MarqueeSelection,
    Fabric,
    mergeStyles,
    OverflowSet,
    SearchBox,
    initializeIcons,
    FontIcon
} from '@fluentui/react'

class Customer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: this.props.router.query.id,
            data: ''
        }
    }

    componentDidMount() {
        axios.get(`http://localhost/framehouse-app/php/customer.php?id=${this.state.id}`)
            .then(function (response) {
                // handle success
                console.log(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }

    render() {
        return (
            <Layout>
                <Stack>
                    <Text variant='large' nowrap block>
                        Customer id {this._cID}
                    </Text>
                </Stack>
            </Layout>
        )
    }

}

export default withRouter(Customer)