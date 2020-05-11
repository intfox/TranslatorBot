module.exports = {
    TranslateService: class TranslateService {
        constructor() {}
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
