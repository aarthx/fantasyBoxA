import homePage from "./pages/home.js"
import booksPage from './pages/books.js'
import moviesPage from "./pages/movies.js"
import gamesPage from "./pages/games.js"

let app = document.getElementById('app')
let settedToken = localStorage.getItem('token')
const navList = Array.from(document.getElementById('navList').children)
const userLogout = document.getElementById('userLogout')
const userSpan = userLogout.children[0]
const btnLogout = document.getElementById('btnLogout')
const btnBooks = navList[0]
const btnMovies = navList[1]
const btnGames = navList[2]
const serverURL = '127.0.0.1'
const serverPORT = '3000'

function logout() {
  localStorage.removeItem('token');
  resetPage()
  homeLoad()
}

function toggleModal(modal) {
  let display = window.getComputedStyle(modal).getPropertyValue('display')
  let displayOverlay = window.getComputedStyle(overlay).getPropertyValue('display')
  const errMSG = document.querySelector('.error-message')
  const spansError = document.querySelectorAll('#registerForm span')
  display === 'none' ? modal.style.display = 'block' : modal.style.display = 'none'
  displayOverlay === 'none' ? overlay.style.display = 'block' : 

  overlay.style.display = 'none'
  for(let i = 0; i < spansError.length; i++) {
    spansError[i].style.display = 'none'
  }
  cleanFormsInputs(modal)
  errMSG.style.display = 'none'
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
  btnLogout.addEventListener('click', logout)
  btnBooks.addEventListener('click', booksLoad)
  btnMovies.addEventListener('click', moviesLoad)
  btnGames.addEventListener('click', gamesLoad)
}

async function booksLoad() {
  app.innerHTML = booksPage
  const btnAddNewBook = document.getElementById('btnAddNewBook')
  const modalNewBook = document.getElementById('modalNewBook')
  const btnFecharBook = document.getElementById('btnFecharBook')
  const overlay = document.getElementById('overlay')
  const bookForm = document.getElementById('bookForm')
  const booksList = document.getElementById('booksList')
  btnAddNewBook.addEventListener('click', () => toggleModal(modalNewBook))
  btnFecharBook.addEventListener('click', () => toggleModal(modalNewBook))
  overlay.addEventListener('click', () => toggleModal(modalNewBook))
  bookForm.addEventListener('submit', (e) => {
    addMedia(e, modalNewBook, 'books')
  })
  btnBooks.classList.add('active')
  btnMovies.classList.remove('active')
  btnGames.classList.remove('active')
  localStorage.setItem('activePage', 'books')

  loadMedia(booksList, 'books')
}

function moviesLoad() {
  app.innerHTML = moviesPage
  const btnAddNewMovie = document.getElementById('btnAddNewMovie')
  const modalNewMovie = document.getElementById('modalNewMovie')
  const btnFecharMovie = document.getElementById('btnFecharMovie')
  const overlay = document.getElementById('overlay')
  const movieForm = document.getElementById('movieForm')
  const moviesList = document.getElementById('moviesList')
  btnAddNewMovie.addEventListener('click', () => toggleModal(modalNewMovie))
  btnFecharMovie.addEventListener('click', () => toggleModal(modalNewMovie))
  overlay.addEventListener('click', () => toggleModal(modalNewMovie))
  movieForm.addEventListener('submit', (e) => {
    addMedia(e, modalNewMovie, 'movies')
  })
  btnMovies.classList.add('active')
  btnBooks.classList.remove('active')
  btnGames.classList.remove('active')
  localStorage.setItem('activePage', 'movies')

  loadMedia(moviesList, 'movies')
}

