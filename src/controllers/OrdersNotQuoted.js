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

                var status = 4
                var adminSupplier = 51
                var supplier = 27
                var orderProcessingDate = 55
                var paidByShopOwner = 33

                let result = dataArr.filter(item => item[status] == "Not quoted" && item[adminSupplier] != "" ||
                    item[status] == "Not quoted" && item[supplier] != "" ||
                    item[status] == "Not quoted" && item[orderProcessingDate] != "" ||
                    item[status] == "Not quoted" && item[paidByShopOwner] != ""
                );
                console.log('Done', helpers.currentDateTime());

                if (result.length > 0) {
                    req.flash('success', 'Result Found!')
                } else {
                    req.flash('error', 'Result Not Found!')
                }

                res.render('check-orders', {
                    reports: result,
                    name: "Not Quoted",
                });
            })
            .on("error", function (error) {
                console.log(error.message);
            });
    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)

    }
}
