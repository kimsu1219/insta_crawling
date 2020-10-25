document.getElementById('button_1').addEventListener('click', ()=>{
  axios.get(`http://localhost:5000/insta/stack/${text}`)
  .then(async function (response) {
    let responseData = response.data
    while(responseData === false) {
      await axios.get(`http://localhost:5000/insta/stack/${text}`)
      .then((res)=>{
        responseData = res.data
      })
    }
    // responseData.map(value=>{
    //   const dataBox = document.createElement('div')
    //   dataBox.innerText = JSON.stringify(value)
    //   innerDiv.appendChild(dataBox)
    // })
  })
})
