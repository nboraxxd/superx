export const COMMON_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
} as const

export const NAME_MESSAGES = {
  REQUIRED: 'Name is required',
  STRING: 'Name must be a string',
  LENGTH: 'Name length must be from 1 to 100',
} as const

export const USER_MESSAGES = {
  NOT_FOUND: 'User not found',
  NOT_VERIFIED: 'User not verified',
  INVALID: 'User is invalid',
  ID_IS_INVALID: 'User id is invalid',

  GET_ME_SUCCESS: 'Get my profile success',
  UPDATE_ME_SUCCESS: 'Update my profile success',
  GET_USER_PROFILE_SUCCESS: 'Get user profile success',
} as const

export const USERNAME_MESSAGES = {
  INVALID: 'Username must be 4-15 characters long and contain only letters, numbers, underscores and not only numbers',
  EXISTED: 'Username existed',
} as const

export const EMAIL_MESSAGES = {
  ALREADY_EXISTS: 'Email already exists',
  REQUIRED: 'Email is required',
  INVALID: 'Email is invalid',
  NOT_VERIFIED: 'Email not verified',
  ALREADY_VERIFIED_BEFORE: 'Email already verified before',
  VERIFY_SUCCESS: 'Email verify success',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email success',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
} as const

export const PASSWORD_MESSAGES = {
  REQUIRED: 'Password is required',
  STRING: 'Password must be a string',
  LENGTH: 'Password length must be from 6 to 50',
  STRONG:
    'Password must be 6-50 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',

  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_IS_STRING: 'Confirm password must be a string',
  LENGTH_OF_CONFIRM_PASSWORD: 'Confirm password length must be from 6 to 50',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Confirm password must be 6-50 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  CONFIRM_PASSWORD_THE_SAME_AS_PASSWORD: 'Confirm password must be the same as password',

  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Verify forgot password success',
  RESET_PASSWORD_SUCCESS: 'Reset password success',
  OLD_PASSWORD_IS_INCORRECT: 'Old password is incorrect',
  ERROR_OLD_PASSWORD_IS_SAME_AS_NEW: 'The old password should not match the new password',
  CHANGE_PASSWORD_SUCCESS: 'Change password success',
} as const

export const AUTHENTICATION_MESSAGES = {
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  LOGIN_SUCCESS: 'Login success',
  REGISTER_SUCCESS: 'Register success',
  LOGOUT_SUCCESS: 'Logout success',

  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  REFRESH_TOKEN_USED_OR_NOT_EXIST: 'Refresh token has been used or does not exist',
  REFRESH_TOKEN_SUCCESS: 'Refresh token success',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid forgot password token',
} as const

export const DATE_MESSAGES = {
  REQUIRED: 'Date of birth is required',
  ISO8601: 'Date of birth must be ISO8601',
} as const

export const BIO_MESSAGES = {
  STRING: 'Bio must be a string',
  LENGTH: 'Bio length must be from 1 to 200',
} as const

export const LOCATION_MESSAGES = {
  STRING: 'Location must be a string',
  LENGTH: 'Location length must be from 1 to 200',
} as const

export const WEBSITE_MESSAGES = {
  INVALID: 'Website is invalid',
  LENGTH: 'Website length must be from 1 to 100',
} as const

export const TWEETER_CIRCLE = {
  MUST_BE_AN_ARRAY: 'Twitter circle must be an array',
} as const

export const IMAGE_MESSAGES = {
  URL_IS_INVALID: 'Image URL is invalid',
  LENGTH_OF_URL: 'Image URL length must be from 1 to 400',
} as const

export const MEDIA_MESSAGES = {
  UPLOAD_SUCCESS: 'Upload success',
  KEY_IS_NOT_VALID: 'Key is not valid',
  TYPE_IS_NOT_VALID: 'Type is not valid',
  FILE_CANNOT_BE_EMPTY: 'File cannot be empty',
  FILE_NOT_FOUND: 'File not found',
  MEDIA_NOT_FOUND: 'Media not found',
  RANGE_HEADER_IS_REQUIRED: 'Range header is required',
  GET_VIDEO_STATUS_SUCCESS: 'Get video status success',
} as const

export const BOOKMARK_MESSAGES = {
  ID_IS_INVALID: 'Bookmark id is invalid',
  NOT_FOUND: 'Bookmark not found',
  SUCCESS: 'Bookmark tweet success',
  BOOKMARKED: 'Tweet has been bookmarked',
  UNBOOKMARK_SUCCESS: 'Unbookmark tweet success',
  UNBOOKMARKED: 'Tweet has been unbookmarked or has not been bookmarked',
} as const

