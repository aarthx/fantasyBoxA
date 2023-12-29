const overlayEdit = `<div class="overlay" id="overlay"></div>`

const modalEditBook = `
    <div class="modal-header">
      <div></div>
      <div>Editar Livro</div>
      <button id="btnFecharBook" class="btn-fechar-modal"><img src="./public/x.svg" alt=""></button>
    </div>
    <form method="post" class="form media" id="bookForm">
      <label for="bookName">Nome</label>
      <input type="text" id="bookName" name="bookName" required>
      <div class="two-inputs">
        <div class="label-input">
          <label for="bookAuthor">Autor</label>
          <input type="text" id="bookAuthor" name="bookAuthor" class="half" required value="teste">
        </div>

        <div class="label-input">
          <label for="bookUrl">URL imagem Capa</label>
          <input type="text" id="bookUrl" name="bookURL" class="half" required>
        </div>
      </div>
     
      <div class="two-inputs">
        <div class="label-input">
          <label for="bookGenre">Gênero</label>
          <input type="text" id="bookGenre" name="bookGenre" class="half" required>
        </div>

        <div class="label-input">
          <label for="bookYear">Ano de lançamento</label>
          <input type="number" id="bookYear" name="bookYear" class="half" required>
        </div>
      </div>
      
      <div class="two-inputs">
        <div class="label-input">
          <label for="bookDate">Data de término</label>
          <input type="date" id="bookDate" name="bookDate" class="half" required>
        </div>

        <div class="label-input">
          <label for="bookRate">Nota (0 a 10)</label>
          <input type="number" min="0" max="10" id="bookRate" name="bookRate" class="half" required>
        </div>
      </div>
      
      <label for="bookDescription">Comentários</label>
      <textarea id="bookDescription" name="bookDescription" rows="4" cols="50" required></textarea>

      <div class="error-message" id="bookErrorMessage"></div>
      <button type="submit" class="btn btn-submit">Add Livro</button>
    </form>
`

const modalEditMovie = `
    <div class="modal-header">
      <div></div>
      <div>Editar Filme/Série</div>
      <button id="btnFecharMovie" class="btn-fechar-modal"><img src="./public/x.svg" alt=""></button>
    </div>
    <form method="post" class="form media" id="movieForm">
      <label for="movieName">Nome</label>
      <input type="text" id="movieName" name="movieName" required>
      <div class="two-inputs">
        <div class="label-input">
          <label for="movieDirector">Diretor</label>
          <input type="text" id="movieDirector" name="movieDirector" class="half" required>
        </div>

        <div class="label-input">
          <label for="movieUrl">URL imagem Pôster</label>
          <input type="text" id="movieUrl" name="movieURL" class="half" required>
        </div>
      </div>
     
      <div class="two-inputs">
        <div class="label-input">
          <label for="movieGenre">Gênero</label>
          <input type="text" id="movieGenre" name="movieGenre" class="half" required>
        </div>

        <div class="label-input">
          <label for="movieYear">Ano de lançamento</label>
          <input type="number" id="movieYear" name="movieYear" class="half" required>
        </div>
      </div>
      
      <div class="two-inputs">
        <div class="label-input">
          <label for="movieDate">Data de término</label>
          <input type="date" id="movieDate" name="movieDate" class="half" required>
        </div>

        <div class="label-input">
          <label for="movieRate">Nota (0 a 10)</label>
          <input type="number" min="0" max="10" id="movieRate" name="movieRate" class="half" required>
        </div>
      </div>
      
      <label for="movieDescription">Comentários</label>
      <textarea id="movieDescription" name="movieDescription" rows="4" cols="50" required></textarea>

      <div class="error-message" id="movieErrorMessage"></div>
      <button type="submit" class="btn btn-submit">Add Filme</button>
    </form>
`

const modalEditGame = `
    <div class="modal-header">
      <div></div>
      <div>Editar Jogo</div>
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
`


const editModals = {modalEditBook, modalEditMovie, modalEditGame, overlayEdit}

export default editModals

