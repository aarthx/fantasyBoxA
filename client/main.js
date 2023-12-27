import homePage from "./pages/home.js"
import booksPage from './pages/books.js'
import moviesPage from "./pages/movies.js"
import gamesPage from "./pages/games.js"

let app = document.getElementById('app')
const settedToken = localStorage.getItem('token')
const navList = Array.from(document.getElementById('navList').children)
const userLogout = document.getElementById('userLogout')
const userSpan = userLogout.children[0]
const btnLogout = document.getElementById('btnLogout')
const btnBooks = navList[0]
const btnMovies = navList[1]
const btnGames = navList[2]

function logout() {
  localStorage.removeItem('token');
  resetPage()
  homeLoad()
}

function toggleModal(modal) {
  let display = window.getComputedStyle(modal).getPropertyValue('display')
  let displayOverlay = window.getComputedStyle(overlay).getPropertyValue('display')
  const spansError = document.querySelectorAll('#registerForm span')
  display === 'none' ? modal.style.display = 'block' : modal.style.display = 'none'
  displayOverlay === 'none' ? overlay.style.display = 'block' : 

  overlay.style.display = 'none'
  for(let i = 0; i < spansError.length; i++) {
    spansError[i].style.display = 'none'
  }
  cleanFormsInputs(modal)
}

function closeModals() {
  modalLogin.style.display = 'none'
  modalRegister.style.display = 'none'
  overlay.style.display = 'none'
  cleanFormsInputs()
}

function cleanFormsInputs(modal) {
  const form = modal.querySelector('form')
  let elementosForm = form.elements 
  for(let i = 0; i < elementosForm.length; i++) {
    elementosForm[i].value = ''
  } 
}

function resetPage() {
  btnLogout.removeEventListener('click', logout)
  btnBooks.removeEventListener('click', booksLoad)
  btnMovies.removeEventListener('click', moviesLoad)
  btnGames.removeEventListener('click', gamesLoad)
  userSpan.innerHTML = ''
  userLogout.style.visibility = 'hidden'
  navList.forEach(li => li.classList.remove('nav-active'))
  navList.forEach(li => li.classList.remove('active'))
}

function loginEvents() {
  // const btnAddNewGame = document.getElementById('btnAddNewGame')
  // const modalNewGame = document.getElementById('modalNewGame')


  btnLogout.addEventListener('click', logout)
  btnBooks.addEventListener('click', booksLoad)
  btnMovies.addEventListener('click', moviesLoad)
  btnGames.addEventListener('click', gamesLoad)
  // btnAddNewGame.addEventListener('click', () => toggleModal(modalNewGame))
}

async function booksLoad() {
  app.innerHTML = booksPage
  const btnAddNewBook = document.getElementById('btnAddNewBook')
  const modalNewBook = document.getElementById('modalNewBook')
  const btnFecharBook = document.getElementById('btnFecharBook')
  const overlay = document.getElementById('overlay')
  btnAddNewBook.addEventListener('click', () => toggleModal(modalNewBook))
  btnFecharBook.addEventListener('click', () => toggleModal(modalNewBook))
  overlay.addEventListener('click', () => toggleModal(modalNewBook))




  // let actUser = userSpan.innerHTML
  // let response = await fetch(`http://127.0.0.1:3000/${actUser}/books`)
  // let data = await response.json()
  btnBooks.classList.add('active')
  btnMovies.classList.remove('active')
  btnGames.classList.remove('active')
}

function moviesLoad() {
  app.innerHTML = moviesPage
  const btnAddNewMovie = document.getElementById('btnAddNewMovie')
  const modalNewMovie = document.getElementById('modalNewMovie')
  const btnFecharMovie = document.getElementById('btnFecharMovie')
  const overlay = document.getElementById('overlay')
  btnAddNewMovie.addEventListener('click', () => toggleModal(modalNewMovie))
  btnFecharMovie.addEventListener('click', () => toggleModal(modalNewMovie))
  overlay.addEventListener('click', () => toggleModal(modalNewMovie))
  btnMovies.classList.add('active')
  btnBooks.classList.remove('active')
  btnGames.classList.remove('active')
}

function gamesLoad() {
  app.innerHTML = gamesPage
  const btnAddNewGame = document.getElementById('btnAddNewGame')
  const modalNewGame = document.getElementById('modalNewGame')
  const btnFecharGame = document.getElementById('btnFecharGame')
  const overlay = document.getElementById('overlay')
  btnAddNewGame.addEventListener('click', () => toggleModal(modalNewGame))
  btnFecharGame.addEventListener('click', () => toggleModal(modalNewGame))
  overlay.addEventListener('click', () => toggleModal(modalNewGame))
  btnGames.classList.add('active')
  btnMovies.classList.remove('active')
  btnBooks.classList.remove('active')
}

