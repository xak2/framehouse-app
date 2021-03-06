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
    PrimaryButton,
    DefaultButton
} from 'office-ui-fabric-react'
import axios from 'axios'
import { loadProgressBar } from 'axios-progress-bar'

loadProgressBar()

export default class CustomerDetails extends React.Component {

    constructor(props) {
        super(props)
        this.state = { hideDialog: true, name: '', mail: '', error: undefined }
    }

    _showDialog = () => { this.setState({ hideDialog: false }) }
    _closeDialog = () => { this.setState({ hideDialog: true, name: '', mail: '', error: undefined }) }
    _handleChange = (event) => {
        const target = event.target
        const fieldValue = target.value
        const fieldName = target.name
        if (fieldName === 'name') this.setState({ name: fieldValue })
        else if (fieldName === 'mail') this.setState({ mail: fieldValue })
    }
    _handleSubmit = () => {
        var self = this
        axios.post(
            'http://94.101.224.59/php/customers.php?action=add',
            { name: this.state.name, mail: this.state.mail },
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        ).then((response) => {
            if (response.data.error) {
                self.setState({ error: response.data.error.join(' ') })
            } else self.setState({ error: undefined })
            if (response.data.success === true) {
                self.setState({ hideDialog: true, name: '', mail: '' })
                this.props.handler()
            }
        })
    }

    render() {
        const { hideDialog, error } = this.state
        //console.log(this.props.item.id)
        const ErrorBar = (
            <Stack horizontal tokens={{ childrenGap: 15 }} horizontalAlign="center">
                <MessageBar messageBarType={MessageBarType.error} isMultiline={true}>
                    {error}
                </MessageBar>
            </Stack>
        )

        return (
            <Dialog
                hidden={hideDialog}
                onDismiss={this._closeDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Add new customer'
                }}
                modalProps={{
                    isBlocking: false,
                    styles: { main: { maxWidth: 450 } }
                }}
            >
                {error ? ErrorBar : ''}
                <TextField name="name" onChange={this._handleChange} label="Customer or company name" iconProps={{ iconName: 'UserOptional' }} />
                <TextField name="mail" onChange={this._handleChange} label="Customer mail" iconProps={{ iconName: 'Mail' }} />
                <DialogFooter>
                    <PrimaryButton onClick={this._handleSubmit} iconProps={{ iconName: 'Save' }} text="Add" />
                    <DefaultButton onClick={this._closeDialog} text="Cancel" />
                </DialogFooter>
            </Dialog>
        )
    }
}