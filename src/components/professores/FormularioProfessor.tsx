import { useRef, useState, type FormEvent } from "react";
import type { Escola, Professor, ProfessorEntrada, SituacaoProfessor } from "../../types";
import {
  formatarCep,
  formatarCpf,
  formatarTelefone,
  limparCep,
  limparCpf,
  limparTelefone,
  validarCpf,
} from "../../utils/formatadores";
import "./FormularioProfessor.css";

interface FormularioProfessorProps {
  professorEditando?: Professor | null;
  escolas: Escola[];
  salvar: (dados: ProfessorEntrada) => Promise<void>;
  cancelar: () => void;
}

function FormularioProfessor({
  professorEditando,
  escolas,
  salvar,
  cancelar,
}: FormularioProfessorProps) {
  const [nomeProf, setNomeProf] = useState(professorEditando?.nomeProf ?? "");
  const [cpfProf, setCpfProf] = useState(formatarCpf(professorEditando?.cpfProf ?? ""));
  const [telefoneProf, setTelefoneProf] = useState(formatarTelefone(professorEditando?.telefoneProf ?? ""));
  const [emailProf, setEmailProf] = useState(professorEditando?.emailProf ?? "");
  const [cepProf, setCepProf] = useState(formatarCep(professorEditando?.cepProf ?? ""));
  const [enderecoProf, setEnderecoProf] = useState(professorEditando?.enderecoProf ?? "");
  const [situacao, setSituacao] = useState<SituacaoProfessor>(
    professorEditando?.situacao ?? "Ativo"
  );
  const [escolaId, setEscolaId] = useState(
    professorEditando?.escolaId ?? escolas[0]?.idEscola ?? 0
  );
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const emEnvioRef = useRef(false);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (emEnvioRef.current) return;

    if (!nomeProf.trim() || !escolaId) {
      setErro("Nome e escola são obrigatórios.");
      return;
    }

    const cpfDigitos = limparCpf(cpfProf);
    if (cpfProf.trim()) {
      if (cpfDigitos.length !== 11) {
        setErro("O CPF deve conter exatamente 11 dígitos.");
        return;
      }
      if (!validarCpf(cpfDigitos)) {
        setErro("CPF inválido. Verifique os números digitados.");
        return;
      }
    }

    const cepDigitos = limparCep(cepProf);
    if (cepProf.trim() && cepDigitos.length !== 8) {
      setErro("O CEP deve conter exatamente 8 dígitos.");
      return;
    }

    const telDigitos = limparTelefone(telefoneProf);
    if (telefoneProf.trim() && ![10, 11].includes(telDigitos.length)) {
      setErro("O telefone deve ter DDD + número (10 ou 11 dígitos).");
      return;
    }

    emEnvioRef.current = true;
    setEnviando(true);
    setErro(null);
    try {
      await salvar({
        nomeProf: nomeProf.trim(),
        cpfProf: cpfProf.trim() ? cpfDigitos : null,
        telefoneProf: telefoneProf.trim() ? telDigitos : null,
        emailProf: emailProf.trim() || null,
        cepProf: cepProf.trim() ? cepDigitos : null,
        enderecoProf: enderecoProf.trim() || null,
        situacao,
        escolaId: Number(escolaId),
      });
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar o professor.");
    } finally {
      emEnvioRef.current = false;
      setEnviando(false);
    }
  }

  return (
    <section className="formulario-professor">
      <header className="formulario-professor__cabecalho">
        <h2>{professorEditando ? "Editar Professor" : "Novo Professor"}</h2>
      </header>

      <form className="formulario-professor__form" onSubmit={handleSubmit} noValidate>
        {erro && (
          <p className="formulario-professor__erro" role="alert">
            {erro}
          </p>
        )}

        <label className="formulario-professor__campo formulario-professor__campo--largo">
          <span>Nome completo *</span>
          <input
            value={nomeProf}
            onChange={(evento) => {
              setNomeProf(evento.target.value);
              setErro(null);
            }}
            maxLength={100}
            disabled={enviando}
            placeholder="Ex.: Maria da Silva Rocha"
          />
        </label>

        <label className="formulario-professor__campo">
          <span>CPF</span>
          <input
            value={cpfProf}
            onChange={(evento) => {
              setCpfProf(formatarCpf(evento.target.value));
              setErro(null);
            }}
            maxLength={14}
            disabled={enviando}
            placeholder="000.000.000-00"
            inputMode="numeric"
          />
        </label>

        <label className="formulario-professor__campo">
          <span>Telefone</span>
          <input
            value={telefoneProf}
            onChange={(evento) => {
              setTelefoneProf(formatarTelefone(evento.target.value));
              setErro(null);
            }}
            maxLength={15}
            disabled={enviando}
            placeholder="(86) 99999-0000"
            inputMode="tel"
          />
        </label>

        <label className="formulario-professor__campo">
          <span>E-mail</span>
          <input
            type="email"
            value={emailProf}
            onChange={(evento) => {
              setEmailProf(evento.target.value);
              setErro(null);
            }}
            maxLength={100}
            disabled={enviando}
            placeholder="nome@escola.edu.br"
          />
        </label>

        <label className="formulario-professor__campo">
          <span>CEP</span>
          <input
            value={cepProf}
            onChange={(evento) => {
              setCepProf(formatarCep(evento.target.value));
              setErro(null);
            }}
            maxLength={9}
            disabled={enviando}
            placeholder="64000-000"
            inputMode="numeric"
          />
        </label>

        <label className="formulario-professor__campo formulario-professor__campo--largo">
          <span>Endereço</span>
          <input
            value={enderecoProf}
            onChange={(evento) => {
              setEnderecoProf(evento.target.value);
              setErro(null);
            }}
            maxLength={200}
            disabled={enviando}
            placeholder="Rua, número — bairro, cidade/UF"
          />
        </label>

        <label className="formulario-professor__campo">
          <span>Situação *</span>
          <select
            value={situacao}
            onChange={(evento) => setSituacao(evento.target.value as SituacaoProfessor)}
            disabled={enviando}
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
        </label>

        <label className="formulario-professor__campo">
          <span>Escola *</span>
          <select
            value={escolaId}
            onChange={(evento) => setEscolaId(Number(evento.target.value))}
            disabled={enviando}
          >
            {escolas.length === 0 && <option value={0}>Nenhuma escola cadastrada</option>}
            {escolas.map((escola) => (
              <option key={escola.idEscola} value={escola.idEscola}>
                {escola.nomeEscola}
              </option>
            ))}
          </select>
        </label>

        <div className="formulario-professor__acoes">
          <button
            type="button"
            className="formulario-professor__botao-cancelar"
            onClick={cancelar}
            disabled={enviando}
          >
            Cancelar
          </button>
          <button type="submit" className="formulario-professor__botao-salvar" disabled={enviando}>
            {enviando ? "Salvando..." : professorEditando ? "Salvar alterações" : "Cadastrar professor"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioProfessor;