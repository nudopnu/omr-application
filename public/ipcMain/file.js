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

function onWriteFile(filename, content) {
    return new Promise((resolve, reject) => {

        /* Ensure output directories */
        const outdir = `out`;
        if (!fs.existsSync(outdir))
            fs.mkdirSync(outdir);
        const path = outdir + "/" + filename;
        console.log("WRITING TO " + path);

        fs.writeFile(path, content, 'utf8', (err) => {
            if (err)
                reject(err);
            resolve();
            console.log("WRITING TO " + path + " -> DONE");
        });
    });
}

module.exports = { onReadFile, onWriteFile }