const { PythonShell } = require('python-shell');

function getModels() {
    return new Promise((resolve, reject) => {
        PythonShell.run(__dirname + '/../scripts/get_models.py', null, (err, output) => {
            // if (err) reject(err)
            const models = output[0].slice(1, -1).split(', ').map(el => el.slice(1, -1))
            resolve(models)
        });
    });
}

function predict(image) {
    image = image.split(',').slice(-1)[0]
    return new Promise((resolve, reject) => {
        PythonShell.run(__dirname + '/../scripts/imgping.py', {args: [image]},  (err, output) => {
            const resImage = output[0].slice(2, -1);
            console.error(err, resImage);
            resolve(resImage);
        });
    });
}

module.exports = { getModels, predict }