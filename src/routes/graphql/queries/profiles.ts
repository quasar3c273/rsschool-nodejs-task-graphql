import { GraphQLList } from 'graphql';
import { User } from '@prisma/client';
import { IPrismaResolve } from '../types/generalTypes.js';
import { ProfilesGraphQLType } from './queryTypes.js';
import { UUIDType } from '../types/uuid.js';

export default {
  profiles: {
    type: new GraphQLList(ProfilesGraphQLType),
    resolve: async (_obj, _args, { prisma }: IPrismaResolve) =>
      await prisma.profile.findMany(),
  },
  profile: {
    type: ProfilesGraphQLType,
    args: {
      id: { type: UUIDType },
    },
    resolve: async (_obj, { id }: User, { prisma }: IPrismaResolve) =>
      await prisma.profile.findUnique({ where: { id } }),
  },
};
