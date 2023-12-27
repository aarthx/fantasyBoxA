
const home = `
  <main class="main-home">
    <p class="home-text"><b>Bem vindo</b> ao Fantasy Box<br>
    Aqui você deposita todo conteudo que você
    já consumiu de livros, filmes ou jogos
    e pode se lembrar da nota e do que você achou
    da experiência!<br>
    Se registre já e experimente nossas funcionalidades!!!<br>
    Ou logue caso já tenha uma conta!</p>
    <div class="start-btns">
      <button class="btn register" id="btnRegister">REGISTRAR</button>
      <button class="btn login" id="btnLogin">LOGIN</button>
    </div>
  </main>  
`

const modalRegister = `
  <div class="modal register" id="modalRegister">
    <div class="modal-header">
      <div></div>
      <div>Registrar</div>
      <button id="btnFecharRegister" class="btn-fechar-modal"><img src="./public/x.svg" alt=""></button>
    </div>
    <form method="post" class="form" id="registerForm">
      <label for="usernameRegister">Nome de Usuário</label>
      <input type="text" id="usernameRegister" name="usernameRegister" required>
      <span class="error-message">Digite um nome de usuário válido</span>
      <label for="emailRegister">E-mail</label>
      <input type="email" id="emailRegister" name="emailRegister" required>
      <span class="error-message">Digite um email válido</span>
      <label for="passwordRegister">Senha</label>
      <input type="password" id="passwordRegister" name="passwordRegister" required>
      <span class="error-message">Digite uma senha válida:<br>* Mínimo de 8 caracteres<br>* Ao menos uma letra maiuscula, uma minúscula um número e um caracter especial!</span>
      <div id="formErrorRegister"></div>
      <button type="submit" class="btn btn-submit">REGISTRAR</button>
    </form>
  </div>
`

const modalLogin = `
<div class="modal login" id="modalLogin">
    <div class="modal-header">
      <div></div>
      <div>Logar</div>
      <button id="btnFecharLogin" class="btn-fechar-modal"><img src="./public/x.svg" alt=""></button>
    </div>
    <form class="form" id="loginForm">
      <label for="usernameLogin">Nome de Usuário</label>
      <input type="text" id="usernameLogin" name="usernameLogin" required>
      
      <label for="passwordLogin">Senha</label>
      <input type="password" id="passwordLogin" name="passwordLogin" required>
      <div id="formErrorLogin"></div>
      <button class="btn btn-submit"  type="submit">LOGAR</button>
    </form>
  </div>
`

const overlay = `<div class="overlay" id="overlay"></div>`

const homePage = home + modalLogin + modalRegister + overlay

export default homePage