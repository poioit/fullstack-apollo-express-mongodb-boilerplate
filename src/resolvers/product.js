import { combineResolvers } from 'graphql-resolvers';
import models from '../models';
import { prepare } from '../util/index';
import pubsub, { EVENTS } from '../subscription';
import { isAuthenticated, isMessageOwner } from './authorization';
import { ObjectId } from 'mongodb';
import GQLMongoQuery from '@konfy/graphql-mongo-query';

const toCursorHash = (string) =>
    Buffer.from(string).toString('base64');

const fromCursorHash = (string) =>
    Buffer.from(string, 'base64').toString('ascii');

export default {
    Query: {
        products: async (
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
            const products = await models.Product.find(
                cursorOptions,
                null,
                {
                    sort: { createdAt: -1 },
                    limit: limit + 1,
                },
            );

            const hasNextPage = products.length > limit;
            const edges = hasNextPage
                ? products.slice(0, -1)
                : products;

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
        Product: async (root, { id }) => {
            console.log(id);
            try {
                let ret = await models.Product.findOne({
                    _id: ObjectId(id),
                });
                console.log(ret);
                return prepare(ret);
            } catch (ex) {
                console.log(ex);
            }
        },
        allProducts: async (parent, args, context, info) => {
            console.log('allProducts' + JSON.stringify(args.filter));
            const parser = GQLMongoQuery({
                _gt: '$gt',
                _lt: '$lt',
            });
            const MongoFilters = parser(args);
            const category = args.filter.category_id;
            try {
                return (await models.Product.find({})).map(prepare);
            } catch (ex) {
                console.log(ex);
            }
        },
        _allProductsMeta: async (parent, args) => {
            console.log('_allProductsMeta');
            try {
                const ret = await models.Product.find({});
                console.log(ret);
                const len = ret.length;
                return { count: len };
            } catch (ex) {
                console.log(ex);
            }
        },
    },

    Mutation: {
        createProduct: combineResolvers(
            isAuthenticated,
            async (parent, args, { models, me }) => {
                const product = await models.Product.create({
                    ...args,
                    userId: me ? me.id : '',
                });
                product.id = product._id;
                pubsub.publish(EVENTS.STOCK.CREATED, {
                    productCreated: { product },
                });

                return product;
            },
        ),

        removeProduct: combineResolvers(
            isAuthenticated,
            async (parent, { id }, { models }) => {
                const product = await models.Product.findById(
                    ObjectId(id),
                );

                if (product) {
                    await product.remove();
                    return true;
                } else {
                    return false;
                }
            },
        ),

        updateProduct: combineResolvers(
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
                const result = await models.Product.updateOne(
                    filter,
                    updateDoc,
                    options,
                );
                //console.log(result);
                console.log(
                    `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
                );
                const ret = prepare(
                    await models.Product.findOne({
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
        productCreated: {
            subscribe: () =>
                pubsub.asyncIterator(EVENTS.STOCK.CREATED),
        },
    },
};
