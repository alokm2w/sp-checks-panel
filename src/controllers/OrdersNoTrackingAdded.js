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
        const status_arr = ["Waiting for tracking update", "In transit"];
        orderStatus = 4
        trackingId = 53

        let result = arr.filter(item => status_arr.includes(item[orderStatus]) && item[trackingId] == "");

        console.log('Done', helpers.currentDateTime());

        if (result.length > 0) {
            req.flash('success', 'Result Found!')
        } else {
            req.flash('error', 'Result Not Found!')
        }
        
        res.render('check-orders', {
            reports: result,
            name: "No Tracking Number Added",
        });
    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)
    }

}