function loginLoad(username) {

  userSpan.innerHTML = username
  userLogout.style.visibility = 'visible'
  navList.forEach(li => li.classList.add('nav-active'))
  booksLoad()

}

function homeLoad() {
  app.innerHTML = homePage

  const overlay = document.getElementById('overlay')
  const modalLogin = document.getElementById('modalLogin')
  const modalRegister = document.getElementById('modalRegister')
  const registerForm = document.getElementById('registerForm')
  const loginForm = document.getElementById('loginForm')
  const btnRegister = document.getElementById("btnRegister")
  const btnLogin = document.getElementById("btnLogin")
  const btnFecharRegister = document.getElementById('btnFecharRegister')
  const btnFecharLogin = document.getElementById('btnFecharLogin')
  const spansError = document.querySelectorAll('#registerForm span')

  btnRegister.addEventListener('click', (e) => {
    toggleModal(modalRegister)
  })
  btnLogin.addEventListener('click', (e) => {
    toggleModal(modalLogin)
    const divError = document.getElementById('formErrorLogin')
    divError.innerHTML = ""
  })
  btnFecharRegister.addEventListener('click', () => {
    toggleModal(modalRegister)
    const divError = document.getElementById('formErrorRegister')
    divError.innerHTML = ""
  })
  btnFecharLogin.addEventListener('click', () => {
    toggleModal(modalLogin)
  })
  overlay.addEventListener('click', () => {
    closeModals()
  })
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    let formData = {}
    let elementosFormulario = loginForm.elements

    const divError = document.getElementById('formErrorLogin')
    let paragraphError = document.createElement('p')
    divError.innerHTML = ""

    for(let i = 0; i < elementosFormulario.length; i++) {
      if(elementosFormulario[i].name) {
        formData[elementosFormulario[i].name] = elementosFormulario[i].value
      }
    }

    let jsonData = JSON.stringify(formData)

    try {
      let response = await fetch('http://127.0.0.1:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonData
      })
      let data = await response.json()
      if(data.status === 'success') {
        alert("Usuário logado com sucesso")
        toggleModal(modalLogin)
        localStorage.setItem('token', data.token)
        loginEvents()
        loginLoad(data.username)
      } else if(data.status === 'error') {
        paragraphError.classList.add('error-message')
        paragraphError.style.display = 'block'
        paragraphError.innerHTML = data.error
        divError.appendChild(paragraphError)
      }
    } catch(err) {
      console.error('Erro na requisição: ' + err)
    }
  })
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    let formData = {}
    let elementosFormulario = registerForm.elements

    for(let i = 0; i < elementosFormulario.length; i++) {
      if(elementosFormulario[i].name) {
        formData[elementosFormulario[i].name] = elementosFormulario[i].value
      }
    }
    const divError = document.getElementById('formErrorRegister')
    let paragraphError = document.createElement('p')
    divError.innerHTML = ""
    let jsonData = JSON.stringify(formData)

    try {
      let response = await fetch('http://127.0.0.1:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonData
      })
      let data = await response.json()
      if(data.status === 'success') {
        toggleModal(modalRegister)
        for(let i = 0; i < spansError.length; i++) {
          spansError[i].style.display = 'none'
        }
        alert("Usuário Registrado com sucesso")
      } else if(data.status === 'repeatedInput') {
        spansError.forEach(span => span.style.display = 'none')
        if(data.repeated.length === 2) {
          paragraphError.classList.add('error-message')
          paragraphError.style.display = 'block'
          paragraphError.innerHTML = 'Nome de usuário e email já utilizados, tente outros!'
          divError.appendChild(paragraphError)
        } else {
          paragraphError.classList.add('error-message')
          paragraphError.style.display = 'block'
          if(data.repeated[0] === 'username') data.repeated[0] = 'Nome de usuário'
          paragraphError.innerHTML = `${data.repeated[0].charAt(0).toUpperCase() + data.repeated[0].slice(1)} já utilizado, tente outro!`
          divError.appendChild(paragraphError)
        }
      } else {
        data.validation.usernameValidate ? spansError[0].style.display = 'none' : spansError[0].style.display = 'block' 
        data.validation.emailValidate ? spansError[1].style.display = 'none' : spansError[1].style.display = 'block' 
        data.validation.passwordValidate ? spansError[2].style.display = 'none' : spansError[2].style.display = 'block' 
      }
    } catch(err) {
      console.error('Erro na requisição: ' + err)
    }
  })
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    let response = await fetch('http://127.0.0.1:3000/', {
    headers: {
      'Authorization': `Bearer ${settedToken}`
    }
    })
    let data = await response.json()
    if(response.status === 401 || data.message === 'No tokens yet') {
      resetPage()
      homeLoad()
    }
    else if(data.message === 'success') {
      loginLoad(data.username)
      loginEvents()
    }
  
  } catch(e) {}
})

