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

export class DeleteProject extends React.Component {

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
        const { authUser } = this.props
        axios.post(
            'http://94.101.224.59/php/projects.php?action=create',
            { user_id: authUser.id, name: this.state.name, designation: this.state.designation, cid: this.props.cid },
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
        const { hideDialog } = this.state
        const { selected } = this.props
        //console.log(selected[0])

        return (
            <CommandBarButton
                iconProps={{ iconName: 'Delete' }}
                text={'Delete project'}
                onClick={this._showDialog}
                styles={{ root: { height: '44px' } }}
                disabled={selected.length !== 0 ? false : true}
            >
                <Dialog
                    hidden={hideDialog}
                    onDismiss={this._closeDialog}
                    dialogContentProps={{
                        type: DialogType.normal
                    }}
                    modalProps={{
                        isBlocking: false,
                        styles: { main: { minWidth: 450, maxWidth: 450 } }
                    }}
                >
                    <Stack>Are you sure you want to delete project <b>{selected[0] ? selected[0].name : undefined }</b>?</Stack>
                    <DialogFooter>
                        <PrimaryButton onClick={this._handleSubmit} iconProps={{ iconName: 'Delete' }} text="Yes" />
                        <DefaultButton onClick={this._closeDialog} iconProps={{ iconName: 'Cancel' }} text="No" />
                    </DialogFooter>
                </Dialog>
            </CommandBarButton>
        )
    }
}

export default DeleteProject