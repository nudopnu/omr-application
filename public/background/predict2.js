const path = require('path');
const { pythonBackgroundProcess } = require('./background_preload');

pythonBackgroundProcess("predict2", path.join('..', '..', '..', 'optical-music-recognition'));
