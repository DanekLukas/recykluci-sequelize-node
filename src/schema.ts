import * as fs from 'fs';
import { gql } from 'graphql-tag'

export const typeDefs = gql`
scalar Date
scalar Upload

${fs.readFileSync('src/types.gql')}

type Query {
  data(safename: [String], limit: Int): [Data]
  categories: [Category]
  category(categorySafename: [String], limit: Int): [Category]
  find(expr: String, limit: Int): [Data]
  homepage: [Homepage]
  image(dataSafename: [String], limit: Int): [Image]
  delivery: [Delivery]
}

type Mutation {
  addToBasket(id: Int!): Int
}
`