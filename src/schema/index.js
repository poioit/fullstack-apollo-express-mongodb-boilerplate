import { gql } from 'apollo-server-express';

import userSchema from './user';
import messageSchema from './message';
import invoiceSchema from './invoice';
import stockSchema from './stock';
import orderSchema from './order';
import productSchema from './product';
import purchaseSchema from './purchase';
import categorySchema from './category';

const linkSchema = gql`
    scalar Date

    type Query {
        _: Boolean
    }

    type Mutation {
        _: Boolean
    }

    type Subscription {
        _: Boolean
    }
`;

export default [
    linkSchema,
    userSchema,
    messageSchema,
    invoiceSchema,
    stockSchema,
    orderSchema,
    productSchema,
    purchaseSchema,
    categorySchema,
];
