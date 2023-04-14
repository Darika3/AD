let form = document.querySelector(".inputs")
let inpImg = document.querySelector("#inpImage");
let inpTrailer = document.querySelector("#inpTrailer")
let inpName = document.querySelector("#inpName");
let inpDesc = document.querySelector("#inpDesc");
let btnAdd = document.querySelector("#btnAdd");
let inpCategory= document.querySelector("#inpCategory");
let API = "http://localhost:8000/movies";
let cardsContainer = document.querySelector("#cards");
let currentPage = 1;
let pageLength = 1;
let categoryBtns = document.querySelectorAll(".filter_btns button");
var filterValue="Все";

console.log(form);

// Навешиваем событие submit на тег Form, для того, чтобы собрать значения инпутов в один объект и отрпавить их в db.json

form.addEventListener("submit", (e) => {
    e.preventDefault();
    //   Проверка на заполненность полей
    if (
      !inpName.value.trim() ||
      !inpImg.value.trim() ||
      !inpDesc.value.trim() ||
      !inpTrailer.value.trim()||
      !inpCategory.value.trim()
    ) {
      alert("Заполните все поля!");
      return;
    }
    //   Создаём новый объект и туда добавляем значения наших инпутов
  let newCard = {
    title: inpName.value,
    image: inpImg.value,
    description: inpDesc.value,
    trailer: inpTrailer.value,
    category: inpCategory.value,
  };
//   console.log(inpCategory.value);
  createCard(newCard);
});

// !Create - добавление новых данных
async function createCard(objProf) {
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(objProf),
    });
    readCard();
  inpCategory.value="Возраст";
  inpName.value='';
  inpImg.value='';
  inpDesc.value='';
  inpTrailer.value='';
  
  }
  
// !Read - отображение данных
async function readCard(search = "") {
    // let res = filterValue !== "Все"? await fetch(`${API}?category=${filterValue}`): await fetch(`${API}?q=${search}&_page=${currentPage}&_limit=3`);
    // let res = filterValue == "Все"? await fetch(`${API}?q=${search}&_page=${currentPage}&_limit=3&_category=${filterValue}`): await fetch(`${API}?q=${search}&_page=${currentPage}&_limit=3`);
    let res=filterValue !== "Все"
      ? await fetch(
          `${API}?q=${search}&_page=${currentPage}&_limit=3&category=${filterValue}`
        )
      : await fetch(`${API}?q=${search}&_page=${currentPage}&_limit=3`);

    let data = await res.json();
    cardsContainer.innerHTML = "";
    data.forEach((elem) => {
      cardsContainer.innerHTML += `
      <div class="grad">
            <div class="card" style="width: 20rem; height: 43rem">
              <img
              onclick="showDetailsModal(${elem.id})"
                style="height: 450px; width: 100%"
                src="${elem.image}"
                class="card-img-top"
                alt="..."
                
              />
              <div class="card-body">
                <h5 class="card-title">${elem.title}</h5>
                <p>${elem.category}</p>
                <p class="card-text">
                ${elem.description}
                </p>
                <button onclick="showModalEdit(${elem.id})" style="
                
                color: white;
                background-color: rgb(141, 36, 36);
                border: none;
                border-radius: 5px;
                width: 40%;" class="btn">Edit</button>
                <button
                 onclick="deleteCard(${elem.id})" style="color: white;
                background-color: rgb(141, 36, 36);
                border: none;
                border-radius: 5px;
                width: 40%;"  class="btn"  >Delete</button>
              </div>
            </div>      
          </div>
      `;
  
    });
    countPages();
  }
  
  readCard();
  

// Delete - удаление одного элемента по id

async function deleteCard(id) {
    console.log('fdsa');
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    readCard();
  }

  
