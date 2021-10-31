//index.spec не трогаем, тут просто скрипт который пробегается
//по всей папке tests и собирает все файлы .spec.ts воедино
// @ts-ignore
context = require.context('./', true, /\.spec\.ts$/);
// @ts-ignore
context.keys().forEach(context);
module.exports = context;



