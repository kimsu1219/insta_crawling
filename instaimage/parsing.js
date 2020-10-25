const sleep = ms => new Promise(res => setTimeout(res, ms));
const fs = require('fs') //파일쓰기
const fetch = require("node-fetch");

const axios = require('axios');

const LOOP_DELAY = 175
const {Builder, By, Key, until} = require('selenium-webdriver');

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

(async function getImage() {
  // const imgAddress = []
  let previousVal;
  let start;
  let value
  const postAddress = []
  let writeArr = []
  let countImage = 0
  const requestImages = async() => {
    await driver.executeScript(`window.scrollTo(0,document.body.scrollHeight)`)
    driver.wait(until.elementLocated(By.className('v1Nh3')), 5000).then(
      ()=>{
        // writeArr.push(...postAddress)
        // console.log(writeArr)
        driver.findElements(By.css('div.v1Nh3 a')).then(
          async (el)=>{
            try {
              value = previousVal
              // console.log('a' + value)
              for(let i=0; i<el.length; i++){
                if(i == el.length-1) previousVal = await el[i].getAttribute('href')
                writeArr.push(await el[i].getAttribute('href'))
              }
              console.log(writeArr)
              //배열 중복 제거
              const filterArray = writeArr.filter((item, idx, array) => {
                return array.indexOf( item ) === idx ;
              })
              for(let i =0; i<filterArray.length; i++) {
                if(filterArray[i] == value) start = i
              }
              // console.log(start)
              newArr = filterArray.slice(start)

              const result = await Promise.all(newArr.map(getInstagramPostImages))
              // fs.appendFileSync('./address.txt', result.map(item => item.join(',')).join(',') + ',')
              const loadImages = await Promise.all(result.flat().map(src => new Promise(resolve => {
                axios.get(src).then(resolve, resolve).finally(() => {
                  countImage += 1
                  console.log(countImage)
                })
              })))
              //delay 100,150 에러 발생/
              //delay 175,180, 200, 250 에러 안남
              await sleep(LOOP_DELAY)
              requestImages()
            } catch (err) {
              await sleep(LOOP_DELAY)
              requestImages()
            }
          }
        )
      }
    )
    //이미지 로딩 없을 시 1초까지 문제없음
    //이미지 로딩 시 5,2초 문제 없음
    //이미지 로딩시 1초,1.5초 읽어들일 수 없음 뜸
    // setTimeout(()=>{getAddress()},1000)
  }

  
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://www.instagram.com/explore/tags/google');
  driver.wait(until.elementLocated(By.className('v1Nh3')), 5000).then(
    ()=>{
      driver.findElements(By.css('div.v1Nh3 a')).then(
        async (el)=>{
          requestImages();
        }
      )}
  )
})()

