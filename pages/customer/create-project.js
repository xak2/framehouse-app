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
import useUser from '../../lib/useUser'

loadProgressBar()

const CreateProject = (props) => {
    const { user } = useUser()
    return <CreateProjectComponent authUser={user} {...props} />
}

export class CreateProjectComponent extends React.Component {

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
        const { hideDialog, error } = this.state
        const ErrorBar = (
            <Stack horizontal tokens={{ childrenGap: 15 }} horizontalAlign="center">
                <MessageBar messageBarType={MessageBarType.error} isMultiline={true}>
                    {error}
                </MessageBar>
            </Stack>
        )

        return (
            <CommandBarButton iconProps={{ iconName: 'FabricNewFolder' }} text={'Create project'} onClick={this._showDialog} styles={{ root: { height: '44px' } }}>
                <Dialog
                    hidden={hideDialog}
                    onDismiss={this._closeDialog}
                    dialogContentProps={{
                        type: DialogType.normal,
                        title: 'Create new project'
                    }}
                    modalProps={{
                        isBlocking: false,
                        styles: { main: { maxWidth: 450 } }
                    }}
                >
                    {error ? ErrorBar : ''}
                    <TextField name="name" onChange={this._handleChange} label="Project name" iconProps={{ iconName: 'UserOptional' }} />
                    <TextField name="designation" onChange={this._handleChange} label="Designation" iconProps={{ iconName: 'Mail' }} />
                    <DialogFooter>
                        <PrimaryButton onClick={this._handleSubmit} iconProps={{ iconName: 'Save' }} text="Add" />
                        <DefaultButton onClick={this._closeDialog} iconProps={{ iconName: 'Cancel' }} text="Cancel" />
                    </DialogFooter>
                </Dialog>
            </CommandBarButton>
        )
    }
}

export default CreateProject