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
        stocks: async (
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
            const stocks = await models.Stock.find(
                cursorOptions,
                null,
                {
                    sort: { createdAt: -1 },
                    limit: limit + 1,
                },
            );

            const hasNextPage = stocks.length > limit;
            const edges = hasNextPage ? stocks.slice(0, -1) : stocks;

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
        Stock: async (root, { id }) => {
            console.log(id);
            try {
                let ret = await models.Stock.findOne({
                    _id: ObjectId(id),
                });
                console.log(ret);
                return prepare(ret);
            } catch (ex) {
                console.log(ex);
            }
        },
        allStocks: async () => {
            console.log('allStocks');
            try {
                return (await models.Stock.find({})).map(prepare);
            } catch (ex) {
                console.log(ex);
            }
        },
        _allStocksMeta: async () => {
            console.log('_allStocksMeta');
            try {
                const ret = await models.Stock.find({});
                console.log(ret);
                const len = ret.length;
                return { count: len };
            } catch (ex) {
                console.log(ex);
            }
        },
    },

    Mutation: {
        createStock: combineResolvers(
            isAuthenticated,
            async (parent, args, { models, me }) => {
                const stock = await models.Stock.create({
                    ...args,
                    userId: me.id,
                });

                pubsub.publish(EVENTS.STOCK.CREATED, {
                    stockCreated: { stock },
                });

                return stock;
            },
        ),

        removeStock: combineResolvers(
            isAuthenticated,
            async (parent, { id }, { models }) => {
                const stock = await models.Stock.findById(
                    ObjectId(id),
                );

                if (stock) {
                    await stock.remove();
                    return true;
                } else {
                    return false;
                }
            },
        ),

        updateStock: combineResolvers(
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
                const result = await models.Stock.updateOne(
                    filter,
                    updateDoc,
                    options,
                );
                //console.log(result);
                console.log(
                    `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
                );
                const ret = prepare(
                    await models.Stock.findOne({
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
        stockCreated: {
            subscribe: () =>
                pubsub.asyncIterator(EVENTS.STOCK.CREATED),
        },
    },
};
