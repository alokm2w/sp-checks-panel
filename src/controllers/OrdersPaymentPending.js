const fs = require('fs');
helpers = require('../../helpers/CommonHelpers');
const columnArr = require('../../helpers/columnArr');
const { parse } = require("csv-parse");

module.exports = async (req, res) => {
    try {
        console.log('start execution', helpers.currentDateTime());
        filename = './ordersTodaycsv/ordersList_today.csv';

        var dataArr = [];

        fs.createReadStream(filename)
            .pipe(parse({ delimiter: ";" }))
            .on("data", function (row) {
                dataArr.push(row);
            })
            .on("end", function () {
                console.log("start filtering result", helpers.currentDateTime());

                var orderStatus = 4
                var OrderFinancialStatus = 5

                const status_arr = ["Address error", "Cancelled", "Fulfilled", "Hold", "Refund", "Not quoted"];

                let result = dataArr.filter(item => item[OrderFinancialStatus] != undefined && item[OrderFinancialStatus] != 'Order Financial Status' && item[OrderFinancialStatus].toLowerCase() != "paid" && !status_arr.includes(item[orderStatus]));

                console.log('Done', helpers.currentDateTime());

                if (result.length > 0) {
                    req.flash('success', 'Result Found!')
                } else {
                    req.flash('error', 'Result Not Found!')
                }

                res.render('check-orders', {
                    reports: result,
                    name: "Pending Payments",
                });
            })
            .on("error", function (error) {
                console.log(error.message);
            });

    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)

    }
}
