const express = require('express');
const bodyparser = require('body-parser');
const fs = require('fs');
var app = express();
helpers = require('../../helpers/CommonHelpers');
const { parse } = require("csv-parse");

module.exports = async (req, res) => {

    try {
        filename = './ordersTodaycsv/ordersList_today.csv'
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
                var IntransitDate = 48

                let result = dataArr.filter(item => item[orderStatus] != undefined && item[orderStatus].toLowerCase() == "waiting for tracking update" && item[IntransitDate] != "");
                console.log('Done', helpers.currentDateTime())

                if (result.length > 0) {
                    req.flash('success', 'Result Found!')
                } else {
                    req.flash('error', 'Result Not Found!')
                }

                res.render('check-orders', {
                    reports: result,
                    name: "In-Transit Date while status on waiting for tracking update",
                });
            })
            .on("error", function (error) {
                console.log(error.message);
            });



    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)
    }
}
