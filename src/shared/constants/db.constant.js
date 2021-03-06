const GET_OK = 'GET_SUCCESSFUL'
const GET_ERROR = 'ERROR_WHILE_GET'
const POST_OK = 'CREATING_SUCCESSFUL'
const POST_ERROR = 'ERROR_WHILE_CREATING'
const PUT_OK = 'UPDATE_SUCCESSFUL'
const PUT_ERROR = 'ERROR_WHILE_UPDATE'
const DEL_OK = 'DELETED_SUCCESSFUL'
const DEL_ERROR = 'ERROR_WHILE_DELETING'
const URL_DROPBOX = 'https://content.dropboxapi.com/2/files/upload'

const fieldsNoTypeText = [
  'createdAt',
  'lastConversationInDays',
  'active',
  'idStatus',
  'dateStart',
  'campaignDateStart',
  'dateFinal',
  'campaignDateFinal',
  'waitingFeedback',
  'typeCompany',
]

export {
  GET_OK,
  GET_ERROR,
  POST_OK,
  POST_ERROR,
  PUT_OK,
  PUT_ERROR,
  DEL_OK,
  DEL_ERROR,
  fieldsNoTypeText,
  URL_DROPBOX,
}
