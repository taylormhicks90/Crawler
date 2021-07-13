//load js-crawler
const Crawler = require("js-crawler");

//
//Initialize variables
//

//initilaize crawler with depth of 6 and shouldCrawl callback
const crawler = new Crawler().configure({
    shouldCrawl: shouldCrawl,
    depth: 6
});

//set the url that we plan on crawling
const urlToCrawl = 'https://localhost';

//initilize errorPages to an empty arry
let errorPages = [];

//initilize still crawling to true
let stillCrawling = true;

//initilize our start time and set it to now
const startTime = new Date().getTime();

//init end time and leave it null
let endTime;

//
// define functions
//

//This function prints the url and status of any pages pushed into errorPages
function printErrors() {
    errorPages.forEach(function (page) {
        console.log(`${page.url} returned status code ${page.status}`)
    });
}

//this function updates the console while the crawler is running so the user knows
//whether the program has frozen or not
function reportCrawling() {
    //set a 5 second time out so we are not constantly rewriting the console
    setTimeout(() => {
        //if we are still crawling we will update the console
        if (stillCrawling) {
            //first step of updating is to clear the console
            console.clear();
            //ouput our progress
            console.log(`Crawling: ${urlToCrawl}.\n${crawler.crawledUrls.length} urls crawled in ${(Math.floor((new Date().getTime() - startTime) / 1000))} seconds.\n`);
            //check if any pages have been added to errorPages if so we will print them
            if (errorPages.length > 0) {
                console.log('Pages With Errors:');
                printErrors();
            } 
            //else we let the user no there are no errors yet
            else {
                console.log('No Errors So Far.')
            }
            //we need to keep doing this as long as the crawler is running so we recurse
            reportCrawling()
        }
    }, 5000)
}

//onSuccess callback this function is call by the crawler when it successfully crawls a page
//used it at first but it outputs to many lines and buggers up the console
function onSuccess(page) {
    //console.log(`Success: ${page.url}`);
};

//onFailure callback this function is called by the crawler when it encounters an http error such as 404 or 500
function onFailure(page) {
    //console.log(`Failed: ${page.url} returned status code ${page.status}`);
    //push the entire page object into the errorPages array for later use
    errorPages.push(page);
}

//onFinished callback this function is called by the crawler when it finishes running
function onAllFinished() {
    //we're finished crawling so we set the endtime to the current time and still crawling to false
    endTime = new Date().getTime();
    stillCrawling = false;
    //clear the console for final output since stillCrawling is now false reportCrawling will not write again
    console.clear();
    //output how many urls wer crawld and how long it took
    console.log(`Finished crawling ${crawler.crawledUrls.length} urls in ${(endTime - startTime) / 1000} seconds\n`);
    //if pages have been added to errorPages we will print them
    if (errorPages.length > 0) {
        console.log('The Following Pages Had Errors:');
        printErrors();
    } 
    //else we congratulate the user
    else {
        console.log('Congratulations There Were No Errors!');
    }
};

//shouldCrawl callback this function is called by the crawler when it discovers a new link
//returning true causes the crawler to add the url of the link to the crawl list
//returning false causes the crawler to skip the url
function shouldCrawl(url) {
    //return if the url starts with the urlToCrawl ie does https://localhost/a/child/page start with https://localhost
     return url.startsWith(urlToCrawl);
}

//
//Finally the actual program
//

//intitial output to console
console.log(`Crawling: ${urlToCrawl}`);

//this starts the crawler with the appropriate url and callbacks
//it is non-blocking and asychoronous so the code past this point will run even though this is still running
crawler.crawl({
    url: urlToCrawl,
    success: onSuccess,
    failure: onFailure,
    finished: onAllFinished
});

//start reportCrawling it will run recursivly until the crawler calls onAllFinished and sets stillCrawling to false
reportCrawling();