const fs = require('fs');
helpers = require('../../helpers/CommonHelpers')

module.exports = async (req, res) => {

    try {
        console.log('start execution', helpers.currentDateTime());
        filename = './ordersTodaycsv/ordersList_today.csv'
        var arr = fs.readFileSync(filename)
            .toString() // convert Buffer to string
            .split('\n') // split string to lines
            .map(e => e.trim()) // remove white spaces for each line
            .map(e => e.split(';').map(e => e.trim())); // split each line to array
        var status = 4
        var adminSupplier = 51
        var supplier = 27
        var orderProcessingDate = 55
        var paidByShopOwner = 33

        let result = arr.filter(item => item[status] == "Not quoted" && item[adminSupplier] != "" ||
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
    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)

    }
}
