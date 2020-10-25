const sleep = ms => new Promise(res => setTimeout(res, ms));


const {Builder, By, Key, until} = require('selenium-webdriver');

(async function getImage() {
  const imgAddress = []
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://www.instagram.com/explore/tags/%ED%95%B4%EC%8B%9C%EC%8A%A4%EB%83%85/');
  driver.wait(until.elementLocated(By.className('KL4Bh')), 5000).then(
    ()=>{
      driver.findElements(By.className('FFVAD')).then(
        async (el)=>{
          // const imgAddress = []
          for(let i of el) {
            imgAddress.push(await i.getAttribute('src'))
          }
          
          // console.log(imgAddress)
          console.log(imgAddress.length)
          await driver.executeScript(`window.scroll(0,document.body.scrollHeight)`)
          // await driver.executeScript(`document.getElementsByClassName('FFVAD')`)
          driver.findElements(By.className('FFVAD')).then(
            async (el)=>{
              // console.log(await el.length)
              // console.log(el[44])
              // imgAddress.push(await el[44].getAttribute('src'))
              // console.log(el[44].getAttribute('src'))
              // console.log(imgAddress)
              // console.log(await el[imgAddress.length].getAttribute('src'))
              for(let i = imgAddress.length; i<el.length; i++) {
                imgAddress.push(await el[i].getAttribute('src'))
                // console.log(await el[imgAddress.length].getAttribute('src'))
              }
              // console.log(await imgAddress[33])
              // for(let i of el) {
                console.log(await imgAddress.length)
              //   imgAddress.push(await i.getAttribute('src'))
              // }
              // console.log(await imgAddress[0])
              // console.log(await imgAddress[21])
              // console.log(await imgAddress[65])
            }
          )
        })
    })
})()




 // await driver.findElements(By.className('FFVAD')).then((el)=>{
  //   console.log(el)
  // })
  // console.log('image'+img)
  // img.map((curr,idx)=>{console.log(curr)})
  // .then(
  //   // console.log(driver.findElements(By.className('KL4Bh')))
  //   ()=>{
  //     const img = driver.findElements(By.className('FFVAD')).then(
  //       (el)=> console.log(el[0].getAttribute('src'))
  //     )
  //   }
  // )

  //   const getAddress = async(arr)=>{
//   await driver.executeScript(`window.scroll(0,document.body.scrollHeight)`)
//   driver.findElements(By.className('FFVAD')).then(
//     async (el)=>{
//       for(let i of arr) {
//         imgAddress.push(await i.getAttribute('src'))
//       }
//     }
//   )
//   getAddress()
// }