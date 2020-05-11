module.exports = {
    LogicError: class LogicError extends Error {
        constructor(message) {
            super(message)
            this.name = 'logic error'
        }
    }
}