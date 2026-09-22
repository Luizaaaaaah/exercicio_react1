import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3000/api/notes";

function App() {
const [notas, setNotas] = useState([]);
const [loading, setLoading] = useState(true);

const [modalAberto, setModalAberto] = useState(false);
const [modoEdicao, setModoEdicao] = useState(false);

const [notaAtual, setNotaAtual] = useState(null);

const [titulo, setTitulo] = useState("");
const [texto, setTexto] = useState("");

const [erro, setErro] = useState("");

// ==========================
// BUSCAR NOTAS
// ==========================
async function buscarNotas() {
try {
setLoading(true);
setErro("");

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Erro ao buscar notas");
  }

  const data = await response.json();
  setNotas(data);
} catch (error) {
  console.error(error);
  setErro("Não foi possível carregar as notas.");
} finally {
  setLoading(false);
}


}

useEffect(() => {
buscarNotas();
}, []);

// ==========================
// ABRIR MODAL PARA CRIAR
// ==========================
function abrirModalCriar() {
setModoEdicao(false);
setNotaAtual(null);
setTitulo("");
setTexto("");
setErro("");
setModalAberto(true);
}

// ==========================
// ABRIR MODAL PARA EDITAR
// ==========================
function abrirModalEditar(nota) {
setModoEdicao(true);
setNotaAtual(nota);
setTitulo(nota.titulo);
setTexto(nota.texto);
setErro("");
setModalAberto(true);
}

// ==========================
// FECHAR MODAL
// ==========================
function fecharModal() {
setModalAberto(false);
setTitulo("");
setTexto("");
setNotaAtual(null);
setErro("");
}

// ==========================
// SALVAR NOTA
// ==========================
async function salvarNota(event) {
event.preventDefault();

if (!titulo.trim() || !texto.trim()) {
  setErro("Preencha o título e o conteúdo da nota.");
  return;
}

try {
  setErro("");

  const url = modoEdicao
    ? `${API_URL}/${notaAtual.id}`
    : API_URL;

  const method = modoEdicao ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      titulo: titulo.trim(),
      texto: texto.trim(),
    }),
  });

  if (!response.ok) {
    throw new Error("Erro ao salvar nota");
  }

  fecharModal();
  buscarNotas();
} catch (error) {
  console.error(error);
  setErro("Não foi possível salvar a nota.");
}


}

// ==========================
// EXCLUIR NOTA
// ==========================
async function excluirNota(id) {
const confirmar = window.confirm(
"Tem certeza que deseja excluir esta nota?"
);

if (!confirmar) return;

try {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erro ao excluir nota");
  }

  buscarNotas();
} catch (error) {
  console.error(error);
  setErro("Não foi possível excluir a nota.");
}


}

// ==========================
// DATA FORMATADA
// ==========================
function formatarData(data) {
if (!data) return "";

const dataObj = new Date(data);

if (Number.isNaN(dataObj.getTime())) {
  return "";
}

return dataObj.toLocaleDateString("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});


}

return (
<div className="app">
<div className="background-glow glow-one"></div>
<div className="background-glow glow-two"></div>

  <header className="header">
    <div className="brand">
      <div className="brand-icon">
        ✦
      </div>

      <div>
        <h1>Minhas Notas</h1>
        <p>Organize suas ideias e lembretes.</p>
      </div>
    </div>

    <button
      className="new-note-button"
      onClick={abrirModalCriar}
    >
      <span>+</span>
      Nova nota
    </button>
  </header>

  <main className="content">
    <section className="hero">
      <div>
        <span className="eyebrow">SEU ESPAÇO</span>
        <h2>O que você precisa lembrar?</h2>
        <p>
          Guarde suas tarefas, ideias e lembretes
          em um só lugar.
        </p>
      </div>

      <div className="notes-counter">
        <strong>{notas.length}</strong>
        <span>
          {notas.length === 1 ? "nota" : "notas"}
        </span>
      </div>
    </section>

    {erro && !modalAberto && (
      <div className="error-message">
        <span>!</span>
        {erro}
      </div>
    )}

    {loading ? (
      <div className="loading">
        <div className="spinner"></div>
        <p>Carregando suas notas...</p>
      </div>
    ) : notas.length === 0 ? (
      <div className="empty-state">
        <div className="empty-icon">✦</div>

        <h3>Nenhuma nota ainda</h3>

        <p>
          Comece criando sua primeira nota.
        </p>

        <button
          className="empty-button"
          onClick={abrirModalCriar}
        >
          Criar primeira nota
        </button>
      </div>
    ) : (
      <section className="notes-grid">
        {notas.map((nota, index) => (
          <article
            className="note-card"
            key={nota.id}
          >
            <div className={`note-accent accent-${index % 4}`}></div>

            <div className="note-content">
              <div className="note-header">
                <div className="note-symbol">
                  ✦
                </div>

                <div className="note-actions">
                  <button
                    className="icon-button edit"
                    onClick={() => abrirModalEditar(nota)}
                    title="Editar nota"
                  >
                    ✎
                  </button>

                  <button
                    className="icon-button delete"
                    onClick={() => excluirNota(nota.id)}
                    title="Excluir nota"
                  >
                    ×
                  </button>
                </div>
              </div>

              <h3>{nota.titulo}</h3>

              <p className="note-text">
                {nota.texto}
              </p>

              {nota.criadoEm && (
                <div className="note-date">
                  <span>◷</span>
                  {formatarData(nota.criadoEm)}
                </div>
              )}
            </div>
          </article>
        ))}
      </section>
    )}
  </main>

  <footer className="footer">
    <span>Notas pessoais</span>
    <span className="footer-dot">•</span>
    <span>React + Express</span>
  </footer>

  {/* ==========================
      MODAL
  ========================== */}
  {modalAberto && (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          fecharModal();
        }
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">
              {modoEdicao ? "EDITAR NOTA" : "NOVA NOTA"}
            </span>

            <h2>
              {modoEdicao
                ? "Atualize sua nota"
                : "Crie uma nova nota"}
            </h2>
          </div>

          <button
            className="close-button"
            onClick={fecharModal}
          >
            ×
          </button>
        </div>

        <form onSubmit={salvarNota}>
          <div className="form-group">
            <label htmlFor="titulo">
              Título
            </label>

            <input
              id="titulo"
              type="text"
              placeholder="Ex: Tarefas do trabalho"
              value={titulo}
              onChange={(event) =>
                setTitulo(event.target.value)
              }
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="texto">
              Conteúdo
            </label>

            <textarea
              id="texto"
              placeholder="Escreva sua nota aqui..."
              value={texto}
              onChange={(event) =>
                setTexto(event.target.value)
              }
              rows="6"
            />
          </div>

          {erro && (
            <div className="form-error">
              {erro}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={fecharModal}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="save-button"
            >
              {modoEdicao
                ? "Salvar alterações"
                : "Criar nota"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>


);
}

export default App;