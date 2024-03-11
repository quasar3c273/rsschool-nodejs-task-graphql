import { GraphQLList, GraphQLResolveInfo } from 'graphql';
import { User } from '@prisma/client';
import {
  ResolveTree,
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import {
  IPrismaResolve,
  IUserSubscribedTo,
  ISubscribedToUser,
} from '../types/generalTypes.js';
import { UsersGraphQLType } from './queryTypes.js';
import { UUIDType } from '../types/uuid.js';

export default {
  users: {
    type: new GraphQLList(UsersGraphQLType),
    resolve: async (
      _obj,
      _args,
      { prisma, loaders }: IPrismaResolve,
      resolveInfo: GraphQLResolveInfo,
    ) => {
      const { fields } = simplifyParsedResolveInfoFragmentWithType(
        parseResolveInfo(resolveInfo) as ResolveTree,
        resolveInfo.returnType,
      );

      const hasSubscribedToUser = !!fields['subscribedToUser'];
      const hasUserSubscribedTo = !!fields['userSubscribedTo'];

      const users = await prisma.user.findMany({
        include: {
          subscribedToUser: hasSubscribedToUser,
          userSubscribedTo: hasUserSubscribedTo,
        },
      });

      if (hasSubscribedToUser || hasUserSubscribedTo) {
        const usersStore: Record<string, IUserSubscribedTo | ISubscribedToUser> = {};

        users.forEach((user) => {
          usersStore[user.id] = user;

          if (hasSubscribedToUser) {
            loaders?.subscribedToUser.prime(
              user.id,
              user.subscribedToUser.map(
                ({ subscriberId }) => usersStore[subscriberId] as ISubscribedToUser,
              ),
            );
          }

          if (hasUserSubscribedTo) {
            loaders?.userSubscribedTo.prime(
              user.id,
              user.userSubscribedTo.map(
                ({ authorId }) => usersStore[authorId] as IUserSubscribedTo,
              ),
            );
          }
        });
      }

      return users;
    },
  },
  user: {
    type: UsersGraphQLType,
    args: {
      id: { type: UUIDType },
    },
    resolve: async (_obj, { id }: User, { prisma }: IPrismaResolve) =>
      await prisma.user.findUnique({ where: { id } }),
  },
};
