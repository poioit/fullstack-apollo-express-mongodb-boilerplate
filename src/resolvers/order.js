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
        orders: async (
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
            const orders = await models.Order.find(
                cursorOptions,
                null,
                {
                    sort: { createdAt: -1 },
                    limit: limit + 1,
                },
            );

            const hasNextPage = orders.length > limit;
            const edges = hasNextPage ? orders.slice(0, -1) : orders;

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
        Order: async (root, { id }) => {
            console.log(id);
            try {
                let ret = await models.Order.findOne({
                    _id: ObjectId(id),
                });
                console.log(ret);
                return prepare(ret);
            } catch (ex) {
                console.log(ex);
            }
        },
        allOrders: async () => {
            console.log('allOrders');
            try {
                return (await models.Order.find({})).map(prepare);
            } catch (ex) {
                console.log(ex);
            }
        },
        _allOrdersMeta: async () => {
            console.log('_allOrdersMeta');
            try {
                const ret = await models.Order.find({});
                console.log(ret);
                const len = ret.length;
                return { count: len };
            } catch (ex) {
                console.log(ex);
            }
        },
    },

    Mutation: {
        createOrder: combineResolvers(
            isAuthenticated,
            async (parent, args, { models, me }) => {
                const order = await models.Order.create({
                    ...args,
                    userId: me.id,
                });

                pubsub.publish(EVENTS.STOCK.CREATED, {
                    orderCreated: { order },
                });

                return order;
            },
        ),

        removeOrder: combineResolvers(
            isAuthenticated,
            async (parent, { id }, { models }) => {
                const order = await models.Order.findById(
                    ObjectId(id),
                );

                if (order) {
                    await order.remove();
                    return true;
                } else {
                    return false;
                }
            },
        ),

        updateOrder: combineResolvers(
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
                const result = await models.Order.updateOne(
                    filter,
                    updateDoc,
                    options,
                );
                //console.log(result);
                console.log(
                    `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
                );
                const ret = prepare(
                    await models.Order.findOne({
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
        orderCreated: {
            subscribe: () =>
                pubsub.asyncIterator(EVENTS.STOCK.CREATED),
        },
    },
};
