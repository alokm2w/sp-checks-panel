const fs = require('fs');
helpers = require('../../helpers/CommonHelpers')
const { parse } = require("csv-parse");

module.exports = async (req, res) => {

    try {
        filename = './ordersTodaycsv/ordersList_today.csv'
        // var arr = fs.readFileSync(filename)
        //     .toString() // convert Buffer to string
        //     .split('\n') // split string to lines
        //     .map(e => e.trim()) // remove white spaces for each line
        //     .map(e => e.split(';').map(e => e.trim())); // split each line to array

        console.log('Start Execution', helpers.currentDateTime());

        var dataArr = [];

        fs.createReadStream(filename)
            .pipe(parse({ delimiter: ";" }))
            .on("data", function (row) {
                dataArr.push(row);
            })
            .on("end", function () {
                console.log("start filtering result", helpers.currentDateTime());

                const status_arr = ["Waiting for tracking update", "In transit", "Processing", "Resend"];
                var orderStatus = 4
                var trackingId = 53
                var adminSuplier = 51
                var supplier = 27

                let result = dataArr.filter(item =>
                    status_arr.includes(item[orderStatus]) && item[adminSuplier] == "" ||
                    status_arr.includes(item[orderStatus]) && item[supplier] == "" ||
                    item[orderStatus] == "Fulfilled" && item[trackingId] != "" && item[adminSuplier] == "" ||
                    item[orderStatus] == "Fulfilled" && item[trackingId] != "" && item[supplier] == ""
                );

                console.log('Done', helpers.currentDateTime());

                if (result.length > 0) {
                    req.flash('success', 'Result Found!')
                } else {
                    req.flash('error', 'Result Not Found!')
                }

                res.render('check-orders', {
                    reports: result,
                    name: "No Supplier Added",
                });
            })
            .on("error", function (error) {
                console.log(error.message);
            });

    } catch (error) {
        // self.emit('error', error)
        res.status(500).send(`Something went wrong! ${error}`)

    }



}
