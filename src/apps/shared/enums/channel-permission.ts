enum ChannelPermission {
  CAN_POST_MESSAGE = 'can_post_messages',
  CAN_EDIT_MESSAGE = 'can_edit_messages',
  CAN_DELETE_MESSAGE = 'can_delete_messages',
}

export const CHANNEL_EDITOR_PERMISSION = [
  ChannelPermission.CAN_POST_MESSAGE,
  ChannelPermission.CAN_EDIT_MESSAGE,
  ChannelPermission.CAN_DELETE_MESSAGE,
]

export default ChannelPermission
