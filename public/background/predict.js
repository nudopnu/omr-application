const path = require('path');
const { pythonBackgroundProcess } = require('./background_preload');

pythonBackgroundProcess("predict", path.join('..', '..', '..', 'omr-unet'));
