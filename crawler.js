const Crawler = require("js-crawler");
const crawler = new Crawler().configure({
    shouldCrawl: shouldCrawl,
    depth: 6
});
let urlToCrawl = 'https://localhost';
let errorPages = [];
let stillCrawling = true;
let startTime = new Date().getTime();
let endTime;
function printErrors() {
    errorPages.forEach(function (page) {
        console.log(`${page.url} returned status code ${page.status}`)
    });
}
function reportCrawling() {
    setTimeout(() => {
        if (stillCrawling) {
            console.clear();
            console.log(`Crawling: ${urlToCrawl}.\n${crawler.crawledUrls.length} urls crawled in ${(Math.floor((new Date().getTime() - startTime) / 1000))} seconds.\n`);
            if (errorPages.length > 0) {
                console.log('Pages With Errors:');
                printErrors();
            } else {
                console.log('No Errors So Far.')
            }
            reportCrawling()
        }
    }, 5000)
}
function onSuccess(page) {
    //console.log(`Success: ${page.url}`);
};
function onFailure(page) {
    //console.log(`Failed: ${page.url} returned status code ${page.status}`);
    errorPages.push(page);
}
function onAllFinished() {
    endTime = new Date().getTime();
    stillCrawling = false;
    console.clear();
    console.log(`Finished crawling ${crawler.crawledUrls.length} urls in ${(endTime - startTime) / 1000} seconds\n`);
    if (errorPages.length > 0) {
        console.log('The Following Pages Had Errors:');
        printErrors();
    } else {
        console.log('Congratulations There Were No Errors!');
    }
};
function shouldCrawl(url) {
    let match = url.startsWith(urlToCrawl);
    return match;
}
console.log(`Crawling: ${urlToCrawl}`);
crawler.crawl({
    url: urlToCrawl,
    success: onSuccess,
    failure: onFailure,
    finished: onAllFinished
});
reportCrawling();