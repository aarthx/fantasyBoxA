const games = `
  <main class="main-media">
    <button class="btn-new-media" id="btnAddNewGame">ADICIONAR NOVO</button>
    <div class="mediaList" id="gamesList"></div>
  </main>  
`

const modalNewGame = `
  <div class="modal" id="modalNewGame">
    <div class="modal-header">
      <div></div>
      <div>Adicionar Novo</div>
      <button id="btnFecharGame" class="btn-fechar-modal"><img src="./public/x.svg" alt=""></button>
    </div>
    <form method="post" class="form media" id="gameForm">
      <label for="gameName">Nome</label>
      <input type="text" id="gameName" name="gameName" required>
      <div class="two-inputs">
        <div class="label-input">
          <label for="gameCompany">Empresa</label>
          <input type="text" id="gameCompany" name="gameCompany" class="half" required>
        </div>

        <div class="label-input">
          <label for="gameUrl">URL imagem Capa</label>
          <input type="text" id="gameUrl" name="gameURL" class="half" required>
        </div>
      </div>
     
      <div class="two-inputs">
        <div class="label-input">
          <label for="gameGenre">Gênero</label>
          <input type="text" id="gameGenre" name="gameGenre" class="half" required>
        </div>

        <div class="label-input">
          <label for="gameDiff">Dificuldade (1 a 5)</label>
          <input type="number" min="0" max="10" id="gameDiff" name="gameDiff" class="half" required>
        </div>
      </div>
      
      <div class="two-inputs">
        <div class="label-input">
          <label for="gameTime">Tempo (Minutos)</label>
          <input type="number" id="gameTime" name="gameTime" class="half" required>
        </div>

        <div class="label-input">
          <label for="gameDate">Data de término</label>
          <input type="date" id="gameDate" name="gameDate" class="half" required>
        </div>
      </div>

      <div class="two-inputs">
        <div class="label-input">
          <label for="gameConsole">Plataforma utilizada</label>
          <input type="text" id="gameConsole" name="gameConsole" class="half" required>
        </div>

        <div class="label-input">
          <label for="gameRate">Nota (0 a 10)</label>
          <input type="number" min="0" max="10" id="gameRate" name="gameRate" class="half" required>
        </div>
      </div>
      
      <label for="gameDescription">Comentários</label>
      <textarea id="gameDescription" name="gameDescription" rows="4" cols="50" required></textarea>

      <div class="error-message" id="gameErrorMessage"></div>
      <button type="submit" class="btn btn-submit">Add Jogo</button>
    </form>
  </div>
`

const overlay = `<div class="overlay" id="overlay"></div>`

const gamesPage = games + modalNewGame + overlay

export default gamesPage