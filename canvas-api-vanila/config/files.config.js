const path = require('path')

let PAGES_DIR,
    PAGES,
    ENTRY = {
        app     : `./src/index.ts`
    },
    PATHS = {
        src     : path.join(__dirname, '../', 'src'),
        dist    : path.join(__dirname, '../', 'dist'),
        root    : path.join(__dirname, '../'),
    }

PATHS.modules     = path.join(PATHS.root, 'node_modules');
PATHS.assets    = path.join(PATHS.src, 'assets');
PATHS.fonts     = path.join(PATHS.assets, 'fonts');
PATHS.img       = path.join(PATHS.assets, 'img');
PATHS.style     = path.join(PATHS.assets, 'styles');
PATHS.static    = path.join(PATHS.assets, 'static');

PAGES_DIR       = path.join(PATHS.src, 'html', 'pages');

PAGES           = ""/*fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))*/;


exports.ENTRY   = ENTRY;
exports.PAGES   = PAGES;
exports.PATHS   = PATHS;
exports.PAGES_DIR = PAGES_DIR;


//Check https://stackoverflow.com/questions/7043509/this-inside-object
