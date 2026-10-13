import { useRef, useState, type FormEvent } from "react";
import type { Aluno, AlunoEntrada, SituacaoAluno } from "../../types";
import { limparCpf } from "../../utils/formatadores";
import "./FormularioAluno.css";

interface FormularioAlunoProps {
  alunoEditando?: Aluno | null;
  salvar: (dados: AlunoEntrada) => Promise<void>;
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
  const [enviando, setEnviando] = useState(false);
  const emEnvioRef = useRef(false);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (emEnvioRef.current) return;

    if (!nomeAluno.trim() || !numeroMatricula.trim() || !dataNascimento) {
      setErro("Nome, matrícula e data de nascimento são obrigatórios.");
      return;
    }

    const cpfLimpo = limparCpf(cpfAluno);
    if (cpfAluno.trim() && cpfLimpo.length !== 11) {
      setErro("O CPF deve ter 11 dígitos.");
      return;
    }
    const cepLimpo = cepAluno.replace(/\D/g, "");
    if (cepAluno.trim() && cepLimpo.length !== 8) {
      setErro("O CEP deve ter 8 dígitos.");
      return;
    }

    emEnvioRef.current = true;
    setEnviando(true);
    setErro(null);
    try {
      await salvar({
        numeroMatricula: numeroMatricula.trim(),
        nomeAluno: nomeAluno.trim(),
        dataNascimento,
        cpfAluno: cpfAluno.trim() ? cpfLimpo : null,
        telefoneAluno: telefoneAluno.trim() || null,
        emailAluno: emailAluno.trim() || null,
        cepAluno: cepAluno.trim() ? cepLimpo : null,
        enderecoAluno: enderecoAluno.trim() || null,
        situacao,
      });
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar o aluno.");
    } finally {
      emEnvioRef.current = false;
      setEnviando(false);
    }
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
            maxLength={100}
            disabled={enviando}
            placeholder="Ex.: Beatriz Souza Lima"
          />
        </label>

        <label className="formulario-aluno__campo">
          <span>Matrícula *</span>
          <input
            value={numeroMatricula}
            onChange={(evento) => setNumeroMatricula(evento.target.value)}
            maxLength={20}
            disabled={enviando}
            placeholder="Ex.: 2026001"
          />
        </label>

        <label className="formulario-aluno__campo">
          <span>Data de nascimento *</span>
          <input
            type="date"
            value={dataNascimento}
            onChange={(evento) => setDataNascimento(evento.target.value)}
            disabled={enviando}
          />
        </label>

        <label className="formulario-aluno__campo">
          <span>CPF</span>
          <input
            value={cpfAluno}
            onChange={(evento) => setCpfAluno(evento.target.value)}
            disabled={enviando}
            placeholder="Opcional"
          />
        </label>

        <label className="formulario-aluno__campo">
          <span>Situação</span>
          <select
            value={situacao}
            onChange={(evento) => setSituacao(evento.target.value as SituacaoAluno)}
            disabled={enviando}
          >
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
            maxLength={13}
            disabled={enviando}
            placeholder="Opcional"
          />
        </label>

        <label className="formulario-aluno__campo">
          <span>E-mail</span>
          <input
            type="email"
            value={emailAluno}
            onChange={(evento) => setEmailAluno(evento.target.value)}
            maxLength={100}
            disabled={enviando}
            placeholder="Opcional"
          />
        </label>

        <label className="formulario-aluno__campo">
          <span>CEP</span>
          <input
            value={cepAluno}
            onChange={(evento) => setCepAluno(evento.target.value)}
            maxLength={9}
            disabled={enviando}
            placeholder="Opcional"
          />
        </label>

        <label className="formulario-aluno__campo formulario-aluno__campo--largo">
          <span>Endereço</span>
          <input
            value={enderecoAluno}
            onChange={(evento) => setEnderecoAluno(evento.target.value)}
            maxLength={200}
            disabled={enviando}
            placeholder="Opcional"
          />
        </label>

        {erro && (
          <p className="formulario-aluno__erro" role="alert">
            {erro}
          </p>
        )}

        <div className="formulario-aluno__acoes">
          <button
            type="button"
            className="formulario-aluno__botao-cancelar"
            onClick={cancelar}
            disabled={enviando}
          >
            Cancelar
          </button>
          <button type="submit" className="formulario-aluno__botao-salvar" disabled={enviando}>
            {enviando ? "Salvando..." : alunoEditando ? "Salvar alterações" : "Cadastrar aluno"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioAluno;
