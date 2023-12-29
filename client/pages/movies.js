const movies = `
  <main class="main-media">
    <button class="btn-new-media" id="btnAddNewMovie">ADICIONAR NOVO</button>
    <div class="mediaList" id="moviesList"></div>
  </main>  
`

const modalNewMovie = `
  <div class="modal" id="modalNewMovie">
    <div class="modal-header">
      <div></div>
      <div>Adicionar Novo</div>
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
  </div>
`

const overlay = `<div class="overlay" id="overlay"></div>`

const moviesPage = movies + modalNewMovie + overlay

export default moviesPage