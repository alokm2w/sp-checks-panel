const express = require('express');
const bodyparser = require('body-parser');
const fs = require('fs');
var app = express();
const columnArr = require('../../helpers/columnArr');
const helpers = require('../../helpers/CommonHelpers');

module.exports = async (req, res) => {
    // console.log(req.query.fileName);
    today = 'today.csv'
    yesterday = 'yesterday.csv'

    try {
        var todayData = fs.readFileSync(`./public/orderList/${today}`)
            .toString() // convert Buffer to string
            .split('\n') // split string to lines
            .map(e => e.trim()) // remove white spaces for each line
            .map(e => e.split(';').map(e => e.trim())); // split each line to array

        var yesterdayData = fs.readFileSync(`./public/orderList/${yesterday}`)
            .toString() // convert Buffer to string
            .split('\n') // split string to lines
            .map(e => e.trim()) // remove white spaces for each line
            .map(e => e.split(';').map(e => e.trim())); // split each line to array

        changedData = [];
        todayData.map(function (item, index, arr) { //check or compare data
            ordertocheck = yesterdayData.find(innerItem => innerItem[columnArr.ColumnIndex.OrderDetailId] == item[columnArr.ColumnIndex.OrderDetailId]);

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
        // var filtered = changedData.filter(function (el) {
        //     return el != null;
        // });
        var filtered = helpers.removeEmptyValueFromArr(changedData);

        if (filtered.length > 0) {
            req.flash('success', 'Result Found!')
        } else {
            req.flash('error', 'Result Not Found!')
        }

        res.render('order-mixup', {
            reports: filtered,
            name: "Changed Order",
        });
    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)
        // res.send(500,`Something went wrong! ${error}`)
    }



}
