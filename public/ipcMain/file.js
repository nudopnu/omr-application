const fs = require('fs');

function onReadFile(path) {
    console.log("READING " + path);
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (data)
                resolve(data);
            if (err)
                reject(err);
        });
    });
}

module.exports = { onReadFile }