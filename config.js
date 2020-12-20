module.exports = {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: 'root',
    DB: 'slowsales',

    SECRET_KEY: 'SECRET_KEY',

    ROLES: {
        ADMIN: 0,
        MANAGER: 1,
    },

    ERRORS: {
        UNKNOWN: 'Проверьте правильность введенных данных',
        USER_EXISTS: 'Пользователь с этим email уже зарегистирован',
        COMPANY_EXISTS: 'Компания с данным ОГРН уже зарегистирована',
        EMAIL_NOT_FOUND: 'Пользователя с таким email не существует',
        INCORRECT_PASSWORD: 'Неверный пароль',
        CUSTOMER_EXISTS: 'Покупатель уже зарегистрирован в системе. Выберите его из выпадающего списка',
        SERVICE_IS_USED: 'Услуга включена в договоры. Удалите договоры перед тем, как удалять услугу'
    }
}