const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const fs = require('fs');
const { spawn } = require('child_process');

function onCapturing(width, height, url) {
  return new Promise((resolve, reject) => {
    let win = new BrowserWindow({ title: 'Preview', show: false, autoHideMenuBar: true, maxWidth: width * 2, maxHeight: height * 2 });
    win.loadURL(url);
    win.setContentSize(width, height);
    win.webContents.once('did-finish-load', async () => {
      await win.webContents.executeJavaScript("document.body.style.margin='0';");
      setTimeout(async () => {
        const nativeImage = await win.webContents.capturePage();
        resolve(nativeImage.toDataURL());
      }, 100);
    });
  });
}

function onPrint(url, name, show) {
  return new Promise((resolve, reject) => {

    let win = new BrowserWindow({ title: 'Preview', show: false, autoHideMenuBar: true, height: 800, width: 800 });
    win.loadURL(url);
    console.log("LOADING GENERTATED URL...");

    const printOptions = {
      silent: false,
      printBackground: true,
      color: true,
      marginsType: 1,
      landscape: false,
      pagesPerSheet: 1,
      collate: false,
      copies: 1,
      header: 'Page header',
      footer: 'Page footer',
      pageSize: 'A4',
    };

    win.webContents.once('did-finish-load', async () => {
      await win.webContents.executeJavaScript("document.body.style.margin='0';");
      console.log("DONE.\nGENERATING PDF...");

      win.webContents.printToPDF(printOptions).then(async (data) => {
        let buf = Buffer.from(data);
        let url = 'data:application/pdf;base64,' + buf.toString('base64');
        console.log("DONE.");

        if (show) {
          win.webContents.on('ready-to-show', () => {
            win.show();
            win.setTitle('Preview');
            resolve('shown preview window')
          });
          win.webContents.on('closed', () => win = null);
          win.loadURL(url);
        } else {
          console.log("WRITING PDF FILE...");
          if (!fs.existsSync('out'))
            fs.mkdirSync('out');
          const outfile = `out/${name}.pdf`;
          await fs.writeFile(outfile, url.split(",")[1], 'base64', err => { console.log(err); })
          console.log("PDF written: " + outfile);
          resolve(url);
        }

      })
        .catch((error) => {
          console.log(error);
        });
    });
  });
}

function onPdf2Png(url, name, dpi) {
  return new Promise(async (resolve, reject) => {

    /* Ensure output directories */
    if (!fs.existsSync('out'))
      fs.mkdirSync('out');
    const outdir = `out/${name}`;
    if (!fs.existsSync(outdir))
      fs.mkdirSync(outdir);
    console.log("WRITING PNGS TO " + outdir + "/...");

    /* Convert using imagemagick */
    const magick = spawn('magick', ['+antialias', '-define png:color-type=6', `-density ${dpi}`, `"out/${name}.pdf"`, `${outdir}/out.png`], { shell: true });
    let magickRes = "";

    magick.stdout.on('data', (data) => {
      magickRes += data.toString();
      console.log(data);
    });

    magick.stderr.on('data', (data) => {
      console.error(`magick stderr: ${data}`);
      reject(data);
    });

    magick.on('close', (code) => {
      const res = Buffer.from(magickRes).toString('base64');
      console.log("WRITING PNGS TO " + outdir + "/ -> DONE");
      resolve(res);
    });

  });
}

module.exports = { onCapturing, onPrint, onPdf2Png };