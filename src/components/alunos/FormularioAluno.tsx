import { useState, type FormEvent } from "react";
import type { Aluno, AlunoEntrada, SituacaoAluno } from "../../types";
import { limparCpf } from "../../utils/formatadores";
import "./FormularioAluno.css";

interface FormularioAlunoProps {
  alunoEditando?: Aluno | null;
  salvar: (dados: AlunoEntrada) => void;
  cancelar: () => void;
}

function FormularioAluno({ alunoEditando, salvar, cancelar }: FormularioAlunoProps) {
  const [numeroMatricula, setNumeroMatricula] = useState(alunoEditando?.numeroMatricula ?? "");
  const [nomeAluno, setNomeAluno] = useState(alunoEditando?.nomeAluno ?? "");
  const [dataNascimento, setDataNascimento] = useState(alunoEditando?.dataNascimento ?? "");
  const [cpfAluno, setCpfAluno] = useState(alunoEditando?.cpfAluno ?? "");
  const [telefoneAluno, setTelefoneAluno] = useState(alunoEditando?.telefoneAluno ?? "");
  const [emailAluno, setEmailAluno] = useState(alunoEditando?.emailAluno ?? "");
  const [cepAluno, setCepAluno] = useState(alunoEditando?.cepAluno ?? "");
  const [enderecoAluno, setEnderecoAluno] = useState(alunoEditando?.enderecoAluno ?? "");
  const [situacao, setSituacao] = useState<SituacaoAluno>(alunoEditando?.situacao ?? "Ativo");
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!nomeAluno.trim() || !numeroMatricula.trim() || !dataNascimento) {
      setErro("Nome, matrícula e data de nascimento são obrigatórios.");
      return;
    }

    setErro(null);
    salvar({
      numeroMatricula: numeroMatricula.trim(),
      nomeAluno: nomeAluno.trim(),
      dataNascimento,
      cpfAluno: cpfAluno.trim() ? limparCpf(cpfAluno) : null,
      telefoneAluno: telefoneAluno.trim() || null,
      emailAluno: emailAluno.trim() || null,
      cepAluno: cepAluno.trim() || null,
      enderecoAluno: enderecoAluno.trim() || null,
      situacao,
    });
  }

  return (
    <section className="formulario-aluno">
      <header className="formulario-aluno__cabecalho">
        <h2>{alunoEditando ? "Editar Aluno" : "Novo Aluno"}</h2>
      </header>

      <form className="formulario-aluno__form" onSubmit={handleSubmit} noValidate>
        <label className="formulario-aluno__campo formulario-aluno__campo--largo">
          <span>Nome do aluno *</span>
          <input
            value={nomeAluno}
            onChange={(evento) => setNomeAluno(evento.target.value)}
            placeholder="Ex.: Beatriz Souza Lima"
          />
        </label>

        <label className="formulario-aluno__campo">
          <span>Matrícula *</span>
          <input
            value={numeroMatricula}
            onChange={(evento) => setNumeroMatricula(evento.target.value)}
            placeholder="Ex.: 2026001"
          />
        </label>

        <label className="formulario-aluno__campo">
          <span>Data de nascimento *</span>
          <input
            type="date"
            value={dataNascimento}
            onChange={(evento) => setDataNascimento(evento.target.value)}
          />
        </label>

        <label className="formulario-aluno__campo">
          <span>CPF</span>
          <input
            value={cpfAluno}
            onChange={(evento) => setCpfAluno(evento.target.value)}
            placeholder="Opcional"
          />
        </label>

        <label className="formulario-aluno__campo">
          <span>Situação</span>
          <select value={situacao} onChange={(evento) => setSituacao(evento.target.value as SituacaoAluno)}>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
            <option value="Transferido">Transferido</option>
          </select>
        </label>

        <label className="formulario-aluno__campo">
          <span>Telefone</span>
          <input
            value={telefoneAluno}
            onChange={(evento) => setTelefoneAluno(evento.target.value)}
            placeholder="Opcional"
          />
        </label>

        <label className="formulario-aluno__campo">
          <span>E-mail</span>
          <input
            type="email"
            value={emailAluno}
            onChange={(evento) => setEmailAluno(evento.target.value)}
            placeholder="Opcional"
          />
        </label>

        <label className="formulario-aluno__campo">
          <span>CEP</span>
          <input
            value={cepAluno}
            onChange={(evento) => setCepAluno(evento.target.value)}
            placeholder="Opcional"
          />
        </label>

        <label className="formulario-aluno__campo formulario-aluno__campo--largo">
          <span>Endereço</span>
          <input
            value={enderecoAluno}
            onChange={(evento) => setEnderecoAluno(evento.target.value)}
            placeholder="Opcional"
          />
        </label>

        {erro && (
          <p className="formulario-aluno__erro" role="alert">
            {erro}
          </p>
        )}

        <div className="formulario-aluno__acoes">
          <button type="button" className="formulario-aluno__botao-cancelar" onClick={cancelar}>
            Cancelar
          </button>
          <button type="submit" className="formulario-aluno__botao-salvar">
            {alunoEditando ? "Salvar alterações" : "Cadastrar aluno"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioAluno;
