const TelegramBot = require('node-telegram-bot-api')
const { LogicError } = require('../model/error')

module.exports = class Telegram {
    constructor(config, dialogsService, translateService, userSettingService) {
        this.config = config
        this.dialogsService = dialogsService
        this.bot = new TelegramBot(config.token, {polling: true});
        this.translateService = translateService
        this.userSettingService = userSettingService

        this.bot.onText(/^\/start$/, (msg) => {
            this.bot.sendMessage(msg.chat.id, 
                '/create - create dialog\n'
                + '/join <id> - join to dialog\n'
                + '/setLanguage <language> - set your language\n'
                + '/leave - leave from dialog\n'
                + '/translate <language from> <language to> <text> - translate')
        })

        this.bot.onText(/^\/create$/, (msg) => {
            const chatId = msg.chat.id
            dialogsService.create({id: chatId, username: msg.from.username}).then(dialogId => {
                this.bot.sendMessage(chatId, `bot: that dialog id:`)
                this.bot.sendMessage(chatId, dialogId)
            }).catch(this._errorHandling(chatId))
        })

        this.bot.onText(/^\/join ([A-z, 0-9]{8})$/, (msg, arr) => {
            const dialogId = arr[1]
            dialogsService.join({id: msg.chat.id, username: msg.from.username}, dialogId).then(arrUsers => {
                console.log(`arrUsers: ${JSON.stringify(arrUsers)}`)
                arrUsers.forEach(user => {
                    this.bot.sendMessage(user.id, `bot: @${msg.from.username} joined`)
                })
                this.bot.sendMessage(msg.chat.id, 'bot: joined successed')
            }).catch(this._errorHandling(msg.chat.id))
        })

        this.bot.onText(/^\/setLanguage (.*)$/, (msg, arr) => {
            const language = arr[1]
            translateService.supportedLanguage().then( supportedLanguages => {
                if(supportedLanguages.includes(language)) {
                    userSettingService.setLanguage(msg.chat.id, language)
                } else {
                    this.bot.sendMessage(msg.chat.id, 'bot: this language not supported')
                }
            }).catch(this._errorHandling(msg.chat.id))
        })

        this.bot.onText(/^\/leave$/, msg => {
            this.dialogsService.leave(msg.chat.id).then(arrUsers => {
                this.bot.sendMessage(msg.chat.id, 'bot: leave successed')
                arrUsers.forEach(user => {
                    this.bot.sendMessage(user.id, `bot: @${msg.from.username} leave`)
                })
            }).catch(this._errorHandling(msg.chat.id))
        })

        this.bot.onText(/^[^\/]./, msg => {
            dialogsService.getDialogFromUserId(msg.chat.id).then(dialog =>
                userSettingService.getLanguage(msg.chat.id).then(languageSender => {
                    dialog.users.forEach(user => {
                        if(user.id != msg.chat.id) userSettingService.getLanguage(user.id).then(language => {
                            translateService.translate(msg.text, languageSender, language).then(message => {
                                this.bot.sendMessage(user.id, `@${msg.from.username}: ${message}`)
                            })
                        })
                    })
                })
            ).catch(this._errorHandling(msg.chat.id))
        })

        this.bot.onText(/^\/translate (.{2}) (.{2}) (.*)$/, (msg, arr) => {
            translateService.supportedLanguage().then( supportedLanguage => {
                if(supportedLanguage.includes(arr[1]) && supportedLanguage.includes(arr[2])) {
                    translateService.translate(arr[3], arr[1], arr[2]).then(text => {
                        this.bot.sendMessage(msg.chat.id, `bot: ${text}`)
                    })
                } else throw new LogicError('language not suported')
            }).catch(this._errorHandling(msg.chat.id))
        })
    }

    _errorHandling(chatId) {
        return err => {
            if(err instanceof LogicError) {
                this.bot.sendMessage(chatId, `bot: ${err.message}`)
            } else {
                console.error(`err: ${err.name} ${err.message}`)
            }
        }
    }
}