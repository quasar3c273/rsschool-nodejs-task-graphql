import { MemberType, Post, PrismaClient, Profile, User } from '@prisma/client';
import { ISubscribedToUser, IUserSubscribedTo } from '../types/generalTypes.js';

export const batchUsers = (prisma: PrismaClient) => async (keys: readonly string[]) => {
  const keysCopy = [...keys];
  const users: Record<string, User> = {};

  await prisma.user
    .findMany({
      where: { id: { in: keysCopy } },
      include: { userSubscribedTo: true, subscribedToUser: true },
    })
    .then((result) => {
      result.forEach((user) => {
        users[user.id] = user;
      });
    });

  return keysCopy.map((key) => users[key]);
};

export const batchProfiles =
  (prisma: PrismaClient) => async (keys: readonly string[]) => {
    const keysCopy = [...keys];
    const profilesByUserId: Record<string, Profile> = {};

    const profiles = await prisma.profile.findMany({
      where: { userId: { in: keysCopy } },
    });

    profiles.forEach((profile) => {
      profilesByUserId[profile.userId] = profile;
    });

    return keysCopy.map((key) => profilesByUserId[key]);
  };

export const batchPosts = (prisma: PrismaClient) => async (keys: readonly string[]) => {
  const keysCopy = [...keys];
  const posts = await prisma.post.findMany({
    where: { authorId: { in: keysCopy } },
  });

  const postsByAuthorId = posts.reduce(
    (acc, post) => {
      acc[post.authorId] = acc[post.authorId] || [];
      acc[post.authorId].push(post);

      return acc;
    },
    {} as { [authorId: string]: Post[] },
  );

  return keysCopy.map((key) => postsByAuthorId[key]);
};

export const batchMembers = (prisma: PrismaClient) => async (keys: readonly string[]) => {
  const keysCopy = [...keys];
  const membersById: Record<string, MemberType> = {};

  const members = await prisma.memberType.findMany({
    where: { id: { in: keysCopy } },
  });

  members.forEach((memberType) => {
    membersById[memberType.id] = memberType;
  });

  return keysCopy.map((key) => membersById[key]);
};

export const batchUserSubscribedTo =
  (prisma: PrismaClient) => async (keys: readonly string[]) => {
    const keysCopy = [...keys];
    const usersSubscribedTo: Record<string, ISubscribedToUser[]> = {};
    const subscribers = await prisma.user.findMany({
      where: {
        subscribedToUser: {
          some: {
            subscriberId: { in: keysCopy },
          },
        },
      },
      include: { subscribedToUser: true },
    });
    subscribers.forEach((user) => {
      user.subscribedToUser.forEach(({ subscriberId }) => {
        usersSubscribedTo[subscriberId] = usersSubscribedTo[subscriberId] ?? [];
        usersSubscribedTo[subscriberId].push(user);
      });
    });
    return keysCopy.map((id) => usersSubscribedTo[id] ?? []);
  };

export const batchSubscribedToUser =
  (prisma: PrismaClient) => async (keys: readonly string[]) => {
    const keysCopy = [...keys];
    const subscribedToUser: Record<string, IUserSubscribedTo[]> = {};
    const subscribers = await prisma.user.findMany({
      where: {
        userSubscribedTo: {
          some: {
            authorId: { in: keysCopy },
          },
        },
      },
      include: { userSubscribedTo: true },
    });

    subscribers.forEach((user) => {
      user.userSubscribedTo.forEach(({ authorId }) => {
        subscribedToUser[authorId] = subscribedToUser[authorId] ?? [];
        subscribedToUser[authorId].push(user);
      });
    });

    return keysCopy.map((id) => subscribedToUser[id] ?? []);
  };
