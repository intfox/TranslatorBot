module.exports = class Config {
    constructor() {
        const secrets = require('../secrets.json')
        this.telegram = secrets.telegram
        this.yandex_translate = secrets.yandex_translate
    }
}