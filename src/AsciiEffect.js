class AsciiEffect {

    constructor(renderer, charSet = ' .:-=+*#%@', options = {}) {

        // Options for customizing the effect
        const fResolution = options['resolution'] || 0.4; // Resolution for ASCII art
        const iScale = options['scale'] || 1; // Scale of ASCII characters
        const bColor = options['color'] || false; // Enable color rendering
        const bAlpha = options['alpha'] || false; // Enable transparency
        const bBlock = options['block'] || false; // Blocky character style
        const bInvert = options['invert'] || false; // Invert colors
        const strResolution = options['strResolution'] || 'low';
        const fontFamily = options['fontFamily'] || 'Consolas, monospace'; // Custom font family

        let width, height;

        const domElement = document.createElement('div');
        domElement.style.cursor = 'default';

        const oAscii = document.createElement('table');
        domElement.appendChild(oAscii);

        let iWidth, iHeight;
        let oImg;

        this.setSize = function (w, h) {
            width = w;
            height = h;

            renderer.setSize(w, h);
            initAsciiSize();
        };

        this.render = function (scene, camera) {
            renderer.render(scene, camera);
            asciifyImage(oAscii);
        };

        this.domElement = domElement;

        function initAsciiSize() {
            iWidth = Math.floor(width * fResolution);
            iHeight = Math.floor(height * fResolution);

            oAscii.cellSpacing = 0;
            oAscii.cellPadding = 0;

            const oStyle = oAscii.style;
            oStyle.whiteSpace = 'pre';
            oStyle.margin = '0px';
            oStyle.padding = '0px';
            oStyle.letterSpacing = fLetterSpacing + 'px';
            oStyle.fontFamily = fontFamily; // Apply custom font family
            oStyle.fontSize = fFontSize + 'px'; // Apply custom font size
            oStyle.lineHeight = fLineHeight + 'px';
            oStyle.textAlign = 'left';
            oStyle.textDecoration = 'none';
        }

        const aDefaultCharList = (' .,:;i1tfLCG08@').split('');
        const aDefaultColorCharList = (' CGO08@').split('');
        const oCanvas = document.createElement('canvas');
        const oCtx = oCanvas.getContext('2d');

        if (!oCtx) return;

        let aCharList = bColor ? aDefaultColorCharList : aDefaultCharList;

        if (charSet) aCharList = charSet;

        const fFontSize = (2 / fResolution) * iScale;
        const fLineHeight = (2 / fResolution) * iScale;

        let fLetterSpacing = 0;

        if (strResolution === 'low') {
            switch (iScale) {
                case 1: fLetterSpacing = -1; break;
                case 2:
                case 3: fLetterSpacing = -2.1; break;
                case 4: fLetterSpacing = -3.1; break;
                case 5: fLetterSpacing = -4.15; break;
            }
        }

        function asciifyImage(oAscii) {
            oCtx.clearRect(0, 0, iWidth, iHeight);
            oCtx.drawImage(renderer.domElement, 0, 0, iWidth, iHeight);
            const oImgData = oCtx.getImageData(0, 0, iWidth, iHeight).data;

            let strChars = '';
            for (let y = 0; y < iHeight; y += 2) {
                for (let x = 0; x < iWidth; x++) {
                    const iOffset = (y * iWidth + x) * 4;
                    const iRed = oImgData[iOffset];
                    const iGreen = oImgData[iOffset + 1];
                    const iBlue = oImgData[iOffset + 2];
                    const iAlpha = oImgData[iOffset + 3];

                    let fBrightness = (0.3 * iRed + 0.59 * iGreen + 0.11 * iBlue) / 255;
                    if (iAlpha === 0) fBrightness = 1;

                    let iCharIdx = Math.floor((1 - fBrightness) * (aCharList.length - 1));
                    if (bInvert) iCharIdx = aCharList.length - iCharIdx - 1;

                    let strThisChar = aCharList[iCharIdx];
                    if (strThisChar === undefined || strThisChar === ' ')
                        strThisChar = '&nbsp;';

                    strChars += strThisChar;
                }
                strChars += '<br/>';
            }

            oAscii.innerHTML = `<tr><td style="display:block;width:${width}px;height:${height}px;overflow:hidden">${strChars}</td></tr>`;
        }
    }
}

export { AsciiEffect };

