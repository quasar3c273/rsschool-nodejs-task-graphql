import { MemberType, Post, Prisma, PrismaClient, Profile, User } from '@prisma/client';
import DataLoader from 'dataloader';

export interface IPrismaResolve {
  prisma: PrismaClient;
  loaders?: {
    users: DataLoader<string, User, string>;
    profiles: DataLoader<string, Profile, string>;
    posts: DataLoader<string, Post[], string>;
    members: DataLoader<string, MemberType, string>;
    userSubscribedTo: DataLoader<string, IUserSubscribedTo[], string>;
    subscribedToUser: DataLoader<string, ISubscribedToUser[], string>;
  };
}

export interface ICreateResources<T> {
  id?: string;
  dto: T;
}

export interface ISubscribedToUser extends User {
  subscribedToUser: Prisma.SubscribersOnAuthorsUncheckedCreateInput[];
}

export interface IUserSubscribedTo extends User {
  userSubscribedTo: Prisma.SubscribersOnAuthorsUncheckedCreateInput[];
}
