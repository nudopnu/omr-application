const { PythonShell } = require('python-shell');

function getModels() {
    return new Promise((resolve, reject) => {
        PythonShell.run(__dirname + '/../scripts/get_models.py', null, (err, output) => {
            // if (err) reject(err)
            const models = output[0].slice(1, -1).split(',').map(el => el.slice(1, -1))
            resolve(models)
        });
    });
}

module.exports = { getModels }