function gamesLoad() {
  app.innerHTML = gamesPage
  const btnAddNewGame = document.getElementById('btnAddNewGame')
  const modalNewGame = document.getElementById('modalNewGame')
  const btnFecharGame = document.getElementById('btnFecharGame')
  const overlay = document.getElementById('overlay')
  const gameForm = document.getElementById('gameForm')
  const gamesList = document.getElementById('gamesList')
  btnAddNewGame.addEventListener('click', () => toggleModal(modalNewGame))
  btnFecharGame.addEventListener('click', () => toggleModal(modalNewGame))
  overlay.addEventListener('click', () => toggleModal(modalNewGame))
  gameForm.addEventListener('submit', (e) => {
    addMedia(e, modalNewGame, 'games')
  })
  btnGames.classList.add('active')
  btnMovies.classList.remove('active')
  btnBooks.classList.remove('active')
  localStorage.setItem('activePage', 'games')

  loadMedia(gamesList, 'games')
}

async function addMedia(e, modal, category) {
  e.preventDefault()
  const formData = {}
  const inputFields = e.target.querySelectorAll('input')
  const textArea = e.target.querySelector('textarea')
  inputFields.forEach(input => formData[input.name] = input.value)
  formData[textArea.name] = textArea.value
  settedToken = localStorage.getItem('token')
  try {
    let response = await fetch(`http://${serverURL}:${serverPORT}/${category}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settedToken}`,
      },
      body: JSON.stringify(formData)
    })
    let data = await response.json()
    if(data.message === 'success') {
      toggleModal(modal)
      location.reload()
    } else if(data.message === 'error' && category === 'books') {
      const bookErrorMessage = document.getElementById('bookErrorMessage')
      bookErrorMessage.style.display = 'block'
      bookErrorMessage.innerHTML = ''
      if(data.invalids.includes('bookName')) {
        bookErrorMessage.innerHTML += '* O nome do livro deve ter entre 1 e 50 caracteres<br>'
      }
      if(data.invalids.includes('bookAuthor')) {
        bookErrorMessage.innerHTML += '* O autor do livro deve ter entre 1 e 50 caracteres<br>'
      }
      if(data.invalids.includes('bookURL')) {
        bookErrorMessage.innerHTML += '* O link de imagem é inválido, tente outro<br>'
      }
      if(data.invalids.includes('bookGenre')) {
        bookErrorMessage.innerHTML += '* O gênero do livro deve ter entre 1 e 50 caracteres<br>'
      }
      if(data.invalids.includes('bookYear')) {
        bookErrorMessage.innerHTML += '* Ano de livro inválido<br>'
      }
      if(data.invalids.includes('bookDate')) {
        bookErrorMessage.innerHTML += '* Data do livro inválida<br>'
      }
      if(data.invalids.includes('bookRate')) {
        bookErrorMessage.innerHTML += '* A nota do livro deve ser de 0 a 10<br>'
      }
      if(data.invalids.includes('bookDescription')) {
        bookErrorMessage.innerHTML += '* Os comentários do livro deve ter entre 1 e 500 caracteres<br>'
      }
      if(data.invalids.includes('validateRepeatedName')) {
        bookErrorMessage.innerHTML += '* Já existe um livro com este nome cadastrado!<br>'
      }
    } else if(data.message === 'error' && category === 'movies') {
      const movieErrorMessage = document.getElementById('movieErrorMessage')
      movieErrorMessage.style.display = 'block'
      movieErrorMessage.innerHTML = ''
      if(data.invalids.includes('movieName')) {
        movieErrorMessage.innerHTML += '* O nome do Filme/Série deve ter entre 1 e 50 caracteres<br>'
      }
      if(data.invalids.includes('movieDirector')) {
        movieErrorMessage.innerHTML += '* O diretor do Filme/Série deve ter entre 1 e 50 caracteres<br>'
      }
      if(data.invalids.includes('movieURL')) {
        movieErrorMessage.innerHTML += '* O link de imagem é inválido, tente outro<br>'
      }
      if(data.invalids.includes('movieGenre')) {
        movieErrorMessage.innerHTML += '* O gênero do Filme/Série deve ter entre 1 e 50 caracteres<br>'
      }
      if(data.invalids.includes('movieYear')) {
        movieErrorMessage.innerHTML += '* Ano de Filme/Série inválido<br>'
      }
      if(data.invalids.includes('movieDate')) {
        movieErrorMessage.innerHTML += '* Data do Filme/Série inválida<br>'
      }
      if(data.invalids.includes('movieRate')) {
        movieErrorMessage.innerHTML += '* A nota do Filme/Série deve ser de 0 a 10<br>'
      }
      if(data.invalids.includes('movieDescription')) {
        movieErrorMessage.innerHTML += '* Os comentários do Filme/Série deve ter entre 1 e 500 caracteres<br>'
      }
      if(data.invalids.includes('validateRepeatedName')) {
        movieErrorMessage.innerHTML += '* Já existe um filme/série com este nome cadastrado!<br>'
      }
    } else if(data.message === 'error' && category === 'games') {
      const gameErrorMessage = document.getElementById('gameErrorMessage')
      gameErrorMessage.style.display = 'block'
      gameErrorMessage.innerHTML = ''
      if(data.invalids.includes('gameName')) {
        gameErrorMessage.innerHTML += '* O nome do Jogo deve ter entre 1 e 50 caracteres<br>'
      }
      if(data.invalids.includes('gameCompany')) {
        gameErrorMessage.innerHTML += '* A empresa desenvolvedora do Jogo deve ter entre 1 e 50 caracteres<br>'
      }
      if(data.invalids.includes('gameURL')) {
        gameErrorMessage.innerHTML += '* O link de imagem é inválido, tente outro<br>'
      }
      if(data.invalids.includes('gameGenre')) {
        gameErrorMessage.innerHTML += '* O gênero do Jogo deve ter entre 1 e 50 caracteres<br>'
      }
      if(data.invalids.includes('gameDiff')) {
        gameErrorMessage.innerHTML += '* A dificuldade do Jogo deve estar de 1 a 5<br>'
      }
      if(data.invalids.includes('gameTime')) {
        gameErrorMessage.innerHTML += '* O tempo de Jogo deve estar de 0 a 52596000 minutos<br>'
      }
      if(data.invalids.includes('gameDate')) {
        gameErrorMessage.innerHTML += '* Data do Jogo inválida<br>'
      }
      if(data.invalids.includes('gameConsole')) {
        gameErrorMessage.innerHTML += '* O console utilizado deve ter entre 1 e 50 caracteres<br>'
      }
      if(data.invalids.includes('gameRate')) {
        gameErrorMessage.innerHTML += '* A nota do Jogo deve ser de 0 a 10<br>'
      }
      if(data.invalids.includes('gameDescription')) {
        gameErrorMessage.innerHTML += '* Os comentários do Jogo deve ter entre 1 e 500 caracteres<br>'
      }
      if(data.invalids.includes('validateRepeatedName')) {
        gameErrorMessage.innerHTML += '* Já existe um jogo com este nome cadastrado!<br>'
      }
    }
    
  } catch(e) {
    console.error(e)
  }
}

