import sequelize from './config/database.js';
import User from './models/User.js';
import Message from './models/Message.js';

// Установка связей между моделями
User.hasMany(Message, { foreignKey: 'user_id' });
Message.belongsTo(User, { foreignKey: 'user_id' });

// Функция для синхронизации базы данных
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('База данных успешно синхронизирована');
    } catch (error) {
        console.error('Ошибка при синхронизации базы данных:', error);
    }
};

export {
    sequelize,
    User,
    Message,
    syncDatabase
}; 