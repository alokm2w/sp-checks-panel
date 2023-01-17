const express = require('express');
const bodyparser = require('body-parser');
const fs = require('fs');
var app = express();
helpers = require('../../helpers/CommonHelpers')
const { parse } = require("csv-parse");

module.exports = async (req, res) => {

    try {
        console.log('start execution', helpers.currentDateTime());
        filename = './ordersTodaycsv/ordersList_today.csv'

        var dataArr = [];

        fs.createReadStream(filename)
            .pipe(parse({ delimiter: ";" }))
            .on("data", function (row) {
                dataArr.push(row);
            })
            .on("end", function () {

                var dateOfpayment = 34
                var paidByShopOwner = 33

                let result = dataArr.filter(item => item[dateOfpayment] == "" && item[paidByShopOwner].toLowerCase() == "paid");

                console.log('Done', helpers.currentDateTime());

                if (result.length > 0) {
                    req.flash('success', 'Result Found!')
                } else {
                    req.flash('error', 'Result Not Found!')
                }

                res.render('check-orders', {
                    reports: result,
                    name: "No Date Of Payment",
                });
            })
            .on("error", function (error) {
                console.log(error.message);
            });

    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)
    }
}
