import { GraphQLDateTime } from 'graphql-iso-date';

import userResolvers from './user';
import messageResolvers from './message';
import invoiceResolvers from './invoice';
import stockResolvers from './stock';
import orderResolvers from './order';
import productResolvers from './product';
import purchaseResolvers from './purchase';
import categoryResolvers from './category';

const customScalarResolver = {
    Date: GraphQLDateTime,
};

export default [
    customScalarResolver,
    userResolvers,
    messageResolvers,
    invoiceResolvers,
    stockResolvers,
    orderResolvers,
    productResolvers,
    purchaseResolvers,
    categoryResolvers,
];