async function loadUniqueMedia(mediaName, category) {
  settedToken = localStorage.getItem('token')
  let response = await fetch(`http://${serverURL}:${serverPORT}/${category}/${mediaName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settedToken}`,
      }
  })
  let data = await response.json()
  let mainContent = document.querySelector('.main-media')
  if(category === 'books') {
    
    const finalBookDate = new Date(data.bookDate)
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formatter = new Intl.DateTimeFormat('pt-BR', options);
    const dateFormatted = formatter.format(finalBookDate);

    const btnDiv = document.createElement('div')
    btnDiv.classList.add('media-buttons')
    const btnEdit = document.createElement('button')
    btnEdit.innerHTML = 'EDITAR'
    const btnRemove = document.createElement('button')
    btnRemove.innerHTML = 'REMOVER'
    
    btnDiv.appendChild(btnEdit)
    btnDiv.appendChild(btnRemove)
    
    btnRemove.addEventListener('click', () => removeMedia('books', data.bookName))

    mainContent.innerHTML = `
      <div class="media-header">
        <h1>${data.bookName}</h1>
        <h3>${data.bookAuthor}</h3>
      </div>
      <div class="media-content">
        <div class="media-img">
          <img src=${data.bookURL}>
        </div>
        <div class="media-text">
          <p><b>Gênero:</b> ${data.bookGenre}<p>
          <p><b>Ano:</b> ${data.bookYear}<p>
          <p><b>Data que foi lido:</b> ${dateFormatted}<p>
          <p><b>Nota:</b> ${data.bookRate}<p>
          <div class="media-description">
            <p><b>Description:</b></p>
            <p>${data.bookDescription}</p>
          </div>
        </div>
      </div>
    `
    mainContent.appendChild(btnDiv)
  } else if(category === 'movies') {
    const finalMovieDate = new Date(data.movieDate)
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formatter = new Intl.DateTimeFormat('pt-BR', options);
    const dateFormatted = formatter.format(finalMovieDate);

    const btnDiv = document.createElement('div')
    btnDiv.classList.add('media-buttons')
    const btnEdit = document.createElement('button')
    btnEdit.innerHTML = 'EDITAR'
    const btnRemove = document.createElement('button')
    btnRemove.innerHTML = 'REMOVER'
    
    btnDiv.appendChild(btnEdit)
    btnDiv.appendChild(btnRemove)
    
    btnRemove.addEventListener('click', () => removeMedia('movies', data.movieName))

    mainContent.innerHTML = `
      <div class="media-header">
        <h1>${data.movieName}</h1>
        <h3>${data.movieDirector}</h3>
      </div>
      <div class="media-content">
        <div class="media-img">
          <img src=${data.movieURL}>
        </div>
        <div class="media-text">
          <p><b>Gênero:</b> ${data.movieGenre}<p>
          <p><b>Ano:</b> ${data.movieYear}<p>
          <p><b>Data que foi visto:</b> ${dateFormatted}<p>
          <p><b>Nota:</b> ${data.movieRate}<p>
          <div class="media-description">
            <p><b>Description:</b></p>
            <p>${data.movieDescription}</p>
          </div>
        </div>
      </div>
    `
    mainContent.appendChild(btnDiv)
  } else if(category === 'games') {
    const finalGameDate = new Date(data.gameDate)
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formatter = new Intl.DateTimeFormat('pt-BR', options);
    const dateFormatted = formatter.format(finalGameDate);

    const btnDiv = document.createElement('div')
    btnDiv.classList.add('media-buttons')
    const btnEdit = document.createElement('button')
    btnEdit.innerHTML = 'EDITAR'
    const btnRemove = document.createElement('button')
    btnRemove.innerHTML = 'REMOVER'
    
    btnDiv.appendChild(btnEdit)
    btnDiv.appendChild(btnRemove)
    
    btnRemove.addEventListener('click', () => removeMedia('games', data.gameName))

    mainContent.innerHTML = `
      <div class="media-header">
        <h1>${data.gameName}</h1>
        <h3>${data.gameCompany}</h3>
      </div>
      <div class="media-content">
        <div class="media-img">
          <img src=${data.gameURL}>
        </div>
        <div class="media-text">
        <p><b>Console:</b> ${data.gameConsole}<p>
        <p><b>Gênero:</b> ${data.gameGenre}<p>
        <p><b>Dificuldade:</b> ${data.gameDiff}<p>
        <p><b>Data que foi zerado:</b> ${dateFormatted}<p>
          <p><b>Nota:</b> ${data.gameRate}<p>
          <div class="media-description">
            <p><b>Description:</b></p>
            <p>${data.gameDescription}</p>
          </div>
        </div>
      </div>
    `
    mainContent.appendChild(btnDiv)

  }
  
}

