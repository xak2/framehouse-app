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
import axios from 'axios'
import { loadProgressBar } from 'axios-progress-bar'

loadProgressBar()

export default class ImportFile extends React.Component {

    constructor(props) {
        super(props)
        this.state = { hideDialog: true, name: '', designation: '', error: undefined }
    }

    _showDialog = () => { this.setState({ hideDialog: false }) }
    _closeDialog = () => { this.setState({ hideDialog: true, name: '', designation: '', error: undefined }) }
    _handleChange = (event) => {
        const target = event.target
        const fieldValue = target.value
        const fieldName = target.name
        if (fieldName === 'name') this.setState({ name: fieldValue })
        else if (fieldName === 'designation') this.setState({ designation: fieldValue })
    }
    _handleSubmit = () => {
        var self = this
        axios.post(
            'http://localhost/framehouse-app/php/projects.php?action=create',
            { name: this.state.name, designation: this.state.designation, cid: this.props.cid },
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        ).then((response) => {
            console.log(response)
            if (response.data.error) {
                self.setState({ error: response.data.error.join(' ') })
            } else if (response.data.success === true) {
                self.setState({ hideDialog: true, name: '', designation: '', error: undefined })
                this.props.handler()
            }
        })
    }

    render() {
        const { hideDialog, error } = this.state
        const ErrorBar = (
            <Stack horizontal tokens={{ childrenGap: 15 }} horizontalAlign="center">
                <MessageBar messageBarType={MessageBarType.error} isMultiline={true}>
                    {error}
                </MessageBar>
            </Stack>
        )

        return (
            <CommandBarButton iconProps={{ iconName: 'BuildQueueNew' }} text={'Create group'} onClick={this._showDialog} styles={{ root: { height: '44px' } }}>
                <Dialog
                    hidden={hideDialog}
                    onDismiss={this._closeDialog}
                    dialogContentProps={{
                        type: DialogType.normal,
                        title: 'Create group'
                    }}
                >
                    {error ? ErrorBar : ''}
                    <TextField name="name" onChange={this._handleChange} label="Group name" iconProps={{ iconName: 'Rename' }} />
                    <Stack horizontal tokens={{ padding: '10px 0' }}><Text variant='medium' styles={{ root: { fontWeight: 600 } }}>Select single BVN or ASC file for import</Text></Stack>
                    <input type="file" className="form-control" name="upload_file" onChange={this.handleInputChange} style={{ margin: '5px 0', fontSize: '14px', width: 300}} />
                    <DialogFooter>
                        <PrimaryButton onClick={this._handleSubmit} iconProps={{ iconName: 'CloudImportExport' }} text="Import" />
                        <DefaultButton onClick={this._closeDialog} iconProps={{ iconName: 'Cancel' }} text="Cancel" />
                    </DialogFooter>
                </Dialog>
            </CommandBarButton>
        )
    }
}