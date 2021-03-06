import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
} from 'react-native'
import ResultComponent from 'components/Search/Result'

import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { useTranslation } from 'react-i18next'

const ProfileFollowed = ({
  theme,
  usersGetFollowedUsers,
  usersFollow,
  usersFollowRequest,
  usersUnfollow,
  usersUnfollowRequest,
  handleProfilePress,
}) => {
  const styling = styles(theme)
  const { t } = useTranslation()

  return (
    <View style={styling.root}>
      <ResultComponent
        usersSearch={usersGetFollowedUsers}
        usersFollow={usersFollow}
        usersFollowRequest={usersFollowRequest}
        usersUnfollow={usersUnfollow}
        usersUnfollowRequest={usersUnfollowRequest}
        handleProfilePress={handleProfilePress}
      />
    </View>
  )
}

const styles = theme => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.backgroundPrimary,
  },
})

ProfileFollowed.propTypes = {
  theme: PropTypes.any,
  usersGetFollowedUsers: PropTypes.any,
  usersFollow: PropTypes.any,
  usersFollowRequest: PropTypes.any,
  usersUnfollow: PropTypes.any,
  usersUnfollowRequest: PropTypes.any,
}

export default withTheme(ProfileFollowed)
