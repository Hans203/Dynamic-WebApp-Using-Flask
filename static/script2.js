const speedInput = document.querySelector("#speed_input");
const speedValue = document.querySelector("#speed_value");
speedValue.textContent = speedInput.value;
speedInput.addEventListener("input", (event) => {
speedValue.textContent = event.target.value;
});

const minInput = document.querySelector("#min_input");
const maxInput = document.querySelector("#max_input");

const minValueDisplay = document.querySelector("#min_value");
const maxValueDisplay = document.querySelector("#max_value");
minValueDisplay.textContent = minInput.value;
maxValueDisplay.textContent = maxInput.value;

minInput.addEventListener("input", (event) => {
const minValue = parseInt(event.target.value, 10);
const maxValue = parseInt(maxInput.value, 10);
console.log(maxValue)
if (minValue >= maxValue) {
    minInput.value = maxValue - 1; 
} else {
    minValueDisplay.textContent = minValue;
}
});

maxInput.addEventListener("input", (event) => {
const maxValue = parseInt(event.target.value, 10);
const minValue = parseInt(minInput.value, 10);


if (maxValue <= minValue) {
    maxInput.value = minValue + 1; 
} else {
    maxValueDisplay.textContent = maxValue;
}
});




function show(value){
let item = document.querySelector(`.image-checkbox:nth-of-type(${value})`)
if (item.classList.contains("active")){
    item.classList.remove("active")
}else{
    item.classList.add("active")
}
let b = document.querySelectorAll('.filt img')
let c = b[value-1]
console.log(c.src)
if(c.src === "http://127.0.0.1:5000/static/images/dropdown.png"){
    c.src = "http://127.0.0.1:5000/static/images/dropup.png"
}else{
    c.src = "http://127.0.0.1:5000/static/images/dropdown.png"
}

}


const selectedFilters = {
brand: [],
body_type: [],
engine_size: [],
price_range: { min: 100000, max: 6000000 },
speed: null
};
if (brandabrd) {
    selectedFilters.brand.push(brandabrd);
    const brandCheckbox = document.querySelector(`input[name="brand"][value="${brandabrd}"]`);
    if (brandCheckbox) {
        brandCheckbox.checked = true;
        updateFilters(brandCheckbox);
        fetchFilteredResults(); 
    }
}
if (bodyabrd) {
    selectedFilters.body_type.push(bodyabrd);
    const brandCheckbox = document.querySelector(`input[name="bodytype"][value="${bodyabrd}"]`);
    console.log(brandCheckbox)
    if (brandCheckbox) {
        brandCheckbox.checked = true;
        updateFilters(brandCheckbox);
        fetchFilteredResults(); 
    }
}
document.querySelectorAll('.filter').forEach(filterElement => {
filterElement.addEventListener('change', (e) => {

    updateFilters(e.target);
    fetchFilteredResults(); 
});
});

function updateFilters(target) {
const name = target.name;
const value = target.value;
if (name === 'brand'){
    if (target.checked){
        selectedFilters.brand.push(value);
    } else{
        selectedFilters.brand = selectedFilters.brand.filter(type => type !== value)
    }
}
else if (name === 'bodytype') {
    if (target.checked) {
        selectedFilters.body_type.push(value);
    } else {
        selectedFilters.body_type = selectedFilters.body_type.filter(type => type !== value);
    }
    
} else if (name === 'enginetype') {
    if (target.checked){
        selectedFilters.engine_size.push(value);
    } else{
        selectedFilters.engine_size = selectedFilters.engine_size.filter(type => type !== value)
    }
} else if (name === 'min_val' || name === 'max_val') {
    selectedFilters.price_range[name.split('_')[0]] = value;
}
else if(name ==='speed'){
    selectedFilters.speed = value;
}
console.log(selectedFilters)
}

function fetchFilteredResults() {
fetch('/filter-cars', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ filters: selectedFilters })
})
.then(response => response.json())
.then(data => {
    displayCars(data);
})
.catch(error => console.error('Error fetching data:', error));
}

function displayCars(content) {
const contentArea = document.querySelector('.container-cars');

if (content.length === 0) {
    contentArea.innerHTML = '<p>No Cars matches the selected filters.</p>';
    return;
}
let itemHtml = `<h2>Our <span style="color: red;">Collection</span></h2>`
content.forEach(a => {
    const price = Number(a[9]).toLocaleString('en-US')
    itemHtml += `<a href="/display/${a[2]}">
        <div class="items-car">
            <img src="${a[11]}" alt="Car" width="100%" height=auto>
            <h3>${a[1]} ${a[2]}</h3>
            <span>Year: ${a[3]}</span>
            <span>Engine Type: ${a[5]} | Horsepower: ${a[6]}</span>
            <h3 class="price">Price: $${price}</h3>
    </div>
</a>`;
});
contentArea.innerHTML = itemHtml;
} 

