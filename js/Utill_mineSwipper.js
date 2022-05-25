function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }


  //My timer
// var gInitTime= Date.now()
// setInterval(timer,41.66)
// function timer(){
//     var elH3 = document.querySelector('h3')
//     var miliSec=Date.now()-gInitTime
//     var min=Math.floor((miliSec / 1000) / 60)
//     var sec=((miliSec / 1000) % 60).toFixed(2)
//     console.log('min',min);
//     console.log('sec',sec);
//     elH3.style.display='block'
//     elH3.innerHTML=`${min}:${sec}`
// }