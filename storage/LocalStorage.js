class LocalStorage{

    constructor() {
        this.storage = new Object()
    }

    create(id, obj=this._clearObject()) {
        this.storage[id] = obj
        return Promise.resolve()
    }

    update(id, obj) {
        return new Promise((resolve, reject) => {
            if(this.storage.hasOwnProperty(id)) {
                for(let nameField in obj) {
                    this.storage[id][nameField] = obj[nameField]
                    resolve()
                }
            } else reject(new Error('Not Found'))
        })
    }

    get(id) {
        return new Promise((resolve, reject) => {
            if(this.storage.hasOwnProperty(id)) {
                console.log(`id: ${id}, object: ${JSON.stringify(this.storage[id])}`)
                resolve(this._deepCopy(this.storage[id]))
            } else reject(new Error('Not Found'))
        })
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            if(this.storage.hasOwnProperty(id)) {
                delete this.storage[id]
                resolve()
            } else reject(new Error('Not Found'))
        })
    }

    _clearObject() { return new Object() }

    _deepCopy(obj) { return JSON.parse(JSON.stringify(obj)) }
}

module.exports = {
    LocalStorage: LocalStorage,
    DialogLocalStorage: class DialogLocalStorage extends LocalStorage {
        _clearObject() {
            return {users: []}
        }
    }
}