import { gql } from 'apollo-server-express';

export default gql`
    extend type Query {
        purchases(cursor: String, limit: Int): PurchaseConnection!
        Purchase(id: String): Purchase
        allPurchases(
            page: Int
            perPage: Int
            sortField: String
            sortOrder: String
        ): [Purchase]
        _allPurchasesMeta(
            page: Int
            perPage: Int
            sortField: String
            sortOrder: String
        ): ListMetadata
    }

    extend type Mutation {
        createPurchase(
            _id: ID
            id: String
            rate: Float
            buyPlace: String
            model: String
            quantities: Int
            unitPrice: Int
            dollar: Int
            nt: Int
            shipmentFee: Int
            shareShipmentFee: Int
            totalCost: Int
            salePrice: Int
            profit: Int
            getMoneyDate: String
            twShipmentFee: Int
            shareProfit: Int
            getShareMoneyDate: String
            status: String
            orderNumber: String
            shipNumber: String
            comment: String
            productId: String
        ): Purchase!
        updatePurchase(
            id: String!
            rate: Float
            buyPlace: String
            model: String
            quantities: Int
            unitPrice: Int
            dollar: Int
            nt: Int
            shipmentFee: Int
            shareShipmentFee: Int
            totalCost: Int
            salePrice: Int
            profit: Int
            getMoneyDate: String
            twShipmentFee: Int
            shareProfit: Int
            getShareMoneyDate: String
            status: String
            orderNumber: String
            shipNumber: String
            comment: String
            productId: String
        ): Purchase!
        removePurchase(id: ID!): Boolean!
    }

    type PurchaseConnection {
        edges: [Purchase!]!
        pageInfo: PageInfo!
    }

    type Purchase {
        id: String
        _id: ID!
        rate: Float
        buyPlace: String
        model: String
        quantities: Int
        unitPrice: Int
        dollar: Int
        nt: Int
        shipmentFee: Int
        shareShipmentFee: Int
        totalCost: Int
        salePrice: Int
        profit: Int
        getMoneyDate: String
        twShipmentFee: Int
        shareProfit: Int
        getShareMoneyDate: String
        status: String
        orderNumber: String
        shipNumber: String
        comment: String
        productId: String
    }

    extend type Subscription {
        purchaseCreated: PurchaseCreated!
    }

    type PurchaseCreated {
        purchase: Purchase!
    }
`;
