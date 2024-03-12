import { GraphQLList } from 'graphql';
import { User } from '@prisma/client';
import { IPrismaResolve } from '../types/generalTypes.js';
import { PostsGraphQLType } from './queryTypes.js';
import { UUIDType } from '../types/uuid.js';

export default {
  posts: {
    type: new GraphQLList(PostsGraphQLType),
    resolve: async (_obj, _args, { prisma }: IPrismaResolve) =>
      await prisma.post.findMany(),
  },
  post: {
    type: PostsGraphQLType,
    args: {
      id: { type: UUIDType },
    },
    resolve: async (_obj, { id }: User, { prisma }: IPrismaResolve) =>
      await prisma.post.findUnique({ where: { id } }),
  },
};
