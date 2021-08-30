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
        purchases: async (
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
            const purchases = await models.Purchase.find(
                cursorOptions,
                null,
                {
                    sort: { createdAt: -1 },
                    limit: limit + 1,
                },
            );

            const hasNextPage = purchases.length > limit;
            const edges = hasNextPage
                ? purchases.slice(0, -1)
                : purchases;

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
        Purchase: async (root, { id }) => {
            console.log(id);
            try {
                let ret = await models.Purchase.findOne({
                    _id: ObjectId(id),
                });
                console.log(ret);
                return prepare(ret);
            } catch (ex) {
                console.log(ex);
            }
        },
        allPurchases: async () => {
            console.log('allPurchases');
            try {
                return (await models.Purchase.find({})).map(prepare);
            } catch (ex) {
                console.log(ex);
            }
        },
        _allPurchasesMeta: async () => {
            console.log('_allPurchasesMeta');
            try {
                const ret = await models.Purchase.find({});
                console.log(ret);
                const len = ret.length;
                return { count: len };
            } catch (ex) {
                console.log(ex);
            }
        },
    },

    Mutation: {
        createPurchase: combineResolvers(
            isAuthenticated,
            async (parent, args, { models, me }) => {
                const purchase = await models.Purchase.create({
                    ...args,
                    userId: me.id,
                });

                pubsub.publish(EVENTS.STOCK.CREATED, {
                    purchaseCreated: { purchase },
                });

                return purchase;
            },
        ),

        removePurchase: combineResolvers(
            isAuthenticated,
            async (parent, { id }, { models }) => {
                const purchase = await models.Purchase.findById(
                    ObjectId(id),
                );

                if (purchase) {
                    await purchase.remove();
                    return true;
                } else {
                    return false;
                }
            },
        ),

        updatePurchase: combineResolvers(
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
                const result = await models.Purchase.updateOne(
                    filter,
                    updateDoc,
                    options,
                );
                //console.log(result);
                console.log(
                    `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
                );
                const ret = prepare(
                    await models.Purchase.findOne({
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
        purchaseCreated: {
            subscribe: () =>
                pubsub.asyncIterator(EVENTS.STOCK.CREATED),
        },
    },
};
