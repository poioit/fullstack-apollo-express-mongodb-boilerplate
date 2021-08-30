import { PubSub } from 'apollo-server';

import * as MESSAGE_EVENTS from './message';
import * as INVOICE_EVENTS from './invoice';
import * as STOCK_EVENTS from './stock';
import * as ORDER_EVENTS from './order';
import * as PRODUCT_EVENTS from './product';
import * as PURCHASE_EVENTS from './purchase';
import * as CATEGORY_EVENTS from './category';

export const EVENTS = {
    MESSAGE: MESSAGE_EVENTS,
    INVOICE: INVOICE_EVENTS,
    STOCK: STOCK_EVENTS,
    PRODUCT: PRODUCT_EVENTS,
    ORDER: ORDER_EVENTS,
    PURCHASE: PURCHASE_EVENTS,
    CATEGORY: CATEGORY_EVENTS,
};

export default new PubSub();
