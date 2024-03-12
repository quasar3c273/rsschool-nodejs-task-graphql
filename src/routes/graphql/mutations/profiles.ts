import { Prisma, Profile } from '@prisma/client';
import { ICreateResources, IPrismaResolve } from '../types/generalTypes.js';
import { ProfilesGraphQLType } from '../queries/queryTypes.js';
import { CreateProfileInputType, ChangeProfileInputType } from './inputTypes.js';
import { UUIDType } from '../types/uuid.js';

export default {
  createProfile: {
    type: ProfilesGraphQLType,
    args: {
      dto: { type: CreateProfileInputType },
    },
    resolve: async (
      _obj,
      { dto }: ICreateResources<Prisma.ProfileCreateInput>,
      { prisma }: IPrismaResolve,
    ) => await prisma.profile.create({ data: dto }),
  },

  deleteProfile: {
    type: UUIDType,
    args: { id: { type: UUIDType } },
    resolve: async (_obj, { id }: Pick<Profile, 'id'>, { prisma }: IPrismaResolve) => {
      await prisma.profile.delete({ where: { id } });

      return id;
    },
  },

  changeProfile: {
    type: ProfilesGraphQLType,
    args: {
      id: { type: UUIDType },
      dto: { type: ChangeProfileInputType },
    },
    resolve: async (
      _obj,
      { id, dto }: ICreateResources<Prisma.ProfileUpdateInput>,
      { prisma }: IPrismaResolve,
    ) => await prisma.profile.update({ where: { id }, data: dto }),
  },
};
