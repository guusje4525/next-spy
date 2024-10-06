const Pushover = require('node-pushover')

export default new Pushover({
    token: process.env.PUSHOVER_TOKEN,
})
