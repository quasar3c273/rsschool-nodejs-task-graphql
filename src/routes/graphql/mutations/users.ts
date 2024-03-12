import { Prisma, SubscribersOnAuthors, User } from '@prisma/client';
import { ICreateResources, IPrismaResolve } from '../types/generalTypes.js';
import { UsersGraphQLType } from '../queries/queryTypes.js';
import { ChangeUserInputType, CreateUserInputType } from './inputTypes.js';
import { UUIDType } from '../types/uuid.js';
import { GraphQLString } from 'graphql';

export default {
  createUser: {
    type: UsersGraphQLType,
    args: {
      dto: { type: CreateUserInputType },
    },
    resolve: async (
      _obj,
      { dto }: ICreateResources<Prisma.UserCreateInput>,
      { prisma }: IPrismaResolve,
    ) => await prisma.user.create({ data: dto }),
  },

  deleteUser: {
    type: UUIDType,
    args: { id: { type: UUIDType } },
    resolve: async (_obj, { id }: Pick<User, 'id'>, { prisma }: IPrismaResolve) => {
      await prisma.user.delete({ where: { id } });

      return id;
    },
  },

  changeUser: {
    type: UsersGraphQLType,
    args: {
      id: { type: UUIDType },
      dto: { type: ChangeUserInputType },
    },
    resolve: async (
      _obj,
      { id, dto }: ICreateResources<Prisma.UserUpdateInput>,
      { prisma }: IPrismaResolve,
    ) => await prisma.user.update({ where: { id }, data: dto }),
  },

  subscribeTo: {
    type: UsersGraphQLType,
    args: {
      userId: { type: UUIDType },
      authorId: { type: UUIDType },
    },
    resolve: async (
      _obj,
      { userId, authorId }: SubscribersOnAuthors & { userId: string },
      { prisma }: IPrismaResolve,
    ) =>
      await prisma.subscribersOnAuthors.create({
        data: { subscriberId: userId, authorId },
      }),
  },

  unsubscribeFrom: {
    type: GraphQLString,
    args: {
      userId: { type: UUIDType },
      authorId: { type: UUIDType },
    },
    resolve: async (
      _obj,
      { userId: subscriberId, authorId }: SubscribersOnAuthors & { userId: string },
      { prisma }: IPrismaResolve,
    ) => {
      await prisma.subscribersOnAuthors.delete({
        where: {
          subscriberId_authorId: {
            subscriberId,
            authorId,
          },
        },
      });

      return subscriberId;
    },
  },
};
