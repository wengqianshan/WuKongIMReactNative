import { Buffer } from 'buffer';
import BigNumber from 'bignumber.js';
import {
  WKSDK,
  ChannelInfo,
  Channel,
  Conversation,
  Message,
  MessageStatus,
  ChannelTypePerson,
  ChannelTypeGroup,
  ConversationExtra,
  Reminder,
  MessageExtra,
  Setting,
} from 'wukongimjssdk/lib/sdk';

export const toConversation = (item) => {
  const { channel_id, channel_type, unread, timestamp, recents, stick, extra } =
    item;
  const conversation = new Conversation();
  conversation.channel = new Channel(channel_id, channel_type);
  conversation.unread = unread || 0;
  conversation.timestamp = timestamp || 0;

  if (recents && recents.length > 0) {
    const messageModel = toMessage(recents[0]);
    conversation.lastMessage = messageModel;
  }
  conversation.extra = {};
  conversation.extra.top = stick;
  if (extra) {
    conversation.remoteExtra = toConversationExtra(conversation.channel, extra);
  }

  return conversation;
};

export const toReminder = (reminderMap) => {
  const {
    channel_id,
    channel_type,
    message_id,
    message_seq,
    id,
    reminder_type,
    text,
    data,
    is_locate,
    version,
    done,
  } = item;
  const reminder = new Reminder();
  reminder.channel = new Channel(channel_id, channel_type);
  reminder.messageID = message_id;
  reminder.messageSeq = message_seq;
  reminder.reminderID = id;
  reminder.reminderType = reminder_type;
  reminder.text = text;
  reminder.data = data;
  reminder.isLocate = is_locate === 1;
  reminder.version = version;
  reminder.done = done === 1;
  return reminder;
};

export const toConversationExtra = (channel, item) => {
  const { browse_to, keep_message_seq, keep_offset_y, draft, version } = item;
  const conversationExtra = new ConversationExtra();
  conversationExtra.channel = channel;
  conversationExtra.browseTo = browse_to;
  conversationExtra.keepMessageSeq = keep_message_seq;
  conversationExtra.keepOffsetY = keep_offset_y;
  conversationExtra.draft = draft || '';
  conversationExtra.version = version;
  return conversationExtra;
};

export const toMessage = (item) => {
  const {
    message_idstr,
    message_id,
    header,
    setting,
    revoke,
    message_extra,
    client_seq,
    channel_id,
    channel_type,
    message_seq,
    client_msg_no,
    from_uid,
    timestamp,
    payload: $payload,
    is_deleted,
  } = item;
  const payload =
    typeof $payload === 'string'
      ? JSON.parse(Buffer.from($payload, 'base64').toString('utf-8'))
      : $payload;
  const message = new Message();
  if (message_idstr) {
    message.messageID = message_idstr;
  } else {
    message.messageID = new BigNumber(message_id).toString();
  }
  if (header) {
    message.header.reddot = header.red_dot === 1 ? true : false;
  }
  if (setting) {
    message.setting = Setting.fromUint8(setting);
  }
  if (revoke) {
    message.remoteExtra.revoke = revoke === 1 ? true : false;
  }
  if (message_extra) {
    const messageExtra = message_extra;
    message.remoteExtra = toMessageExtra(messageExtra);
  }

  message.clientSeq = client_seq;
  message.channel = new Channel(channel_id, channel_type);
  message.messageSeq = message_seq;
  message.clientMsgNo = client_msg_no;
  message.fromUID = from_uid;
  message.timestamp = timestamp;
  message.status = MessageStatus.Normal;
  const contentObj = payload;
  let contentType = 0;
  if (contentObj) {
    contentType = contentObj.type;
  }
  const messageContent = WKSDK.shared().getMessageContent(contentType);
  if (contentObj) {
    messageContent.decode(stringToUint8Array(JSON.stringify(contentObj)));
  }

  message.content = messageContent;

  message.isDeleted = is_deleted === 1;
  return message;
};

