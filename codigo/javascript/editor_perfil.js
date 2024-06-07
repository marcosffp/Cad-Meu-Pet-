const apiUrl = "https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/animais_perdidos";

$(document).ready(function () {
  const table = $("#animalsTable").DataTable({
    ajax: {
      url: apiUrl,
      dataSrc: "",
    },
    columns: [
      { data: "id" },
      { data: "status" },
      { data: "especie" },
      { data: "genero" },
      { data: "nome" },
      { data: "endereco" },
      { data: "descricao" },
      { data: "imagemUrl" },
      {
        data: null,
        className: "center",
        defaultContent:
          '<button class="edit-btn">Editar</button> <button class="delete-btn">Deletar</button>',
      },
    ],
  });

  $("#animalsTable tbody").on("click", ".edit-btn", function () {
    const data = table.row($(this).parents("tr")).data();
    openEditModal(data);
  });

  $("#animalsTable tbody").on("click", ".delete-btn", function () {
    const data = table.row($(this).parents("tr")).data();
    if (confirm(`Tem certeza que deseja deletar o animal ${data.nome}?`)) {
      $.ajax({
        url: `${apiUrl}/${data.id}`,
        type: "DELETE",
        success: function () {
          table.ajax.reload(); // Recarrega a tabela após deletar
        },
        error: function (xhr, status, error) {
          console.error("Erro ao deletar o animal:", error);
          alert("Erro ao deletar o animal");
        },
      });
    }
  });

  // Listen for the custom event to reload the table
  document.addEventListener("animalAdded", function () {
    table.ajax.reload(); // Recarrega a tabela após adicionar um novo animal
  });
});

function openEditModal(data) {
  const modal = $("#editModal");
  modal.find("#editId").val(data.id);
  modal.find("#editStatus").val(data.status);
  modal.find("#editEspecie").val(data.especie);
  modal.find("#editGenero").val(data.genero);
  modal.find("#editNome").val(data.nome);
  modal.find("#editEndereco").val(data.endereco);
  modal.find("#editDescricao").val(data.descricao);
  modal.find("#editImagemUrl").val(data.imagemUrl);
  modal.show();

  $("#saveChanges")
    .off("click")
    .on("click", function () {
      const updatedData = {
        id: modal.find("#editId").val(),
        status: modal.find("#editStatus").val(),
        especie: modal.find("#editEspecie").val(),
        genero: modal.find("#editGenero").val(),
        nome: modal.find("#editNome").val(),
        endereco: modal.find("#editEndereco").val(),
        descricao: modal.find("#editDescricao").val(),
        imagemUrl: modal.find("#editImagemUrl").val(),
      };

      $.ajax({
        url: `${apiUrl}/${updatedData.id}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(updatedData),
        success: function () {
          table.ajax.reload(); // Recarrega a tabela após editar
          modal.hide();
        },
        error: function (xhr, status, error) {
          console.error("Erro ao atualizar o animal:", error);
          alert("Erro ao atualizar o animal");
        },
      });
    });
}

function closeModal() {
  $("#editModal").hide();
}

$(document).ready(function () {
  $("body").append(`
    <div id="editModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeModal()">&times;</span>
        <h2>Editar Animal</h2>
        <form id="editForm">
          <input type="hidden" id="editId">
          <div class="form-group">
            <label for="editStatus">Status:</label>
            <select id="editStatus" class="form-control">
              <option value="Desaparecido">Desaparecido</option>
              <option value="Encontrado">Encontrado</option>
            </select>
          </div>
          <div class="form-group">
            <label for="editEspecie">Espécie:</label>
            <select id="editEspecie" class="form-control">
              <option value="Cachorro">Cachorro</option>
              <option value="Gato">Gato</option>
              <option value="Pássaro">Pássaro</option>
            </select>
          </div>
          <div class="form-group">
            <label for="editGenero">Gênero:</label>
            <select id="editGenero" class="form-control">
              <option value="Macho">Macho</option>
              <option value="Fêmea">Fêmea</option>
            </select>
          </div>
          <div class="form-group">
            <label for="editNome">Nome:</label>
            <input type="text" id="editNome" class="form-control">
          </div>
          <div class="form-group">
            <label for="editEndereco">Endereço:</label>
            <input type="text" id="editEndereco" class="form-control">
          </div>
          <div class="form-group">
            <label for="editDescricao">Descrição:</label>
            <textarea id="editDescricao" class="form-control"></textarea>
          </div>
          <div class="form-group">
            <label for="editImagemUrl">URL da Imagem:</label>
            <input type="text" id="editImagemUrl" class="form-control">
          </div>
          <button type="button" id="saveChanges" class="btn btn-primary">Salvar Alterações</button>
        </form>
      </div>
    </div>
  `);
});
