//index.spec не трогаем, тут просто скрипт который пробегается
//по всей папке tests и собирает все файлы .spec.ts воедино
context = require.context('./', true, /\.spec\.ts$/);
context.keys().forEach(context);
module.exports = context;