export const toMessageExtra = (item) => {
  const {
    message_id_str,
    message_id,
    message_seq,
    readed,
    readed_at,
    revoke,
    readed_count,
    unread_count,
    extra_version,
    edited_at,
    content_edit,
  } = item;
  const messageExtra = new MessageExtra();
  if (message_id_str) {
    messageExtra.messageID = message_id_str;
  } else {
    messageExtra.messageID = new BigNumber(message_id).toString();
  }
  messageExtra.messageSeq = message_seq;
  messageExtra.readed = readed === 1;
  if (readed_at && readed_at > 0) {
    messageExtra.readedAt = new Date(readed_at);
  }
  messageExtra.revoke = revoke === 1;
  if (revoker) {
    messageExtra.revoker = revoker;
  }
  messageExtra.readedCount = readed_count || 0;
  messageExtra.unreadCount = unread_count || 0;
  messageExtra.extraVersion = extra_version || 0;
  messageExtra.editedAt = edited_at || 0;

  const contentEditObj = content_edit;
  if (contentEditObj) {
    const contentEditContentType = contentEditObj.type;
    const contentEditContent = WKSDK.shared().getMessageContent(
      contentEditContentType
    );
    const contentEditPayloadData = stringToUint8Array(
      JSON.stringify(contentEditObj)
    );
    contentEditContent.decode(contentEditPayloadData);
    messageExtra.contentEditData = contentEditPayloadData;
    messageExtra.contentEdit = contentEditContent;

    messageExtra.isEdit = true;
  }

  return messageExtra;
};

export const userToChannelInfo = (data) => {
  const {
    uid,
    name,
    mute,
    top,
    online,
    last_offline,
    extra,
    remark,
    short_no,
    logo,
    category,
  } = data;
  let channelInfo = new ChannelInfo();
  channelInfo.channel = new Channel(uid, ChannelTypePerson);
  channelInfo.title = name;
  channelInfo.mute = mute === 1;
  channelInfo.top = top === 1;
  channelInfo.online = online === 1;
  channelInfo.lastOffline = last_offline;

  channelInfo.orgData = extra || {};
  channelInfo.orgData = { ...channelInfo.orgData, ...data };
  channelInfo.orgData.remark = remark ?? '';
  channelInfo.orgData.displayName =
    remark && remark !== '' ? remark : channelInfo.title;
  channelInfo.orgData.shortNo = short_no ?? '';

  channelInfo.logo = logo;
  if (!channelInfo.logo || channelInfo.logo === '') {
    channelInfo.logo = `users/${uid}/avatar`;
  }

  if (category === 'system' || category === 'customerService') {
    // 官方账号
    channelInfo.orgData.identityIcon = './identity_icon/official.png';
    channelInfo.orgData.identitySize = { width: '18px', height: '18px' };
  } else if (category === 'visitor') {
    channelInfo.orgData.identityIcon = './identity_icon/visitor.png';
    channelInfo.orgData.identitySize = { width: '48px', height: '24px' };
  }

  return channelInfo;
};

export const groupToChannelInfo = (data) => {
  const {
    group_no,
    name,
    mute,
    top,
    online,
    last_offline,
    extra,
    remark,
    forbidden,
    invite,
    forbidden_add_friend,
    save,
    logo,
  } = data;
  let channelInfo = new ChannelInfo();
  channelInfo.channel = new Channel(group_no, ChannelTypeGroup);
  channelInfo.title = name;
  channelInfo.mute = mute === 1;
  channelInfo.top = top === 1;
  channelInfo.online = online === 1;
  channelInfo.lastOffline = last_offline;

  channelInfo.orgData = extra || {};
  channelInfo.orgData = { ...channelInfo.orgData, ...data };
  channelInfo.orgData.remark = remark ?? '';
  channelInfo.orgData.displayName =
    remark && remark !== '' ? remark : channelInfo.title;
  channelInfo.orgData.forbidden = forbidden;
  channelInfo.orgData.invite = invite;
  channelInfo.orgData.forbiddenAddFriend = forbidden_add_friend;
  channelInfo.orgData.save = save;

  channelInfo.logo = logo;
  if (!channelInfo.logo || channelInfo.logo === '') {
    channelInfo.logo = `groups/${group_no}/avatar`;
  }
  return channelInfo;
};

export const stringToUint8Array = (str) => {
  const newStr = unescape(encodeURIComponent(str));
  var arr = [];
  for (var i = 0, j = newStr.length; i < j; ++i) {
    arr.push(newStr.charCodeAt(i));
  }
  var tmpUint8Array = new Uint8Array(arr);
  return tmpUint8Array;
};
