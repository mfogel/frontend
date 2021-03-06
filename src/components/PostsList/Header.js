import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'
import ActionSheet from 'react-native-actionsheet'
import { Text, Caption } from 'react-native-paper'
import path from 'ramda/src/path'
import Avatar from 'templates/Avatar'
import MoreIcon from 'assets/svg/action/More'
import VerificationIcon from 'assets/svg/action/Verification'
import dayjs from 'dayjs'

import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { useTranslation } from 'react-i18next'

const Header = ({
  theme,
  navigation,
  authUser,
  post,
  postsArchiveRequest,
  postsFlagRequest,
  postsDeleteRequest,
  postsShareRequest,
  postsRestoreArchivedRequest,
  handleProfilePress,
}) => {
  const styling = styles(theme)
  const { t } = useTranslation()
  const actionSheetRef = useRef(null)

  const handleOptionsPress = () => actionSheetRef.current.show()
  const archived = path(['mediaObjects', '0', 'mediaStatus'])(post) === 'ARCHIVED'

  return (
    <View style={styling.header}>
      <TouchableOpacity onPress={handleProfilePress(post.postedBy)}>
        <Avatar
          active
          thumbnailSource={{ uri: path(['postedBy', 'photoUrl64p'])(post) }}
          imageSource={{ uri: path(['postedBy', 'photoUrl64p'])(post) }}
          themeCode={path(['postedBy', 'themeCode'])(post)}
        />
      </TouchableOpacity>

      <View style={styling.headerText}>
        <TouchableOpacity onPress={handleProfilePress(post.postedBy)}>
          <Text style={styling.headerUsername}>{post.postedBy.username}</Text>
        </TouchableOpacity>

        {path(['mediaObjects', '0', 'isVerified'])(post) && post.expiresAt ?
          <View style={styling.verification}>
            <Caption style={styling.headerStatus}>{t('Expires {{expiry}}', { expiry: dayjs(post.expiresAt).from(dayjs()) })}</Caption>
          </View>
        : null}

        {!path(['mediaObjects', '0', 'isVerified'])(post) ?
          <TouchableOpacity onPress={() => navigation.navigate('Verification')} style={styling.verification}>
            <Caption style={styling.verificationStatus}>{t('Failed Verification')} - {t('Learn More')}</Caption>
            <VerificationIcon fill="#DC3644" />
          </TouchableOpacity>
        : null}
      </View>

      {path(['userId'])(authUser) === path(['postedBy', 'userId'])(post) && archived ?
        <React.Fragment>
          <TouchableOpacity style={styling.headerAction} onPress={handleOptionsPress}>
            <MoreIcon fill={theme.colors.primaryIcon} />
          </TouchableOpacity>

          <ActionSheet
            ref={actionSheetRef}
            options={[t('Restore from Archived'), t('Cancel')]}
            cancelButtonIndex={1}
            onPress={(index) => {
              if (index === 0) {
                postsRestoreArchivedRequest({ postId: post.postId })
              }
            }}
          />
        </React.Fragment>
      : null}

      {path(['userId'])(authUser) === path(['postedBy', 'userId'])(post) && !archived ?
        <React.Fragment>
          <TouchableOpacity style={styling.headerAction} onPress={handleOptionsPress}>
            <MoreIcon fill={theme.colors.primaryIcon} />
          </TouchableOpacity>

          <ActionSheet
            ref={actionSheetRef}
            options={[t('Share'), t('Edit'), t('Archive'), t('Other'), t('Delete'), t('Cancel')]}
            cancelButtonIndex={5}
            destructiveButtonIndex={4}
            onPress={(index) => {
              if (index === 0) {
                navigation.navigate('PostShare', { post })
              }
              if (index === 1) {
                navigation.navigate('PostEdit', { post })
              }
              if (index === 2) {
                postsArchiveRequest({ postId: post.postId })
              }
              if (index === 3) {
                postsShareRequest({
                  photoUrl: path(['mediaObjects', '0', 'url'])(post),
                  type: 'global',
                  title: 'Share',
                })
              }
              if (index === 4) {
                postsDeleteRequest({ postId: post.postId })
              }
            }}
          />
        </React.Fragment>
      : null}

      {path(['userId'])(authUser) !== path(['postedBy', 'userId'])(post) ?
        <React.Fragment>
          <TouchableOpacity style={styling.headerAction} onPress={handleOptionsPress}>
            <MoreIcon fill={theme.colors.primaryIcon} />
          </TouchableOpacity>

          <ActionSheet
            ref={actionSheetRef}
            options={[t('Share'), t('Report'), t('Other'), t('Cancel')]}
            cancelButtonIndex={3}
            onPress={(index) => {
              if (index === 0) {
                navigation.navigate('PostShare', { post })
              }
              if (index === 1) {
                postsFlagRequest({ postId: post.postId })
              }
              if (index === 2) {
                postsShareRequest({
                  photoUrl: path(['mediaObjects', '0', 'url'])(post),
                  type: 'global',
                  title: 'Share',
                })
              }
            }}
          />
        </React.Fragment>
      : null}
    </View>
  )
}

const styles = theme => StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.base,
  },
  headerText: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    flex: 1,
  },
  headerAction: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 38,
    width: 38,
  },
  headerUsername: {
  },
  headerStatus: {
    color: '#676767',
    marginRight: 4,
  },
  verificationStatus: {
    color: '#DC3644',
    marginRight: 4,
  },
  verification: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

Header.propTypes = {
  theme: PropTypes.any,
  navigation: PropTypes.any,
  authUser: PropTypes.any,
  post: PropTypes.any,
  handleEditPress: PropTypes.any,
  postsArchiveRequest: PropTypes.any,
  postsFlagRequest: PropTypes.any,
  postsDeleteRequest: PropTypes.any,
}

export default withNavigation(
  withTheme(Header)
)
