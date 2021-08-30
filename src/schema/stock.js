import { gql } from 'apollo-server-express';

export default gql`
    scalar DateTime
    extend type Query {
        stocks(cursor: String, limit: Int): StockConnection!
        Stock(id: String): Stock
        allStocks(
            page: Int
            perPage: Int
            sortField: String
            sortOrder: String
        ): [Stock]
        _allStocksMeta(
            page: Int
            perPage: Int
            sortField: String
            sortOrder: String
        ): ListMetadata
    }

    extend type Mutation {
        createStock(
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
        ): Stock!
        updateStock(
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
        ): Stock!
        removeStock(id: ID!): Boolean!
    }

    type StockConnection {
        edges: [Stock!]!
        pageInfo: PageInfo!
    }

    type Stock {
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
        stockCreated: StockCreated!
    }

    type StockCreated {
        stock: Stock!
    }
`;
