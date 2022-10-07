const { PythonShell } = require('python-shell');

function getModels() {
    return new Promise((resolve, reject) => {
        PythonShell.run(__dirname + '/../scripts/get_models.py', null, (err, output) => {
            // if (err) reject(err)
            let models = output[0].slice(1, -1).split(', ').map(el => el.slice(1, -1))
            models = models.filter(name => name.endsWith(".h5"))
            resolve(models)
        });
    });
}

function predict(modelname, image) {
    image = image.split(',').slice(-1)[0]
    return new Promise((resolve, reject) => {
        let pyshell = new PythonShell(__dirname + '/../scripts/predict.py', { mode: 'text', args: [modelname] });
        // let pyshell = new PythonShell(__dirname + '/../scripts/predict.py', { mode: 'text', args: [modelname] }, (err, output) => {
        //     const resImage = output[0].slice(2, -1);
        //     console.error('[python]', err, resImage);
        //     resolve(resImage);
        // });
        pyshell.send(image);
        pyshell.on('message', function (message) {
            // received a message sent from the Python script (a simple "print" statement)
            let res = message.slice(2, -1);
            resolve(res);
        });
        // end the input stream and allow the process to exit
        pyshell.end(function (err, code, signal) {
            if (err) throw err;
            console.log('The exit code was: ' + code);
            console.log('The exit signal was: ' + signal);
            console.log('finished');
        });
    });
}

module.exports = { getModels, predict }