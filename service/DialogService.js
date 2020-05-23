const { LogicError } = require('../model/error')

module.exports = class DialogService{
    constructor(dialogStorage, userStorage) {
        this.dialogStorage = dialogStorage
        this.userStorage = userStorage
    }

    create(user) {
        const allCharacter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let randomString = ''
        for(let i = 0; i < 8; i++) {
            randomString += allCharacter[Math.floor(Math.random() * allCharacter.length)]
        }
        return this.userStorage.get(user.id)
        .then(
            () => Promise.reject(new LogicError('You are already in dialogue')), 
            () => this.dialogStorage.create(randomString))
        .then(() => this.join(user, randomString))
        .then(() => randomString)
    }

    join(user, dialogId) {
        return this.userStorage.get(user.id)
        .then(
            () => Promise.reject(new LogicError('You are already in dialogue')), 
            () => this.dialogStorage.get(dialogId))
        .then(dialog => {
            const otherUsers = dialog.users.slice()
            dialog.users.push(user)
            return this.dialogStorage.update(dialogId, { users: dialog.users } ).then(() => {
                return this.userStorage.create(user.id, dialogId)
            }).then(() => otherUsers)
        })
    }

    getDialogFromUserId(userId) {
        return this.userStorage.get(userId).then(dialogId => {
            return this.dialogStorage.get(dialogId)
        })
    }

    leave(userId) { 
        return this.userStorage.get(userId).then(dialogId => {
            return this.dialogStorage.get(dialogId)
                .then(dialog => {
                    const otherUsers = dialog.users.filter(user => user.id != userId)
                    if(otherUsers.length == 0) return this.dialogStorage.delete(dialogId)
                    else return this.dialogStorage.update(dialogId, { users: otherUsers })
                })
        }).then(() => this.userStorage.delete(userId))
    }
}