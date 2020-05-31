const Telegram = require('./telegram/telegram')

const DialogService = require('./service/DialogService')
const { TranslateServiceMock, TranslateService } = require('./service/TranslateService')
const { LocalStorage, DialogLocalStorage } = require('./storage/LocalStorage')
const { MongoStorage, DialogMongoStorage } = require('./storage/MongoStorage')
const UserSettingService = require('./service/UserSettingService')
const Config = require('./config/config')
const config = new Config()

const app = new Telegram(
    config.telegram,
    dialogService=new DialogService(dialogStorage = new DialogMongoStorage('UserDialogs'), new MongoStorage('Users')),
    translateService=new TranslateService(config.yandex_translate),
    userSettingService=new UserSettingService(new MongoStorage('UserSettings')))
