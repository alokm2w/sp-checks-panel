const query = {
    getOrdersIds: "SELECT orders_id FROM filter_orderids",

    getAllowedMissingOrders: "SELECT * FROM allowed_missing_order limit 1",

    get_orders_detail: "SELECT  @count := @count + 1 AS 'S.No.',  order_detail.orders_id AS 'Order ID',  order_detail.id AS 'OrderDetail ID',  order_detail.app_order_detail_number AS 'Order Number',  order_detail.order_status AS 'Order Status',  orders.financial_status AS 'Order Financial Status',  store.name  AS 'Store Name', store.id  AS 'Store Id',  product.title AS 'Product Name',  product_variant.title AS 'Product Variant',  order_detail.shopify_order_detail_id AS 'shopify_order_detail_id',  product.admin_graphql_api_id AS 'admin_graphql_api_id',  order_detail.quantity AS 'fulfillable_quantity',  account_details.ioss_number As 'IOSS Number',  product.image_src As 'Product Image Link',  CONCAT(  'https://',  store.myshopify_domain,  '/products/',  product.handle  ) AS 'Link of Product Page',  CONCAT(  order_detail.shopify_product_id,  '-',  order_detail.variant_title  ) AS 'Product Id and Variant Name',  order_detail.gift_card As 'Gift Card',  order_detail.grams As 'Grams/gm',  order_detail.price As 'Price',  order_detail.shopify_product_id As 'Shopify Product ID',  order_detail.quantity As 'Quantity',  order_detail.sku As 'SKU',  order_detail.total_discount As 'Total Discount',  order_detail.shopify_variant_id ,  order_detail.account_details_id ,  order_detail.quotation_id ,  order_detail.supplier_account_details_id,  user.name AS 'supplier name',  order_detail.total_cost_price As 'quote_price',  order_detail.is_amount_deducted ,  order_detail.is_exchange_order ,  order_detail.is_shipped ,  orders_shipping_address.name AS 'Customer Name',  IF(  order_detail.ledger_id > 0,  'Paid',  'Pending'  ) AS 'Paid by shop owner',  DATE_FORMAT(  ledger.created_at,  '%d-%m-%Y %H:%i:%s'  ) AS 'Date of payment',  orders_shipping_address.phone AS 'Customer Phone Number',  orders_shipping_address.email AS 'Customer Email',  orders_shipping_address.address1 AS 'Address1',  orders_shipping_address.address2 AS 'Address2',  orders_shipping_address.city AS 'City',  orders_shipping_address.province AS 'Province',  orders_shipping_address.province_code AS 'Province Code',  orders_shipping_address.country AS 'Country',  orders_shipping_address.country_code AS 'Country Code',  orders_shipping_address.zip AS 'Zip Code',  orders_shipping_address.company AS 'Company',  orders_shipping_address.latitude,  orders_shipping_address.longitude,  IF(  order_detail.intransit_start_date IS NOT NULL,  DATE_FORMAT(      order_detail.intransit_start_date, '%d-%m-%Y'  ),  '-'  ) AS 'Intransit Date',  quotation.max_expected_processing_time As 'Max Processing Time',  quotation.max_expecting_shipping_time As 'Max Delievery Time',  user_b.name AS 'Admin supplier name',  user_c.name AS 'Agent support name',  order_awb_number.number As 'order_tracking_number',  DATE_FORMAT(  order_detail.added_on,  '%d-%m-%Y %H:%i:%s'  ) AS 'Order Created Date',  DATE_FORMAT(  order_detail.processing_start_date,  '%d-%m-%Y %H:%i:%s'  ) AS 'Order Processing Date',  account_details.name AS 'Client Name',  order_detail.order_fee AS 'Fee/Order', order_detail.agent_fee AS 'Agent Fee', order_detail.affiliate_fee AS 'Affiliate Fee' FROM  order_detail  JOIN orders ON orders.id = order_detail.orders_id  LEFT JOIN order_awb_number ON order_awb_number.order_detail_id = order_detail.id AND order_awb_number.is_deleted = 0  LEFT JOIN product ON product.id = order_detail.product_id  LEFT JOIN product_variant ON product_variant.id = order_detail.product_variant_id  LEFT JOIN user ON user.id = order_detail.supplier_user_id  LEFT JOIN user AS user_b  ON  user_b.account_details_id = order_detail.supplier_account_details_id  LEFT JOIN user AS user_c  ON  user_c.id = order_detail.agent_nl_id  LEFT JOIN orders_shipping_address ON orders_shipping_address.orders_id = order_detail.orders_id  JOIN account_details ON account_details.id = order_detail.account_details_id  LEFT JOIN ledger ON ledger.id = order_detail.ledger_id  LEFT JOIN invoices ON invoices.id = ledger.invoice_id  LEFT JOIN quotation ON quotation.id = order_detail.quotation_id  LEFT JOIN store ON store.id = order_detail.store_id  JOIN store_api ON store_api.id = store.store_api_id WHERE  DATE_FORMAT(orders.created_at, '%Y-%m-%d') >= '2022-01-01' AND DATE_FORMAT(orders.created_at, '%Y-%m-%d') <= '2023-12-31' GROUP BY order_detail.id ORDER BY orders.financial_status",
    // AND order_detail.agent_nl_id IN('296')
}

module.exports = { query }