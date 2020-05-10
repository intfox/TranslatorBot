module.exports = class Config {
    constructor() {
        const secrets = require('../secrets.json')
        this.token = secrets.token
    }
}