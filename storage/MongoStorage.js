const MongoClient =  require("mongodb").MongoClient


class MongoStorage {
    constructor(name) {
        this.client = new MongoClient('mongodb://localhost:27017')
        this.collectionName = name
        this.dbName = 'TranslatorBot'
    }

    _clearObject() {
        return new Object()
    }

    create(id, obj=this._clearObject()) {
        return this.client.connect().then(() => {
            const db = this.client.db(this.dbName)
            return db.collection(this.collectionName).insertOne({_id: id, obj: obj})
        })
    }

    update(id, obj) {
        return this.client.connect().then(() => {
            const db = this.client.db(this.dbName)
            let objectWithDotField = new Object()
            for(let nameField in obj) {
                objectWithDotField[`obj.${nameField}`] = obj[nameField]
            }
            return db.collection(this.collectionName).updateOne({_id: id}, {$set: objectWithDotField})
        }).then(result => {
            if(result.result.n == 0) {
                throw new Error('Not Found')
            }
        })
    }

    get(id) {
        return this.client.connect().then(() => {
            const db = this.client.db(this.dbName)
            return db.collection(this.collectionName).findOne({_id: id})
        }).then(result => {
            if(result) {
                return result.obj
            } else {
                throw new Error('Not Found')
            }
        })
    }

    delete(id) {
        return this.client.connect().then(() => {
            const db = this.client.db(this.dbName)
            return db.collection(this.collectionName).deleteOne({_id: id})
        })
    }
}

module.exports = {
    MongoStorage: MongoStorage,
    DialogMongoStorage: class DialogMongoStorage extends MongoStorage {
        _clearObject() {
            return {users: []}
        }
    }
}