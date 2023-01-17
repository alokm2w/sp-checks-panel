const express = require('express');
const bodyparser = require('body-parser');
const fs = require('fs');
const csv = require('fast-csv');
const async = require('async');
var app = express();
const columnArr = require('../../helpers/columnArr');
const helpers = require('../../helpers/CommonHelpers');
const { parse } = require("csv-parse");

module.exports = async (req, res) => {
    // console.log(req.query.fileName);
    today = 'today.csv'
    yesterday = 'yesterday.csv'

    try {
        console.log('start execution', helpers.currentDateTime());

        const file1 = `./public/orderList/today.csv`;
        const file2 = `./public/orderList/yesterday.csv`;
        todayArr = []
        yesterdayArr = []
        async.parallel([
            function (callback) {
                fs.createReadStream(file1)
                    .pipe(parse({ delimiter: ";" }))
                    .on("data", function (data) {
                        todayArr.push(data);
                    })
                    .on("end", function () {
                        console.log(`file1 successfully processed`);
                        callback();
                    });
            },
            function (callback) {
                fs.createReadStream(file2)
                    .pipe(parse({ delimiter: ";" }))
                    .on("data", function (data) {
                        yesterdayArr.push(data);
                    })
                    .on("end", function () {
                        console.log(`file2 successfully processed`);
                        callback();
                    });
            }
        ], function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Both files were successfully processed.");

                changedData = [];
                todayArr.map(function (item, index, arr) { //check or compare data
                    ordertocheck = yesterdayArr.find(innerItem => innerItem[columnArr.ColumnIndex.OrderDetailId] == item[columnArr.ColumnIndex.OrderDetailId]);

                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.ShopifyProductId] != item[columnArr.ColumnIndex.ShopifyProductId]) { //Shopify product ID
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Shopify product ID changed," : ordertocheck[60] += "Shopify product ID changed,";
                        changedData[index] = ordertocheck;
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.shopify_variant_id] != item[columnArr.ColumnIndex.shopify_variant_id]) { //Shopify_variant_id
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Shopify variant ID changed," : ordertocheck[60] += "Shopify variant ID changed,";
                        changedData[index] = ordertocheck;
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.Quantity] != item[columnArr.ColumnIndex.Quantity]) { //Quantity
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Quantity changed," : ordertocheck[60] += "Quantity changed,";
                        changedData[index] = ordertocheck;
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.Country] != item[columnArr.ColumnIndex.Country]) { //Country
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Country changed," : ordertocheck[60] += "Country changed,";
                        changedData[index] = ordertocheck;
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.CustomerName] != item[columnArr.ColumnIndex.CustomerName]) { //Customer name
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Customer name changed," : ordertocheck[60] += "Customer name changed,";
                        changedData[index] = ordertocheck;
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.CustomerPhoneNumber] != item[columnArr.ColumnIndex.CustomerPhoneNumber]) { //Customer phone number
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Customer phone number changed," : ordertocheck[60] += "Customer phone number changed,";
                        changedData[index] = ordertocheck;
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.CustomerEmail] != item[columnArr.ColumnIndex.CustomerEmail]) { //Customer Email
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Customer Email changed," : ordertocheck[60] += "Customer Email changed,";
                        changedData[index] = ordertocheck;
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.Address1] != item[columnArr.ColumnIndex.Address1]) { //Address1
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Address1 changed," : ordertocheck[60] += "Address1 changed,";
                        changedData[index] = ordertocheck;
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.Address2] != item[columnArr.ColumnIndex.Address2]) { //Address2
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Address2 changed," : ordertocheck[60] += "Address2 changed,";
                        changedData[index] = ordertocheck;
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.City] != item[columnArr.ColumnIndex.City]) { //City
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "City changed, " : ordertocheck[60] += "City changed,";
                        changedData[index] = ordertocheck;
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.ZipCode] != item[columnArr.ColumnIndex.ZipCode]) { //Zip code
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Zip code changed," : ordertocheck[60] += "Zip code changed,";
                        changedData[index] = ordertocheck;
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.ProductName] != item[columnArr.ColumnIndex.ProductName]) { //Product name
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Product name changed," : ordertocheck[60] += "Product name changed,";
                        changedData[index] = ordertocheck;
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.ProductVariant] != item[columnArr.ColumnIndex.ProductVariant]) { //Product variant
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Product variant changed," : ordertocheck[60] += "Product variant changed,";
                        changedData[index] = ordertocheck;
                    }
                })

                // remove null data
                var filtered = helpers.removeEmptyValueFromArr(changedData);

                if (filtered.length > 0) {
                    req.flash('success', 'Result Found!')
                } else {
                    req.flash('error', 'Result Not Found!')
                }

                console.log('done', helpers.currentDateTime());

                res.render('order-mixup', {
                    reports: filtered,
                    name: "Changed Order",
                });
            }
        });
    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)
    }



}