async function loadMedia(list, category) {
  settedToken = localStorage.getItem('token')
  try {
    let response = await fetch(`http://${serverURL}:${serverPORT}/${category}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settedToken}`,
      }
    })
    let data = await response.json()
    data.forEach(media => {
      let card = document.createElement('div')
      card.classList.add('card')
      if(media.hasOwnProperty('bookName')) {

        card.addEventListener('click', () => loadUniqueMedia(media.bookName, 'books'))

        card.innerHTML = `
          <div class="img-container">
            <img src=${media.bookURL}>
          </div>
          <div class="card-text">
            <h2 class="card-title">${media.bookName.slice(0, 20)}${media.bookName.length > 20 ? '...' : ''}</h2>
            <p>Nota: <b>${media.bookRate}</b><p>
            <p class="card-desc">${media.bookDescription.slice(0, 100)}${media.bookDescription.length > 100 ? '...' : ''}</p>
          </div>
        `
        list.appendChild(card)
      } else if(media.hasOwnProperty('movieName')) {

        card.addEventListener('click', () => loadUniqueMedia(media.movieName, 'movies'))

        card.innerHTML += `
          <div class="img-container">
            <img src=${media.movieURL}>
          </div>
          <div class="card-text">
            <h2 class="card-title">${media.movieName.slice(0, 20)}${media.movieName.length > 20 ? '...' : ''}</h2>
            <p>Nota: <b>${media.movieRate}</b><p>
            <p class="card-desc">${media.movieDescription.slice(0, 100)}${media.movieDescription.length > 100 ? '...' : ''}</p>
          </div>
        `
        list.appendChild(card)
      } else if (media.hasOwnProperty('gameName')) {

        card.addEventListener('click', () => loadUniqueMedia(media.gameName, 'games'))

        card.innerHTML += `
          <div class="img-container">
            <img src=${media.gameURL}>
          </div>
          <div class="card-text">
            <h2 class="card-title">${media.gameName.slice(0, 20)}${media.gameName.length > 20 ? '...' : ''}</h2>
            <p>Nota: <b>${media.gameRate}</b><p>
            <p class="card-desc">${media.gameDescription.slice(0, 100)}${media.gameDescription.length > 100 ? '...' : ''}</p>
          </div>
        `
        list.appendChild(card)
      } 
    })
  } catch (e) {
    location.reload()
    console.error(e)
  }
}

