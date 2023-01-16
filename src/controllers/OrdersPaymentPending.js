const fs = require('fs');
helpers = require('../../helpers/CommonHelpers');
const columnArr = require('../../helpers/columnArr');

module.exports = async (req, res) => {
    try {
        console.log('start execution', helpers.currentDateTime());
        filename = './ordersTodaycsv/ordersList_today.csv'
        var arr = fs.readFileSync(filename)
            .toString() // convert Buffer to string
            .split('\n') // split string to lines
            .map(e => e.trim()) // remove white spaces for each line
            .map(e => e.split(';').map(e => e.trim())); // split each line to array

        var orderStatus = 4
        var OrderFinancialStatus = 5

        const status_arr = ["Address error", "Cancelled", "Fulfilled", "Hold", "Refund", "Not quoted"];

        let result = arr.filter(item => item[OrderFinancialStatus] != undefined && item[OrderFinancialStatus].toLowerCase() != "paid" && !status_arr.includes(item[orderStatus]));

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

    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)

    }
}
