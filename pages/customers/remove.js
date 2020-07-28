import * as React from 'react'
import {
    Stack,
    MessageBar,
    MessageBarType,
    Dialog,
    DialogType,
    DialogFooter,
    CommandBarButton,
    TextField,
    Text,
    PrimaryButton,
    DefaultButton
} from 'office-ui-fabric-react'
import useUser from '../../lib/useUser'

const axios = require('axios')

const RemoveCustomer = (props) => {
    const { user } = useUser()
    return <RemoveCustomerComponent authUser={user} {...props} />
}


export class RemoveCustomerComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            hideDialog: true,
            password: '',
            error: undefined,
            customer: {
                customerSelected: false,
                customerId: '',
                customerName: ''
            }
        }
    }

    _showDialog = () => {
        this.setState({
            hideDialog: false,
            customer: {
                customerSelected: true,
                customerId: this.props.selectedCustomers[0].id,
                customerName: this.props.selectedCustomers[0].name
            }
        })
    }

    _closeDialog = () => { this.setState({ hideDialog: true }) }

    _handleChange = (event) => { this.setState({ [event.target.name]: event.target.value }) }

    _handleSubmit = () => {
        var self = this
        const { customer } = this.state
        const { authUser } = this.props
        axios.post(
            'http://94.101.224.59/php/customers.php?action=remove',
            { user_id: authUser.id, password: this.state.password, customer: customer },
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        ).then((response) => {
            if (response.data.error) {
                self.setState({ error: response.data.error.join(' ') })
                self.setState({ password: '' })
            } else self.setState({ error: undefined })
            if (response.data.success === true) {
                self.setState({ hideDialog: true, password: '', error: undefined })
                this.props.handler()
            }
        })
    }

    render() {
        const { customer, hideDialog, error } = this.state
        const { selectedCustomers } = this.props
        const ErrorBar = (
            <Stack horizontal tokens={{ childrenGap: 15 }} horizontalAlign="center">
                <MessageBar messageBarType={MessageBarType.error} isMultiline={true}>
                    {error}
                </MessageBar>
            </Stack>
        )

        return (
            <CommandBarButton iconProps={{ iconName: 'UserRemove' }} text='Remove customers' onClick={this._showDialog} disabled={selectedCustomers.length === 0 ? true : false}>
                <Dialog
                    hidden={hideDialog}
                    onDismiss={this._closeDialog}
                    dialogContentProps={{
                        type: DialogType.normal,
                        title: 'Remove customer'
                    }}
                    modalProps={{
                        isBlocking: false,
                        styles: { main: { maxWidth: 450 } }
                    }}
                >
                    {error ? ErrorBar : ''}
                    <Text variant='mediumPlus'>Remove customer {customer.customerName}?</Text>
                    <TextField name="password" type="password" placeholder="Password"
                        onChange={this._handleChange} label="Confirm with password" iconProps={{ iconName: 'PasswordField' }} />
                    <DialogFooter>
                        <PrimaryButton onClick={this._handleSubmit} iconProps={{ iconName: 'Delete' }} text="Remove" />
                        <DefaultButton onClick={this._closeDialog} iconProps={{ iconName: 'Cancel' }} text="Cancel" />
                    </DialogFooter>
                </Dialog>
            </CommandBarButton>
        )
    }
}

export default RemoveCustomer