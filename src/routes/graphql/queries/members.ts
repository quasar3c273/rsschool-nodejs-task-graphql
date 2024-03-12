import { GraphQLList } from 'graphql';
import { MemberType } from '@prisma/client';
import { IPrismaResolve } from '../types/generalTypes.js';
import { MembersGraphQLType } from './queryTypes.js';
import { MemberTypeEnum } from '../types/enums.js';

export default {
  memberTypes: {
    type: new GraphQLList(MembersGraphQLType),
    resolve: async (_obj, _args, { prisma }: IPrismaResolve) =>
      await prisma.memberType.findMany(),
  },
  memberType: {
    type: MembersGraphQLType,
    args: {
      id: { type: MemberTypeEnum },
    },
    resolve: async (_obj, { id }: MemberType, { prisma }: IPrismaResolve) =>
      await prisma.memberType.findUnique({ where: { id } }),
  },
};
