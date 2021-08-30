import { gql } from 'apollo-server-express';

export default gql`
    input ProductFilter {
        stock_lt: Int
        stock_gt: Int
        stock_lte: Int
        stock_gte: Int
        q: String
        id: ID
        title: String
        category_id: String
        user_id: ID
    }

    input FilterInput {
        filter: ProductFilter
    }

    extend type Query {
        products(cursor: String, limit: Int): ProductConnection!
        Product(id: String): Product
        allProducts(
            page: Int
            perPage: Int
            sortField: String
            sortOrder: String
            filter: ProductFilter
        ): [Product]
        _allProductsMeta(
            page: Int
            perPage: Int
            sortField: String
            sortOrder: String
            filter: ProductFilter
        ): ListMetadata
    }

    extend type Mutation {
        createProduct(
            _id: ID
            id: String
            name: String
            model: String
            categoryID: String
            comment: String
            userId: String
            image: String
            thumbnail: String
        ): Product!
        updateProduct(
            id: String!
            name: String
            model: String
            categoryID: String
            comment: String
            userId: String
            image: String
            thumbnail: String
        ): Product!
        removeProduct(id: ID!): Boolean!
    }

    type ProductConnection {
        edges: [Product!]!
        pageInfo: PageInfo!
    }

    type Product {
        id: String
        _id: ID!
        name: String
        model: String
        categoryID: String
        comment: String
        userId: String
        image: String
        thumbnail: String
        stock: Int
    }

    extend type Subscription {
        productCreated: ProductCreated!
    }

    type ProductCreated {
        product: Product!
    }
`;
