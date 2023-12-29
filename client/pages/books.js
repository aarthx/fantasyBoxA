const books = `
  <main class="main-media">
    <button class="btn-new-media" id="btnAddNewBook">ADICIONAR NOVO</button>
    <div class="mediaList" id="booksList"></div>
  </main>  
`

const modalNewBook = `
  <div class="modal" id="modalNewBook">
    <div class="modal-header">
      <div></div>
      <div>Adicionar Novo</div>
      <button id="btnFecharBook" class="btn-fechar-modal"><img src="./public/x.svg" alt=""></button>
    </div>
    <form method="post" class="form media" id="bookForm">
      <label for="bookName">Nome</label>
      <input type="text" id="bookName" name="bookName" required>
      <div class="two-inputs">
        <div class="label-input">
          <label for="bookAuthor">Autor</label>
          <input type="text" id="bookAuthor" name="bookAuthor" class="half" required>
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
  </div>
`

const overlay = `<div class="overlay" id="overlay"></div>`

const booksPage = books + modalNewBook + overlay

export default booksPage