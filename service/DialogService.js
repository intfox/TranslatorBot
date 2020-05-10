module.exports = class DialogService{
    constructor(dialogStorage, userStorage) {
        this.dialogStorage = dialogStorage
        this.userStorage = userStorage
    }

    create() {
        const allCharacter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let randomString = ''
        for(let i = 0; i < 8; i++) {
            randomString += allCharacter[Math.floor(Math.random() * allCharacter.length)]
        }
        return this.dialogStorage.create(randomString).then(() => randomString)
    }

    join(user, dialogId) {
        return this.dialogStorage.get(dialogId).then(dialog => {
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

    leave(userId) { } //todo
}