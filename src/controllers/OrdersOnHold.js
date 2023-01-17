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

                let result = dataArr.filter(item => item[columnArr.ColumnIndex.OrderStatus] == "Hold" && item[columnArr.ColumnIndex.AdminSupplierName] != "" ||
                    item[columnArr.ColumnIndex.OrderStatus] == "Hold" && item[columnArr.ColumnIndex.supplierName] != ""
                );
                console.log('Done', helpers.currentDateTime());

                if (result.length > 0) {
                    req.flash('success', 'Result Found!')
                } else {
                    req.flash('error', 'Result Not Found!')
                }

                res.render('check-orders', {
                    reports: result,
                    name: "Orders On Hold",
                });
            })
            .on("error", function (error) {
                console.log(error.message);
            });
    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)

    }
}
