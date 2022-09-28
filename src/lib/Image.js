export function drawDataURIOnCanvas(strDataURI, canvas) {
    let img = new window.Image();
    img.addEventListener("load", () => {
        canvas.getContext("2d").drawImage(img, 0, 0);
    });
    img.setAttribute("src", strDataURI);
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
        };

        /* Generate unique hash value per color and check for existence */
        let str = Object.values(rgb).join("");
        if (!lastFound.hasOwnProperty(str)) {
            distinctRgbValues.push(rgb);
            lastFound[str] = i;
        }
    }
    return distinctRgbValues;
};