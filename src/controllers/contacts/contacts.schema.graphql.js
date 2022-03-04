const typeDefs = `

type Contact {
  name: String
  owner: String
  phone: String
  idStatus: Int
  idLanguage: Int
  gender: String
  typeCompany: Boolean
  idLocation: Int
  locationName: String
  departmentName: String
  email: String
  note: String
  languageName: String
  statusDescription: String
  lastConversationInDays: String
  publisherName: String
  information: String
  waitingFeedback: Boolean
  createdAtDetailsContacts: Timestamp
  updatedAt: Timestamp
  publisherNameUpdatedBy: String
  idCampaign: Int
  campaignName: String
  campaignDateStart: Date
  campaignDateFinal: Date

}


type PaginationType {
  perPage: Int
  currentPage: Int
  from: Int
  to: Int
  totalRows: Int
  lastPage: Int
}



input Params {
  sort: String
  perPage: Int
  currentPage: Int
  filters: String
  method: String
}



type Query {
  getAll( input: Params): ResponseSuccess
}

type ResponseSuccess {
  status: Boolean
  cod: String
  data: ContactsWithPagination
}

type ContactsWithPagination {
  list: [Contact]
  pagination: PaginationType
}

`

export default typeDefs