async function removeMedia(category, mediaName) {
  const confirmDelete = confirm(`Tem certeza que deseja deletar: ${mediaName}`);
  if(confirmDelete) {
    settedToken = localStorage.getItem('token')
    try {
      let response = await fetch(`http://${serverURL}:${serverPORT}/${category}/${mediaName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settedToken}`,
        }
      })
      let data = await response.json()
      location.reload()
    } catch(e) {console.error(e)}
  }
}

function loginLoad(username) {
  let activePage = localStorage.getItem('activePage')
  userSpan.innerHTML = username
  userLogout.style.visibility = 'visible'
  navList.forEach(li => li.classList.add('nav-active'))
  if(activePage === 'books') {
    booksLoad()
  } else if(activePage === 'movies') {
    moviesLoad()
  } else if(activePage === 'games') {
    gamesLoad()
  }

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
      let response = await fetch(`http://${serverURL}:${serverPORT}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonData
      })
      let data = await response.json()
      if(data.status === 'success') {
        toggleModal(modalLogin)
        localStorage.setItem('token', data.token)
        loginEvents()
        localStorage.setItem('activePage', 'books')
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
      let response = await fetch(`http://${serverURL}:${serverPORT}/register`, {
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
    let response = await fetch(`http://${serverURL}:${serverPORT}/`, {
    headers: {
      'Authorization': `Bearer ${settedToken}`
    }
    })
    let data = await response.json()
    if(response.status === 403 || data.message === 'No tokens yet') {
      resetPage()
      homeLoad()
    }
    else if(data.message === 'success') {
      loginLoad(data.username)
      loginEvents()
    }
  
  } catch (e) {
    console.log('Erro na autenticação do token:', e.message);
  }
})

