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
    .setChromeOptions(new chrome.Options().headless().windowSize(screen))
    .build();
    await driver.get('https://www.instagram.com/explore/tags/%EC%82%AC%EC%A7%84/');
    checkBuild = true

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

let checkDataEnd = false;
const dataArr = []
app.get(`/insta/:word`, (req, res)=>{
  const text = req.params.word
  res.send(checkBuild)
  //bulild가 끝났는지 확인
  if(checkBuild === true) {
    (async ()=>{
      try{
        const keyBox = await waitGetElement('div .XTCLo')
        await keyBox.sendKeys(`${text}`)

        const thumbnails = await waitGetElements('.z556c')
        const result = await Promise.all(thumbnails.map(webElement => {
          return webElement.findElements(By.css('._2dbep img'))
        }))
        for(let i=0; i<result.length; i++) {
          if(!dataArr[i]) dataArr[i] = {}
          // console.log(result[i])
          if(result[i][0]===undefined) {
            dataArr[i].img = null
          }
          else {
            dataArr[i].img = await result[i][0].getAttribute('src') 
          }
        }
        
        // for(let el of name) {
        //   console.log(await el.getAttribute('href'))
        // }
        // name.forEach(async(element,indx) => {
        //   console.log(dataArr[indx])
        //   // console.log(typeof(dataArr[indx]))
        //   // console.log(await element.getAttribute('href'))
        //   // dataArr[indx].link = await element.getAttribute('href')
        // });
        const name = await waitGetElements('.yCE8d')
        for(let i = 0; i < name.length; i++) {
          if(!dataArr[i]) dataArr[i] = {}
          dataArr[i].link = await name[i].getAttribute('href')
          let nameArr = dataArr[i].link.split('/').slice(3,-1)
          // console.log(nameArr)
          if(nameArr.length > 1) {
            nameArr = '#'+nameArr[nameArr.length-1]
          }
          else {
            nameArr = nameArr[0]
          }
          dataArr[i].name = nameArr
        }
        // console.log(dataArr)
        // dataArr에 data가 다 들어왔는지 확인
        checkDataEnd = true

        await keyBox.clear()
        await keyBox.sendKeys('a')
        await keyBox.sendKeys(Key.BACK_SPACE)
      } catch(err){
        throw err}
    })();
  }
})

app.get('/', (req, res)=>{
  res.send(checkDataEnd)
  checkDataEnd = false
})

app.get(`/insta`, (req, res)=>{
  res.json(dataArr)
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


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




