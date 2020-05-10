module.exports = class UserSettingService{

    defautlSettings = {
        language: 'en'
    }

    constructor(settingStorage) {
        this.settingStorage = settingStorage
    }

    setLanguage(userId, language) {
        return this.settingStorage.update(userId, { language: language }).catch(() => this.settingStorage.create(userId, { language: language }))
    }

    getLanguage(userId) {
        return this.settingStorage.get(userId).then(settings => settings.language, () => this.defautlSettings.language)
    }
}