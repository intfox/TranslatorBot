const TelegramBot = require('node-telegram-bot-api')

module.exports = class Telegram {
    constructor(config, dialogsService, translateService, userSettingService) {
        this.config = config
        this.dialogsService = dialogsService
        this.bot = new TelegramBot(config.token, {polling: true});
        this.translateService = translateService
        this.userSettingService = userSettingService

        this.bot.onText(/^\/create$/, (msg) => {
            const chatId = msg.chat.id
            dialogsService.create().then(dialogId => 
                dialogsService.join({id: chatId, username: msg.from.username}, dialogId).then(() => {
                    this.bot.sendMessage(chatId, `bot: that dialog id:`)
                    this.bot.sendMessage(chatId, dialogId)
                })
            )
        })

        this.bot.onText(/^\/join ([A-z, 0-9]{8})$/, (msg, arr) => {
            const dialogId = arr[1]
            dialogsService.join({id: msg.chat.id, username: msg.from.username}, dialogId).then(arrUsers => {
                console.log(`arrUsers: ${JSON.stringify(arrUsers)}`)
                arrUsers.forEach(user => {
                    this.bot.sendMessage(user.id, `bot: @${msg.from.username} joined`)
                })
                this.bot.sendMessage(msg.chat.id, 'bot: joined successed')
            })
        })

        this.bot.onText(/^\/setLanguage (.)$/, (msg, arr) => {
            const language = arr[1]
            switch(language) {
                case 'ru': 
                    userSettingService.setLanguage(msg.chat.id, 'ru')
                    break
                case 'en':
                    userSettingService.setLanguage(msg.chat.id, 'en')
                    break
                default:
                    this.bot.sendMessage(msg.chat.id, 'bot: this language not supported')
            }
        })

        this.bot.onText(/^[^\/]./, msg => {
            dialogsService.getDialogFromUserId(msg.chat.id).then(dialog =>
                userSettingService.getLanguage(msg.chat.id).then(languageSender => {
                    dialog.users.forEach(user => {
                        if(user.id != msg.chat.id) userSettingService.getLanguage(user.id).then(language => {
                            translateService.translate(msg.text, from=languageSender, to=language).then(message => { //????wtf error: from is not defined
                                this.bot.sendMessage(user.id, `@${user.username}: ${message}`)
                            })
                        })
                    })
                })
            )
        })
    }
}