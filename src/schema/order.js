import { gql } from 'apollo-server-express';

export default gql`
    extend type Query {
        orders(cursor: String, limit: Int): OrderConnection!
        Order(id: String): Order
        allOrders(
            page: Int
            perPage: Int
            sortField: String
            sortOrder: String
        ): [Order]
        _allOrdersMeta(
            page: Int
            perPage: Int
            sortField: String
            sortOrder: String
        ): ListMetadata
    }

    extend type Mutation {
        createOrder(
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
        ): Order!
        updateOrder(
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
        ): Order!
        removeOrder(id: ID!): Boolean!
    }

    type OrderConnection {
        edges: [Order!]!
        pageInfo: PageInfo!
    }

    type Order {
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
    }

    extend type Subscription {
        orderCreated: OrderCreated!
    }

    type OrderCreated {
        order: Order!
    }
`;
