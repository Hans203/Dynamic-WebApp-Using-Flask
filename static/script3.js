
function pay(){
  let cont = document.querySelector(".container")
  cont.classList.toggle("show")
}

  function paymode(mode){
    const debit = document.querySelector(".debitinfo")
    const cashon = document.querySelector(".CashOn")
    if (mode === 'debit') {
      debit.style.display = 'block';
      cashon.style.display = 'none';
    } else if (mode === 'cash') {
      debit.style.display = 'none';
      cashon.style.display = 'block';
    }
    const debitInp = document.querySelector(".debitinfo #paysubmit")
    const cashInp = document.querySelector(".CashOn #cashsubmit")
    if(mode==='debit'){
      debitInp.type='submit'
      cashInp.type = 'text'
      console.log(debitInp.type)
    }else if(mode === 'cash'){
      debitInp.type='text'
      cashInp.type = 'submit'
    }

  }


  const priceElement = document.querySelectorAll('.price');
  priceElement.forEach((item)=>{
      const formattedPrice = Number(item.textContent).toLocaleString('en-US');
      item.textContent = "$"+formattedPrice;
  })

  const carousel = document.querySelector(".carousel-container");
  const slide = document.querySelector(".carousel-slide");
  
  function handleCarouselMove(positive = true) {
  const slideWidth = slide.clientWidth;
  carousel.scrollLeft = positive ? carousel.scrollLeft + slideWidth : carousel.scrollLeft - slideWidth;
  }
  function garage(){
    fetch('/garage', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',},
      body:JSON.stringify({ value: "{{car[0]}}" })
    })
    .then(response => response.json())
    .then(data => {
      b = data[0]
      alert(b['message'])
      let x = document.querySelector('#buttgara')
      a = data[1]
      x.innerHTML = a['buttValue']
    })
}
window.addEventListener('load', addto())
  function addto(){
    console.log(3)
    fetch('/addtogarage', {
      method:"POST",
      headers: {'Content-Type': 'application/json',},
      body:JSON.stringify({ value: "{{car[0]}}" })
    })
    .then(response=> response.json())
    .then(data=>{
      let x = document.querySelector('#buttgara')
      x.innerHTML = data['message']
    })
  }

  function Filter() {
  let input = document.getElementById('search').value
  input = input.toLowerCase();
  let x = document.getElementsByClassName('searchitems');
  let drop = document.querySelector(".dropdown")
  let count = 0; 
  let noResults = document.querySelector('#noResults');

  for (i = 0; i < x.length; i++) {
  if (!x[i].innerHTML.toLowerCase().includes(input)|| count>=5) {
      x[i].style.display = "none";
      console.log(x[i])
  }
  else {
      x[i].style.display = "block";
      drop.classList.add("show");
      count++;
  }
  }
  if (count === 0) {
  noResults.style.display = 'block';
  drop.classList.add('show');
  } else {
  noResults.style.display = 'none';
  }
  }
  window.onclick = function(event) {
  if (!event.target.matches('#search')) {
  var openDropdown = document.querySelector(".dropdown");
  console.log(openDropdown)
  if (openDropdown.classList.contains('show')) {
      openDropdown.classList.remove('show');
  }}}
  function accnt(){
      let x = document.querySelector(".account")
      x.classList.toggle('showed')
  }
  function logout(){
      fetch('/logout')
      .then(response => response.json())
      .then(data => {
          alert(data)
          window.location.href = '/';
          
      })
      .catch(error => console.log(error))
  }