// ! Edit
// let editBtns = document.querySelector(".btnEdit");
let modal = document.querySelector("#modalEdit");
let closeBtn = document.querySelector("#closeEditModal");
let editInpName = document.querySelector("#editInpTitle");
let editInpImage = document.querySelector("#editInpImage");
let editInpTrailer = document.querySelector("#editInpTrailer");
let editInpDesc = document.querySelector("#editInpDesc");
let editInpCategory = document.querySelector("#editInpCategory");
let editForm = document.querySelector("#editForm");
let btnSave = document.querySelector("#saveEditModal");
let inpSearch= document.querySelector("#inpSearch");

async function showModalEdit(id) {
  modal.style.display = "flex";
  let res = await fetch(`${API}/${id}`);
  let data = await res.json();
  console.log(data);
  editInpName.value = data.title;
  editInpImage.value = data.image;
  editInpTrailer.value = data.trailer;
  editInpDesc.value = data.description;
  editInpCategory.value = data.category;
  btnSave.setAttribute("id", data.id);
}

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let editedCard = {
    title: editInpName.value,
    image: editInpImage.value,
    trailer: editInpTrailer.value,
    description: editInpDesc.value,
    category: editInpCategory.value,
  };
  console.log(btnSave.id);
  editCardFunc(editedCard, btnSave.id);
});

async function editCardFunc(editedCard, id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(editedCard),
    });
    modal.style.display = "none";
    readCard();
  } catch (error) {
    console.error(error);
  }
  
}

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});


btnAdd.addEventListener("click", ()=>{

})
// ! Details - детальное отображение данных
let detailsModal= document.querySelector("#modal");
let modalLeft = document.querySelector("#modalLeft")
let detailsName= document.querySelector("#detailsName");
let detailsCategory=document.querySelector("#detailsCategory");
let detailsDesc=document.querySelector("#detailsDescription");
let detailsCloseBtn=document.querySelector(".detailsCloseBtn");
let prevBtn = document.querySelector("#prevBtn");
let nextBtn = document.querySelector("#nextBtn");

async function showDetailsModal(id) {
    detailsModal.style.display = "flex";
    let res = await fetch(`${API}/${id}`);
    let data = await res.json();
    console.log(data.trailer);
    modalLeft.src=data.trailer;
    detailsName.innerText=data.title;
    detailsCategory.innerHTML=data.category;
    detailsDesc.innerText=data.description;
  }
  
  detailsCloseBtn.addEventListener("click",()=>{
    detailsModal.style.display = "none";
  })

  
// ! ============== Seacrh =============
inpSearch.addEventListener("input", (e) => {
    console.log(e.target.value);
    searchValue = e.target.value;
    readCard(e.target.value);
  });

// ! ================= Pagination ==========

async function countPages() {
    let res = await fetch(API);
    let data = await res.json();
    pageLength = Math.ceil(data.length / 3);
  }
  
  prevBtn.addEventListener("click", () => {
    if (currentPage <= 1) return;
    currentPage--;
    readCard();
  });
  
  nextBtn.addEventListener("click", () => {
    if (currentPage >= pageLength) return;
    currentPage++;
    readCard();
  });

  // !================== FILTER =================
categoryBtns.forEach((elem)=>{
    elem.addEventListener("click",()=>{
  console.log(elem.innerText);
  filterValue = elem.innerText;
  readCard();
});
  });
// // !admin call 
// let adminBtn = document.querySelector("#adminBtn");
// let passModal = document.querySelector("#passModal");
// let passInpModal = document.querySelector("#passInpModal");
// let btnPassModalEnter = document.querySelector("#btnPassModalEnter");
// let de= document.querySelectorAll(".card-body button");
// let adminH2 = document.querySelector("#adminH2")

// adminBtn.addEventListener("click",function adminCall(){
//     passModal.style.display = "flex";
//     if(passInpModal==="12345"){
//       de.forEach((elem)=>elem.style.display="flex");
//       adminH2.style.display="block";
//       form.forEach((elem)=>{
//           elem.style.display="flex"
//       })
  
//     }
//   })

 