const priceElement = document.querySelectorAll('.price');
priceElement.forEach((item)=>{
    const formattedPrice = Number(item.textContent).toLocaleString('en-US');
    item.textContent = "Price: $"+formattedPrice;
})

function Filter() {
let input = document.getElementById('search').value
input = input.toLowerCase();
let x = document.getElementsByClassName('searchitems');
let drop = document.querySelector(".dropdown")
let count = 0; 
let noResults = document.querySelector('#noResults');
console.log(drop.classList)

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

function resetButton(){
    var imgchkBox = document.querySelectorAll(".image-checkbox")
    for(let i = 1; i<=imgchkBox.length; i++){
        resetCont(i)
    }
    function resetCont(value){
        let item = document.querySelector(`.image-checkbox:nth-of-type(${value})`)
        if (item.classList.contains("active")){
            item.classList.remove("active")
        }
        let b = document.querySelectorAll('.filt img')
        let c = b[value-1]
        if(c.src === "http://127.0.0.1:5000/static/images/dropup.png"){
            c.src = "http://127.0.0.1:5000/static/images/dropdown.png"
        }
    }

    var checkboxes = document.querySelectorAll('.image-checkbox input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
        updateFilters(checkbox);
        fetchFilteredResults(); 
    });
    var rangeInputs = document.querySelectorAll('.image-checkbox input[type="range"]')
    rangeInputs.forEach(function(range){
        range.value=range.defaultValue
        if(range.id==="speed_input"){
            const speedValueDisplay = document.querySelector("#speed_value");
            speedValueDisplay.textContent = range.value;
        }
        if(range.id==="min_input"){
            const minValueDisplay = document.querySelector("#min_value");
            minValueDisplay.textContent = range.value;
        }
        if(range.id==="max_input"){
            const maxValueDisplay = document.querySelector("#max_value");
            maxValueDisplay.textContent = range.value;
        }
        updateFilters(range);
        fetchFilteredResults(); 
        
    })
}
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










    //     let selectedFilters = [];

    //     document.querySelectorAll('.filter').forEach(filter => {
    //         filter.addEventListener('click', function() {
    //             const filterValue = this.getAttribute('data-filter');
                

    //             if (this.classList.contains('selected')) {
    //                 this.classList.remove('selected');
    //                 selectedFilters = selectedFilters.filter(f => f !== filterValue);
    //             } else {
    //                 this.classList.add('selected');

    //                 selectedFilters.push(filterValue);
    //             }


    //             filterContent();
    //         });
    //     });
    //     function filterContent() {
    //         fetch('/filter-cars', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ filters: selectedFilters }),
    //         })
    //         .then(response => response.json())
    //         .then(data => {
                
    //             displayContent(data);
    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //         });
    //     }

    //     function displayContent(content) {
    //         const contentArea = document.querySelector('.container-cars');

    //         if (content.length === 0) {
    //             contentArea.innerHTML = '<p>No content matches the selected filters.</p>';
    //             return;
    //         }
    //         console.log(content)
    //         let itemHtml = ""
    //         content.forEach(a => {
    //             itemHtml += `<a href="/display/${a[2]}">
    //              <div class="items-car">
    //                     <img src="" alt="Car">
    //                     <h3>${a[1]}</h3>
    //                     <span>${a[2]}</span>
    //                     <span>Year: ${a[3]} Engine size: ${a[4]}</span>
    //                     <h3>${a[10]}</h3>
    //            </div>
    //        </a>`;
    //         });
    //         contentArea.innerHTML = itemHtml;
    //     }
        

    // //     function filterBrand(name) {
    // //         fetch(`/brand/${name}`)
    // //         .then(response => response.json()) 
    // //         .then(data => {
    // //             let disp="";
    // //             data.forEach(a=>{
    // //                 disp += `<a href="/display/${a[2]}">
    // //                 <div class="items-car">
    // //                     <img src="" alt="Car">
    // //                     <h3>${a[1]}</h3>
    // //                     <span>${a[2]}</span>
    // //                     <span>Year: ${a[3]} Engine size: ${a[4]}</span>
    // //                     <h3>${a[10]}</h3>
    // //                 </div>
    // //             </a>`;
    // //             })
    // //             console.log(disp)
    // //             document.querySelector(".container-cars").innerHTML = disp
                
    // //         })
    // //         .catch(error => {
    // //             document.querySelector('.container-cars').innerHTML = "Not Found";
    // //         });
    // // 