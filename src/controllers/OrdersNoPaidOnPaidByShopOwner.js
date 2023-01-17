const express = require('express');
const fs = require('fs');
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
                console.log("start filtering result", helpers.currentDateTime());

                var PaidByShopOwner = 33
                var DateOfPayment = 34

                let result = dataArr.filter(item => item[PaidByShopOwner] != undefined && item[DateOfPayment] != "" && item[PaidByShopOwner].toLowerCase() == "pending");

                console.log('Done', helpers.currentDateTime());

                if (result.length > 0) {
                    req.flash('success', 'Result Found!')
                } else {
                    req.flash('error', 'Result Not Found!')
                }

                res.render('check-orders', {
                    reports: result,
                    name: "No Paid On Paid By Shop Owner",
                });
            })
            .on("error", function (error) {
                console.log(error.message);
            });
    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)
    }
}
