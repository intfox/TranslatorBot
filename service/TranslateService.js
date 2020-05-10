module.exports = {
    TranslateService: class TranslateService {
        constructor() {}
    },
    TranslateServiceMock: class TranslateServiceMock {
        constructor() { }
        translate(text, from, to) {
            if(from != to) {
                return Promise.resolve('?'.repeat(text.length))
            } else return Promise.resolve(text)
        }
    }
}
