import React from 'react'
import PropTypes from 'prop-types'
import {
  TextField,
  ActionButton,
  Stack,
  Text,
  PrimaryButton,
  MessageBar,
  MessageBarType
} from '@fluentui/react'

const Form = ({ errorMessage, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <Stack horizontalAlign="center" verticalAlign="center" verticalFill styles={{ root: { width: '300px', margin: '0 auto', textAlign: 'center' } }} tokens={{ childrenGap: 15 }}>
      <img src='/logo.png' alt="Frame House" width="180" />
      {errorMessage && <MessageBar messageBarType={MessageBarType.error}> {errorMessage} </MessageBar>}
      <Stack horizontal tokens={{ childrenGap: 15 }} horizontalAlign="center">
        <TextField iconProps={{ iconName: 'Contact' }} placeholder="Login" name="username" />
      </Stack>
      <Stack horizontal tokens={{ childrenGap: 15 }} horizontalAlign="center">
        <TextField iconProps={{ iconName: 'PasswordField' }} type="password" placeholder="Password" name="password" />
      </Stack>
      <Stack horizontal tokens={{ childrenGap: 15 }} horizontalAlign="center">
        <PrimaryButton text="Sign in" type="submit" />
      </Stack>
      <Stack horizontal tokens={{ childrenGap: 15 }} horizontalAlign="center">
        <ActionButton iconProps={{ iconName: 'Unlock' }}>Forgot password</ActionButton>
      </Stack>
    </Stack>
  </form>
)

export default Form

Form.propTypes = {
  errorMessage: PropTypes.string,
  onSubmit: PropTypes.func,
}