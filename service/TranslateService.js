const https = require('https')

module.exports = {
    TranslateService: class TranslateService {
        constructor(config) {
            this.token = config.token
        }

        translate(text, from, to) {
            return new Promise((resolve, reject) => {
                https.get(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${this.token}&text=${text}&lang=${from}-${to}`, res => {
                    if(res.statusCode == 200) {
                        let buffer = ""
                        res.on('data', chunk => {
                            buffer = buffer + chunk
                        })
    
                        res.on('end', () => {
                            resolve(JSON.parse(buffer))
                        })
                    } else {
                        reject()
                    }
                })
            }).then(res => {
                return res.text[0]
            })
        }

        supportedLanguage() {
            return ['en', 'ru', 'uk']
        }
    },
    TranslateServiceMock: class TranslateServiceMock {
        _supportedLangueage = ['ru', 'en']

        constructor() { }
        translate(text, from, to) {
            if(from != to) {
                return Promise.resolve('?'.repeat(text.length))
            } else return Promise.resolve(text)
        }

        supportedLanguage() {
            return Promise.resolve(this._supportedLangueage)
        }
    }
}
