const sleep = ms => new Promise(res => setTimeout(res, ms));
const cors = require('cors');
const express = require('express');
const app = express();
const port = 5000

let driver;
let chrome = require('selenium-webdriver/chrome');
const {Builder, By, Key, until} = require('selenium-webdriver');
const screen = {
  width: 640,
  height: 480
};

let checkBuild = false;
(async function build() {
  try{
    driver = await new Builder()
    .forBrowser('chrome')
    // .setChromeOptions(new chrome.Options().headless().windowSize(screen))
    .build();
    await driver.get('https://www.instagram.com/explore/tags/%EC%82%AC%EC%A7%84/');
    checkBuild = true
    console.log('Run Selenium driver')

  } catch(err) {
    throw err
    checkBuild = false
  }
})();

app.use(cors());

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

const asyncCatch = f => (req, res) => f(req, res).catch(err => {
  throw err;
})

const getSearchedList = async (word, res)=> {
  //bulild가 끝났는지 확인
  if(!checkBuild) return res.json(checkBuild)
  const keyBox = await waitGetElement('div .XTCLo')
  await keyBox.sendKeys(`${word}`)

  const searchedItemWrapper = await waitGetElements('.yCE8d')
  const result = await Promise.all(searchedItemWrapper.map(async webElement => {
    const href = await webElement.getAttribute('href')
    const name = href.slice(0, -1).split('/').pop()
    const [img] = await webElement.findElements(By.css('._2dbep img'))
    return {
      name,
      href,
      img: img && await img.getAttribute('src')
    }
  }))
  await keyBox.clear()
  await keyBox.sendKeys('a')
  await keyBox.sendKeys(Key.BACK_SPACE)
  
  return res.json(result)
}

let promiseStack = null
app.get('/insta/stack/:word', asyncCatch(async (req, res)=> {
  const {word} = req.params
  
  if (promiseStack) promiseStack = promiseStack.then(() => getSearchedList(word, res))
  else promiseStack = getSearchedList(word, res)
}))
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))




// 좋은 방법이 아님
let isIng = false // 하고있던 작업 끝을 확인해서 끝나면 다음 작업 진행할 수 있게 
// app.get(`/insta`, (req, res)=>{
//   res.json(dataArr)
// })//데이터 밖에서 전송하지 않게

// app.get('/insta/:word', asyncCatch(async (req, res)=> {
//   const {word} = req.params
  
//   //bulild가 끝났는지 확인
//   if(!checkBuild) return res.json(checkBuild)
//   if (isIng) return res.json(false)
//   isIng = true
//   const keyBox = await waitGetElement('div .XTCLo')
//   await keyBox.sendKeys(`${word}`)

//   const searchedItemWrapper = await waitGetElements('.yCE8d')
//   const result = await Promise.all(searchedItemWrapper.map(async webElement => {
//     const href = await webElement.getAttribute('href')
//     const name = href.slice(0, -1).split('/').pop()
//     const [img] = await webElement.findElements(By.css('._2dbep img'))
//     return {
//       name,
//       href,
//       img: img && await img.getAttribute('src')
//     }
//   }))
//   await keyBox.clear()
//   await keyBox.sendKeys('a')
//   await keyBox.sendKeys(Key.BACK_SPACE)

//   isIng = false
//   return res.json(result)
// }))




//build한 결과 true/false 받음


// (async function Test() {
//   const driver = new Builder()
//   .forBrowser('chrome')
//   .setChromeOptions(new chrome.Options().headless().windowSize(screen))
//   .build();
//   await driver.get('https://www.instagram.com/explore/tags/%EC%82%AC%EC%A7%84/')
//   const a = await driver.getServerUrl();
//   console.log(a)

// })()




