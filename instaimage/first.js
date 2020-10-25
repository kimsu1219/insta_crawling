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
              // console.log(cursor)
              //배열 중복 제거
              const filterArray = writeArr.filter((item, idx, array) => {
                return array.indexOf( item ) === idx ;
              })
              // console.log(filterArray.length)
              for(let i =0; i<filterArray.length; i++) {
                if(filterArray[i] == value) start = i
              }
              // console.log(start)
              newArr = filterArray.slice(start)
              // console.log(newArr.length)
              // newArr.map(async curr => {
              //   console.log(curr)
              //   const images = await getInstagramPostImages(curr)
              //   console.log(images)
              //   fs.appendFileSync('./address.txt', images.join(',') + ',')
              // })
              
              // const resultObj = {}
              // Promise.all(
              //   newArr.map(async (curr, i) => {
              //     console.log(curr)
              //     const images = await getInstagramPostImages(curr)
              //     console.log(images)
              //     resultObj[i] = images
              //     fs.appendFileSync('./address.txt', images.join(',') + ',')
              //   })
              // )

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
  // const driver = await new Builder().forBrowser('internet explorer').build();
  // await driver.get('https://www.instagram.com/explore/tags/%ED%95%B4%EC%8B%9C%EC%8A%A4%EB%83%85/');
  await driver.get('https://www.instagram.com/explore/tags/google');
  driver.wait(until.elementLocated(By.className('v1Nh3')), 5000).then(
    ()=>{
      driver.findElements(By.css('div.v1Nh3 a')).then(
        async (el)=>{
          requestImages();
          // for(let i of el){
          //   if(i == el.length-1) cursor = await el[i].getAttribute('href')
          //   postAddress.push(await i.getAttribute('href'))
          // }
          // // console.log(postAddress)
          //   // for(let i of postAddress){
          //   //   const images = await getInstagramPostImages(i)  
          //   //   postAddress.push(await i.getAttribute('href'))
          //   // }
          //   postAddress.map(async (curr, idx, val) => {
          //   const images = await getInstagramPostImages(curr)
          //   fs.writeFileSync('./address.txt', JSON.stringify(images))
          // })


            // const filteredArray = postAddress.filter((item, index) => {
            //   postAddress.indexOf(item) === index
            // });


        }
      )}
  )
})()



// const main = async () => {
//   const images = await getInstagramPostImages(
//     "https://www.instagram.com/p/B_yD0LIn6qz/"
//   );
//   document.body.innerText = JSON.stringify(images);
// };
// // main();

// const getAddress = async() => {

//   await driver.executeScript(`window.scrollTo(0,document.body.scrollHeight)`)
//   driver.wait(until.elementLocated(By.className('v1Nh3')), 5000).then(
//     ()=>{
//       driver.findElements(By.css('div.v1Nh3 a')).then(
//         async (el)=>{
//           // el.map((curr,idx,val)=>{
//           //   postAddress.push(await curr.getAttribute('href'))
//           // })
//           // for(let i of el){
//           //   postAddress.push(await i.getAttribute('href'))
//           // }
//           for(let i; i<el.length; i++){
//             if(i == el.length-1) cursor = el[i]
//             postAddress.push(await el[i].getAttribute('href'))
//           }
//           const filteredArray = postAddress.filter((item, index) => postAddress.indexOf(item) === index);
//           console.log(filteredArray)

//         }
//       )}
//   )
//   setTimeout(()=>{getAddress()},5000)
// }

// const getAddress = async() => {
//   // const loginEle = driver.findElements(By.className('RnEpo'))
//   // if(loginEle) {
//   //   console.log(loginEle)
//   // }
//   // else return
//   await driver.executeScript(`window.scrollTo(0,document.body.scrollHeight)`)
//   driver.wait(until.elementLocated(By.className('FFVAD')), 8000).then(
//     ()=>{
//       driver.findElements(By.className('FFVAD')).then(
//         async (el)=>{
//           for(let i = imgAddress.length; i<el.length; i++) {
//             imgAddress.push(await el[i].getAttribute('src'))
//           }
//           console.log(await imgAddress.length)
//         }
//       )
//     }
//   )
//   setTimeout(()=>{getAddress()},5000)
//   // getAddress();
// }

