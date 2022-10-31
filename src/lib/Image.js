export function drawDataURIOnCanvas(strDataURI) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");
    return new Promise((resolve, reject) => {
        let img = new Image();
        document.body.appendChild(canvas)
        img.src = strDataURI;
        img.onload = function () {
            /* Important: first set the size, then draw */
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            resolve(canvas);
        }
    })
}

export async function uriToCanvas(dataUri) {
    const canvas = await drawDataURIOnCanvas(dataUri);
    return canvas
}

export function readAsDataURL(bytes, callback) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onloadend = function () {
            resolve(reader.result);
        }
        reader.readAsDataURL(bytes);
    });
}

export function loadImage(file, imgRef) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const targetImage = imgRef ? imgRef : new Image();
            const dataUrl = e.target.result;
            targetImage.src = dataUrl

            targetImage.onload = () => {
                const canvas = document.createElement('canvas')
                canvas.width = targetImage.width;
                canvas.height = targetImage.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(targetImage, 0, 0);
                resolve({
                    canvas: canvas,
                    dataUrl: dataUrl,
                })
            }
        };
        reader.readAsDataURL(file);
    });
}


export function getDistinctColors(imageData) {
    let distinctRgbValues = [];
    let lastFound = {};

    /* Iterate over all pixels */
    for (let i = 0; i < imageData.length; i += 4) {
        const rgb = {
            r: imageData[i],
            g: imageData[i + 1],
            b: imageData[i + 2],
            count: 1,
        };

        /* Generate unique hash value per color and check for existence */
        let str = Object.values(rgb).join("");
        if (!lastFound.hasOwnProperty(str)) {
            distinctRgbValues.push(rgb);
            lastFound[str] = rgb;
        } else {
            lastFound[str].count++;
        }
    }
    return distinctRgbValues;
};

export function highlightColor(imageData, hexColor) {
    let res = [...imageData];

    /* Iterate over all pixels */
    for (let i = 0; i < imageData.length; i += 4) {
        const hex = `#${imageData[i]}${imageData[i + 1]}${imageData[i + 2]}`;

        /* Generate unique hash value per color and check for existence */
        if (hex === hexColor) {
            res[i] = 255
            res[i + 1] = 0
            res[i + 2] = 0
        } else {
            res[i] = 0
            res[i + 1] = 0
            res[i + 2] = 0
        }
    }
    return res;
};