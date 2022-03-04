import { makeExecutableSchema } from 'graphql-tools'
import { typeDefs as scalarTypeDefs } from 'graphql-scalars'
import typeDefsContact from './contacts.schema.graphql.js'

const typeDefs = [...scalarTypeDefs, typeDefsContact]

const schema = makeExecutableSchema({ typeDefs })
export default schema
