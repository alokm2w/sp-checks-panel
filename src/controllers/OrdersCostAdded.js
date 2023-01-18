const express = require('express');
const fs = require('fs');
helpers = require('../../helpers/CommonHelpers');
const { parse } = require("csv-parse");

module.exports = async (req, res) => {
    // console.log(req.query.fileName);

    try {
        filename = 'ordersTodaycsv/ordersList_today.csv'
        console.log('start execution', helpers.currentDateTime());

        var dataArr = [];

        fs.createReadStream(filename)
            .pipe(parse({ delimiter: ";" }))
            .on("data", function (row) {
                dataArr.push(row);
            })
            .on("end", function () {
                console.log("start filtering result", helpers.currentDateTime());

                var orderStatus = 4
                var quote_price = 28

                const status_arr = ["Waiting for tracking update", "In transit", "Processing", "Fulfilled"];

                let result = dataArr.filter(item => !status_arr.includes(item[orderStatus]) && item[quote_price] != 0);

                console.log('done', helpers.currentDateTime());

                if (result.length > 0) {
                    req.flash('success', 'Result Found!')
                } else {
                    req.flash('error', 'Result Not Found!')
                }

                res.render('check-orders', {
                    reports: result,
                    name: "Cost Added",
                });
            })
            .on("error", function (error) {
                console.log(error.message);
            });
    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)
    }
}
