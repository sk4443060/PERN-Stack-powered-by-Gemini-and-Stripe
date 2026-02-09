import { createUsersTable } from "../models/userTable.js";
import { createProductsTable } from "../models/productsTable.js";
import { createProductReviewsTable } from "../models/productReviewsTable.js";
import { createOrdersTable } from "../models/ordersTable.js";
import { createOrderItemTable } from "../models/orderItemsTable.js";
import { createShippingInfoTable } from "../models/shippinginfoTable.js";
import { createPaymentsTable } from "../models/paymentsTable.js";

export const createTables = async () => {
    try {
        await createUsersTable();
        await createProductsTable();
        await createProductReviewsTable();
        await createOrdersTable();
        await createOrderItemTable();
        await createShippingInfoTable();
        await createPaymentsTable();
        console.log("✅ All Tables Created Successfully.");
    } catch (error) {
        console.error("❌ Failed To Create Tables.", error);
        // process.exit(1);
    }
};