import { GraphQLFloat, GraphQLObjectType, GraphQLString } from "graphql";
import {GraphQLInt} from "graphql/type/scalars.js";

export const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'User data',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});
