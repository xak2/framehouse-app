import React from 'react'
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

const DeleteProject = (props, handle) => {


    const _closeDialog = () => { console.log('dialog close') }

    const _handleChange = (event) => { console.log('dialog change') }

    const _handleSubmit = () => {
        console.log(`Deletion submited`)
    }


        return (
            <Dialog
                hidden={props.hidden}
                onDismiss={_closeDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Delete project'
                }}
                modalProps={{
                    isBlocking: false,
                    styles: { main: { maxWidth: 450 } }
                }}
            >
                <Text variant='mediumPlus'>Delete project ?</Text>
                <TextField name="password" type="password" placeholder="Password"
                    onChange={_handleChange} label="Confirm with password" iconProps={{ iconName: 'PasswordField' }} />
                <DialogFooter>
                    <PrimaryButton onClick={_handleSubmit} iconProps={{ iconName: 'Delete' }} text="Remove" />
                    <DefaultButton onClick={_closeDialog} iconProps={{ iconName: 'Cancel' }} text="Cancel" />
                </DialogFooter>
            </Dialog>
        )
 
}

export default DeleteProject