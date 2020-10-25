const sleep = ms => new Promise(res => setTimeout(res, ms));
const {Builder, By, Key, until} = require('selenium-webdriver');

(async function getImage() {
  const imgAddress = []
  const getAddress = async() => {
    // const loginEle = driver.findElements(By.className('RnEpo'))
    // if(loginEle) {
    //   console.log(loginEle)
    // }
    // else return
    // if(imgAddress.length >= 90) return; //종료조건 다시
    await driver.executeScript(`window.scrollTo(0,document.body.scrollHeight)`)
    driver.wait(until.elementLocated(By.className('FFVAD')), 8000).then(
      ()=>{
        driver.findElements(By.className('FFVAD')).then(
          async (el)=>{
            for(let i = imgAddress.length; i<el.length; i++) {
              imgAddress.push(await el[i].getAttribute('src'))
            }
            console.log(await imgAddress.length)
          }
        )
      }
    )
    setTimeout(()=>{getAddress()},5000)
    // getAddress();
  }
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://www.instagram.com/explore/tags/%ED%95%B4%EC%8B%9C%EC%8A%A4%EB%83%85/');
  driver.wait(until.elementLocated(By.className('KL4Bh')), 5000).then(
    ()=>{
      driver.findElements(By.className('FFVAD')).then(
        async (el)=>{
          for(let i of el) {
            imgAddress.push(await i.getAttribute('src'))
          }
          console.log(await imgAddress.length)
          getAddress()
          
          // await driver.executeScript(`window.scroll(0,document.body.scrollHeight)`)
          // const loginEle = driver.findElements(By.className('RnEpo'))
          // if(loginEle) {
          //   console.log(loginEle)
          // }
          // else return
          // console.log(loginEle[0])
          // driver.wait(until.elementLocated(By.className('FFVAD')), 8000).then(
          //   ()=>{
          //     driver.findElements(By.className('FFVAD')).then(
          //       async (el)=>{
          //         for(let i = imgAddress.length; i<el.length; i++) {
          //           imgAddress.push(await el[i].getAttribute('src'))
          //         }
          //           console.log(await imgAddress.length)
          //           // console.log(await imgAddress)
          //       }
          //     )
          //   }
          // )
        })
    })
})()