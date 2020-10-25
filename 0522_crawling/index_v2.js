const textBox = document.getElementById('textbox')
const data = document.getElementById('data')
// const text = 'apple'

let text;
textBox.addEventListener('input', ()=>{
  text = textBox.value
  // console.log(textBox.value)
})

document.getElementById('button_1').addEventListener('click', ()=>{
  if(!text) return
  if (data.firstElementChild != null) {
    data.removeChild(data.firstElementChild)
  }
  const innerDiv = document.createElement('div')
  data.appendChild(innerDiv)

  axios.get(`http://localhost:5000/insta/stack/${text}`)
  .then(async function (response) {
    let responseData = response.data
    while(responseData === false) {
      // console.log('false')
      await axios.get(`http://localhost:5000/insta/stack/${text}`)
      .then((res)=>{
        responseData = res.data
      })
    }
    console.log('done')
    responseData.map(value=>{
      const dataBox = document.createElement('div')
      dataBox.innerText = JSON.stringify(value)
      innerDiv.appendChild(dataBox)
    })
  })
})
