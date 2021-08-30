import { combineResolvers } from 'graphql-resolvers';
import models from '../models';
import { prepare } from '../util/index';
import pubsub, { EVENTS } from '../subscription';
import { isAuthenticated, isMessageOwner } from './authorization';

const toCursorHash = (string) =>
    Buffer.from(string).toString('base64');

const fromCursorHash = (string) =>
    Buffer.from(string, 'base64').toString('ascii');

export default {
    Query: {
        invoices: async (
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
            const invoices = await models.Invoice.find(
                cursorOptions,
                null,
                {
                    sort: { createdAt: -1 },
                    limit: limit + 1,
                },
            );

            const hasNextPage = invoices.length > limit;
            const edges = hasNextPage
                ? invoices.slice(0, -1)
                : invoices;

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
        Invoice: async (root, { id }) => {
            console.log(id);
            const ret = prepare(
                await models.Invoice.findOne(ObjectId(id)),
            );
            console.log(ret);
            return ret;
        },
        allInvoices: async () => {
            console.log('allInvoices');
            try {
                return (await models.Invoice.find({})).map(prepare);
            } catch (ex) {
                console.log(ex);
            }
        },
        _allInvoicesMeta: async () => {
            console.log('_allInvoicesMeta');
            try {
                const ret = await models.Invoice.find({});
                console.log(ret);
                const len = ret.length;
                return { count: len };
            } catch (ex) {
                console.log(ex);
            }
        },
    },

    Mutation: {
        createInvoice: combineResolvers(
            isAuthenticated,
            async (parent, { text }, { models, me }) => {
                const invoice = await models.Invoice.create({
                    text,
                    userId: me.id,
                });

                pubsub.publish(EVENTS.INVOICE.CREATED, {
                    invoiceCreated: { invoice },
                });

                return invoice;
            },
        ),

        deleteInvoice: combineResolvers(
            isAuthenticated,
            async (parent, { id }, { models }) => {
                const invoice = await models.Invoice.findById(id);

                if (invoice) {
                    await invoice.remove();
                    return true;
                } else {
                    return false;
                }
            },
        ),
    },

    Subscription: {
        invoiceCreated: {
            subscribe: () =>
                pubsub.asyncIterator(EVENTS.INVOCE.CREATED),
        },
    },
};
