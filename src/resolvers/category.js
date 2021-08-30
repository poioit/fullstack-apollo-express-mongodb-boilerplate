import { combineResolvers } from 'graphql-resolvers';
import models from '../models';
import { prepare } from '../util/index';
import pubsub, { EVENTS } from '../subscription';
import { isAuthenticated, isMessageOwner } from './authorization';
import { ObjectId } from 'mongodb';

const toCursorHash = (string) =>
    Buffer.from(string).toString('base64');

const fromCursorHash = (string) =>
    Buffer.from(string, 'base64').toString('ascii');

export default {
    Query: {
        categories: async (
            parent,
            { cursor, limit = 100 },
            { models },
        ) => {
            const cursorOptions = cursor
                ? {
                      createdAt: {
                          $lt: fromCursorHash(cursor),
                      },
                  }
                : {};
            const categories = await models.Category.find(
                cursorOptions,
                null,
                {
                    sort: { createdAt: -1 },
                    limit: limit + 1,
                },
            );

            const hasNextPage = categories.length > limit;
            const edges = hasNextPage
                ? categories.slice(0, -1)
                : categories;

            return {
                edges,
                pageInfo: {
                    hasNextPage,
                    endCursor: toCursorHash(
                        edges[edges.length - 1].createdAt.toString(),
                    ),
                },
            };
        },
        Category: async (root, { id }) => {
            console.log(id);
            try {
                let ret = await models.Category.findOne({
                    _id: ObjectId(id),
                });
                console.log(ret);
                return prepare(ret);
            } catch (ex) {
                console.log(ex);
            }
        },
        allCategories: async () => {
            console.log('allCategories');
            try {
                return (await models.Category.find({})).map(prepare);
            } catch (ex) {
                console.log(ex);
            }
        },
        _allCategoriesMeta: async () => {
            console.log('_allCategoriesMeta');
            try {
                const ret = await models.Category.find({});
                console.log(ret);
                const len = ret.length;
                return { count: len };
            } catch (ex) {
                console.log(ex);
            }
        },
    },

    Mutation: {
        createCategory: combineResolvers(
            isAuthenticated,
            async (parent, args, { models, me }) => {
                const category = await models.Category.create({
                    ...args,
                    userId: me ? me.id : '',
                });

                pubsub.publish(EVENTS.STOCK.CREATED, {
                    categoryCreated: { category },
                });

                return category;
            },
        ),

        removeCategory: combineResolvers(
            isAuthenticated,
            async (parent, { id }, { models }) => {
                const category = await models.Category.findById(
                    ObjectId(id),
                );

                if (category) {
                    await category.remove();
                    return true;
                } else {
                    return false;
                }
            },
        ),

        updateCategory: combineResolvers(
            isAuthenticated,
            async (parent, args, { models, me }) => {
                console.log(args.id);
                // create a filter for a movie to update
                const filter = { _id: ObjectId(args.id) };
                console.log(filter);
                // this option instructs the method to create a document if no documents match the filter
                const options = { upsert: false };
                // create a document that sets the plot of the movie
                const updateDoc = {
                    $set: {
                        ...args,
                    },
                };
                const result = await models.Category.updateOne(
                    filter,
                    updateDoc,
                    options,
                );
                //console.log(result);
                console.log(
                    `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
                );
                const ret = prepare(
                    await models.Category.findOne({
                        _id: ObjectId(args.id),
                    }),
                );
                console.log(ret);
                return ret;

                //return result;
            },
        ),
    },

    Subscription: {
        categoryCreated: {
            subscribe: () =>
                pubsub.asyncIterator(EVENTS.STOCK.CREATED),
        },
    },
};
