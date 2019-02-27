const puppeteer = require('puppeteer');
const fs = require('fs');
const downloader = require('image-downloader');

function getLargestImage(srcSet) {
    const splitSrcs = srcSet.split(',');
    const imgSrc = splitSrcs[splitSrcs.length - 1].split(' ')[0];
    return imgSrc;
}

async function getImageFromPage(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const imageSrcSets = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('article img'));
        const srcSetAttribute = imgs.map(i => i.getAttribute('srcset'))
        return srcSetAttribute;
    })

    const imgUrls = imageSrcSets.map(srcSet => getLargestImage(srcSet));
    await browser.close();
    return imgUrls;
}

async function main() {
    const resultFolder = './result';
    if (!fs.existsSync(resultFolder)) {
        fs.mkdirSync(resultFolder)
    }

    const instaUrl = 'https://www.instagram.com/hot_girl_asians/';
    const images = await getImageFromPage(instaUrl);
    images.forEach((image) => {
        downloader({
            url: image,
            dest: resultFolder
        })
    })

}

main();