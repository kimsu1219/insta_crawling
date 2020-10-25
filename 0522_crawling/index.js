const textBox = document.getElementById('textbox')
const check = document.getElementById('check')
const data = document.getElementById('data')
// const text = 'apple'
//btn1 먼저 클릭됬는지 확인
let clickCheck = false;
let text;

textBox.addEventListener('input', ()=>{
  text = textBox.value
  // console.log(textBox.value)
})

document.getElementById('button_1').addEventListener('click', ()=>{
  // console.log(text)
  clickCheck = true;
  // check.innerText = ''
  if (data.firstElementChild != null) {
    data.removeChild(data.firstElementChild)
  }

  if(!text) {
    check.innerText = 'input data'
    clickCheck = false
    // console.log('empty')
    return
  }
  axios.get(`http://localhost:5000/insta/${text}`)
  .then(async function (response) {
    let responseData = response.data
    while(responseData === false) {
      await axios.get(`http://localhost:5000/insta/${text}`)
      .then((res)=>{
        console.log(res.data)
        responseData = res.data
      })
    }
    check.innerText = 'ready'
  })
})

document.getElementById('button_2').addEventListener('click', async()=>{
  if (data.firstElementChild != null) {
    data.removeChild(data.firstElementChild)
  }
  if(!clickCheck) {
    check.innerText = 'click btn1'
    return
  }
  // if(clickCheck === true && !text) {
  //   check.innerText = 'input data first'
  //   return
  // }
  await axios.get(`http://localhost:5000/`)
  .then(async function (response) {
    let dataCheck = response.data
    console.log(dataCheck)
    while(dataCheck === false) {
      await axios.get(`http://localhost:5000/`)
      .then((res)=>{
        console.log(res.data)
        dataCheck = res.data
        check.innerText = 'loading'
      })
    }
    await axios.get(`http://localhost:5000/insta`)
    .then(async function (response) {
      check.innerText = ''

      const innerDiv = document.createElement('div')
      innerDiv.innerText = JSON.stringify(response.data);
      data.appendChild(innerDiv)
      clickCheck = false
      // console.log(response.data.length)
    })
    // console.log(checkData)
  })
})

