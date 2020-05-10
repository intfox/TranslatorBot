const Telegram = require('./telegram/telegram')

const DialogService = require('./service/DialogService')
const { TranslateServiceMock, TranslateService } = require('./service/TranslateService')
const { LocalStorage, DialogLocalStorage } = require('./storage/LocalStorage')
const UserSettingService = require('./service/UserSettingService')
const Config = require('./config/config')

const app = new Telegram(
    new Config(),
    dialogService=new DialogService(dialogStorage = new DialogLocalStorage(), new LocalStorage()),
    translateService=new TranslateServiceMock(),
    userSettingService=new UserSettingService(new LocalStorage()))
