const fs = require('fs');
const helpers = require('../../helpers/CommonHelpers');
const columnArr = require('../../helpers/columnArr');
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

                var orderStatus = 4
                var trackingId = 53

                let result = dataArr.filter(item => item[orderStatus] == "Processing" && item[trackingId] != "");
                console.log('Done', helpers.currentDateTime());

                if (result.length > 0) {
                    req.flash('success', 'Result Found!')
                } else {
                    req.flash('error', 'Result Not Found!')
                }

                res.render('check-orders', {
                    reports: result,
                    name: "Tracking Number Added",
                });
            })
            .on("error", function (error) {
                console.log(error.message);
            });

    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)
    }
}
