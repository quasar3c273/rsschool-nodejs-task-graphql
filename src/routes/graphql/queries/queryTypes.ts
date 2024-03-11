import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { MemberTypeEnum } from '../types/enums.js';
import { UUIDType } from '../types/uuid.js';
import { IPrismaResolve } from '../types/generalTypes.js';
import { Profile, User } from '@prisma/client';

export const MembersGraphQLType = new GraphQLObjectType({
  name: 'MembersType',
  fields: {
    id: { type: MemberTypeEnum },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  },
});

export const PostsGraphQLType = new GraphQLObjectType({
  name: 'PostsType',
  fields: {
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  },
});

export const ProfilesGraphQLType = new GraphQLObjectType({
  name: 'ProfilesType',
  fields: {
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MembersGraphQLType },
    memberType: {
      type: MembersGraphQLType,
      resolve: async ({ memberTypeId }: Profile, _args, { loaders }: IPrismaResolve) =>
        await loaders?.members.load(memberTypeId),
    },
  },
});

export const UsersGraphQLType: GraphQLObjectType<User, IPrismaResolve> = new GraphQLObjectType({
  name: 'UsersType',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    posts: {
      type: new GraphQLList(PostsGraphQLType),
      resolve: async ({ id }: User, _args, { loaders }: IPrismaResolve) =>
        await loaders?.posts.load(id),
    },
    profile: {
      type: ProfilesGraphQLType,
      resolve: async ({ id }: User, _args, { loaders }: IPrismaResolve) =>
        await loaders?.profiles.load(id),
    },
    subscribedToUser: {
      type: new GraphQLList(UsersGraphQLType),
      resolve: async ({ id }: User, _args, { loaders }: IPrismaResolve) =>
        await loaders?.subscribedToUser.load(id),
    },
    userSubscribedTo: {
      type: new GraphQLList(UsersGraphQLType),
      resolve: async ({ id }: User, _args, { loaders }: IPrismaResolve) =>
        await loaders?.userSubscribedTo.load(id),
    },
  }),
});
