import { gql } from 'apollo-server-express';

export default gql`
    extend type Query {
        categories(cursor: String, limit: Int): CategoryConnection!
        Category(id: String): Category
        allCategories(
            page: Int
            perPage: Int
            sortField: String
            sortOrder: String
        ): [Category]
        _allCategoriesMeta(
            page: Int
            perPage: Int
            sortField: String
            sortOrder: String
        ): ListMetadata
    }

    extend type Mutation {
        createCategory(
            _id: ID
            id: String
            name: String
            description: String
            photo: String
        ): Category!
        updateCategory(
            id: String!
            name: String
            description: String
            photo: String
        ): Category!
        removeCategory(id: ID!): Boolean!
    }

    type CategoryConnection {
        edges: [Category!]!
        pageInfo: PageInfo!
    }

    type Category {
        id: String
        _id: ID!
        name: String
        description: String
        photo: String
    }

    extend type Subscription {
        categoryCreated: CategoryCreated!
    }

    type CategoryCreated {
        category: Category!
    }
`;
