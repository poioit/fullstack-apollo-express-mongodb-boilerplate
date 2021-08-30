import { gql } from 'apollo-server-express';

export default gql`
    extend type Query {
        invoices(cursor: String, limit: Int): InvoiceConnection!
        Invoice(id: String): Invoice
        allInvoices(
            page: Int
            perPage: Int
            sortField: String
            sortOrder: String
        ): [Invoice]
        _allInvoicesMeta(
            page: Int
            perPage: Int
            sortField: String
            sortOrder: String
        ): ListMetadata
    }

    extend type Mutation {
        createInvoice(text: String!): Invoice!
        deleteInvoice(id: ID!): Boolean!
    }

    type InvoiceConnection {
        edges: [Invoice!]!
        pageInfo: PageInfo!
    }

    type Invoice {
        id: String
        text: String!
        createdAt: Date!
        _id: ID!
        invoiceId: String
        question: String
        answer: String
    }

    type ListMetadata {
        count: Int
    }

    extend type Subscription {
        invoiceCreated: InvoiceCreated!
    }

    type InvoiceCreated {
        invoice: Invoice!
    }
`;
