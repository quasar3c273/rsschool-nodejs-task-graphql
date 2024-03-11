import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createGqlResponseSchema, gqlResponseSchema, graphQLSchema } from './schemas.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    handler: ({ body: { query, variables } }) => {
      const validationErrors = validate(graphQLSchema, parse(query), [depthLimit(5)]);

      if (validationErrors.length) {
        console.error('Query errors log:');
        validationErrors.forEach(({ message }) => {
          console.error(message);
        });

        return { errors: validationErrors };
      }

      return graphql({
        schema: graphQLSchema,
        source: query,
        contextValue: {
          prisma,
          loaders: {},
        },
        variableValues: variables,
      })
        .then((result) => result)
        .catch((error) => {
          console.error('GraphQL query is invalid:');
          console.error(error);
        });
    },
  });
};

export default plugin;
