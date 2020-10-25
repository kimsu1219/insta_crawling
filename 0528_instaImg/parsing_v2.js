const sleep = ms => new Promise(res => setTimeout(res, ms));
const fs = require('fs') 
const fetch = require("node-fetch");
const axios = require('axios');

const express = require('express');
const app = express();
const port = 3333

let driver;
let chrome = require('selenium-webdriver/chrome');
const {Builder, By, Key, until} = require('selenium-webdriver');

let checkBuild = false;
async function build() {
  try{
    driver = await new Builder()
    .forBrowser('chrome')
    // .setChromeOptions(new chrome.Options().headless().windowSize(screen))
    .build();
    checkBuild = true
    console.log('Run Selenium driver')
  } catch(err) {
    throw err
    checkBuild = false
  }
}
build();

const getInstagramPostImages = async url => {
  const body = await (await fetch(url)).text();
  const jsonStr = body.match(/_sharedData = (.+?);<\/script>/)[1];
  const _sharedData = JSON.parse(jsonStr);
  return _sharedData.entry_data.PostPage[0].graphql.shortcode_media
    .edge_sidecar_to_children
    ? _sharedData.entry_data.PostPage[0].graphql.shortcode_media.edge_sidecar_to_children.edges.map(
        ({ node }) => node.display_url
      )
    : [_sharedData.entry_data.PostPage[0].graphql.shortcode_media.display_url];
}

const waitGetElement = async (cssQuery, timeout = 10000) => {
  const bySelector = By.css(cssQuery);
  await driver.wait(until.elementLocated(bySelector), timeout)
  return await driver.findElement(bySelector)
};
const waitGetElements = async (cssQuery, timeout = 10000) => {
  const bySelector = By.css(cssQuery);
  await driver.wait(until.elementLocated(bySelector), timeout)
  return await driver.findElements(bySelector)
};

const addressArr = []
let previousValue 
let previousIndex
let index
let countImage = 0
const requestImages = async(res) => {
  try{
    index = previousIndex
    const imgPost =  await waitGetElements('.v1Nh3 a')
    const imgPostUrl = await Promise.all(imgPost.map(async (webElement)=>{
    const href = await webElement.getAttribute('href')
    return href
    }))
    const getPostImg = await (await Promise.all(imgPostUrl.map(getInstagramPostImages))).flat()
    for(let elem of getPostImg) {
      addressArr.push(elem)
    }
    //배열에 들어온 마지막 값 저장
    previousValue = addressArr[addressArr.length-1]
    //배열중복제거
    const filterArr = Array.from(new Set(addressArr))
    previousIndex = filterArr.indexOf(previousValue)
    const newAddedArr = filterArr.slice(index+1)
    res.json(newAddedArr)
    // const result = newAddedArr.join(',') + ','
    // console.log(result)
    // fs.appendFileSync('./address.txt', result)

    await driver.executeScript(`window.scrollTo(0,document.body.scrollHeight)`)
    await sleep(500)
    requestImages(res)

  }catch(err){
    throw err
    requestImages(res)
  }
}

const getImagePost = async(tagname, res) => {
  try{
    if(!checkBuild) return res.json(checkBuild)
    await driver.get(`https://www.instagram.com/explore/tags/${tagname}`);
    requestImages(res)
    // return res.json(checkBuild)
  } catch(err){
    // console.log(err)
    checkBuild = false
    res.json(checkBuild)
    await driver.quit()
    await build()
  }

}
const asyncCatch = f => (req, res) => f(req, res).catch(err => {
  throw err;
})

let promiseStack = null
app.get('/insta/stack/:tagName', asyncCatch(async (req, res)=> {
  const {tagName} = req.params
  if (promiseStack) promiseStack = promiseStack.then(() => getImagePost(tagName, res))
  else promiseStack = getImagePost(tagName, res)
}))
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