export const LIKE_MESSAGES = {
  ID_IS_INVALID: 'Like id is invalid',
  NOT_FOUND: 'Like not found',
  SUCCESS: 'Like tweet success',
  LIKED: 'Tweet has been liked',
  UNLIKE_SUCCESS: 'Unlike tweet success',
  UNLIKED: 'Tweet has been unliked or has not been liked',
} as const

export const FOLLOW_MESSAGES = {
  SUCCESS: 'Follow success',
  UNFOLLOW_SUCCESS: 'Unfollow success',
  NOT_FOLLOWING_USER: 'Not following this user',
  FOLLOWED_USER_ID_IS_REQUIRED: 'Followed user id is required',
  FOLLOWED_USER_ID_IS_INVALID: 'Followed user id is invalid',
  FOLLOWED: 'Followed',
} as const

export const TWEET_MESSAGES = {
  ID_IS_REQUIRED: 'Tweet id is required',
  ID_IS_INVALID: 'Tweet id is invalid',
  MUST_BE_A_STRING: 'Tweet must be a string',
  NOT_FOUND: 'Tweet not found',
  NOT_PUBLIC: 'Tweet is not public',
  TYPE_IS_INVALID: 'Tweet type is invalid',
  AUDIENCE_IS_INVALID: 'Tweet audience is invalid',

  PARENT_ID_MUST_BE_A_STRING: 'Parent id must be a string',
  PARENT_ID_MUST_BE_NULL: 'Parent id must be null',
  PARENT_ID_IS_INVALID: 'Parent id is invalid',
  PARENT_TWEET_NOT_FOUND: 'Parent tweet not found',
  PARENT_TWEET_NOT_PUBLIC: 'Parent tweet is not public',
  AUTHOR_PARENT_TWEET_NOT_FOUND: 'Author of parent tweet not found',

  CONTENT_MUST_BE_A_STRING: 'Content must be a string',
  CONTENT_MUST_BE_A_NON_EMPTY_STRING: 'Content must be a non-empty string',
  CONTENT_MUST_BE_EMPTY_STRING: 'Content must be empty string',

  HASHTAGS_MUST_BE_AN_ARRAY: 'Hashtags must be an array',
  HASHTAGS_MUST_BE_A_EMPTY_ARRAY: 'Hashtags must be a empty array',
  HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING: 'Hashtags must be an array of string',

  MENTIONS_MUST_BE_AN_ARRAY: 'Mentions must be an array',
  MENTIONS_MUST_BE_A_EMPTY_ARRAY: 'Mentions must be a empty array',
  MENTIONS_MUST_BE_AN_ARRAY_OF_OBJECT_ID: 'Mentions must be an array of object id',

  MEDIA_MUST_BE_AN_ARRAY: 'Media must be an array',
  MEDIA_MUST_BE_A_EMPTY_ARRAY: 'Media must be a empty array',
  MEDIA_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT: 'Media must be an array of media object',
  MEDIA_URL_IS_INVALID: 'URL must match the regex pattern',

  CREATE_TWEET_SUCCESS: 'Create tweet success',
  GET_TWEET_DETAIL_SUCCESS: 'Get tweet detail success',
  GET_TWEET_CHILDREN_SUCCESS: 'Get tweet children success',
} as const

export const NEWS_FEED_MESSAGES = {
  GET_NEWS_FEED_SUCCESS: 'Get news feed success',
} as const

export const SEARCH_MESSAGES = {
  CONTENT_MUST_BE_A_STRING: 'Content search must be a string',
  MEDIA_TYPE_IS_INVALID: 'Media type is invalid',
  PEOPLE_FOLLOWED_IS_INVALID: 'People followed must be on or off',
  SUCCESS: 'Search success',
} as const

export const PAGINATION_MESSAGES = {
  LIMIT: 'Page limit is only allowed from 1 to 100 tweets',
  PAGE: 'page must be greater than 0',
} as const

export const CONVERSATION_MESSAGES = {
  RECEIVER_ID_IS_INVALID: 'Receiver id is invalid',
  RECEIVER_ID_NOT_FOUND: 'Receiver id not found',
  SUCCESS: 'Get conversations success',
} as const
