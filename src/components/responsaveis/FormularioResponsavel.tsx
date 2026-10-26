import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Responsavel, ResponsavelEntrada } from "../../types";
import {
  formatarCep,
  formatarCpf,
  formatarTelefone,
  limparCep,
  limparCpf,
  limparTelefone,
  validarCpf,
} from "../../utils/formatadores";
import "./FormularioResponsavel.css";

interface FormularioResponsavelProps {
  responsavelEditando?: Responsavel | null;
  salvar: (dados: ResponsavelEntrada) => Promise<void>;
  cancelar: () => void;
}

function FormularioResponsavel({
  responsavelEditando,
  salvar,
  cancelar,
}: FormularioResponsavelProps) {
  const [nomeResp, setNomeResp] = useState(responsavelEditando?.nomeResp ?? "");
  const [cpfResp, setCpfResp] = useState(formatarCpf(responsavelEditando?.cpfResp ?? ""));
  const [telefoneResp, setTelefoneResp] = useState(formatarTelefone(responsavelEditando?.telefoneResp ?? ""));
  const [emailResp, setEmailResp] = useState(responsavelEditando?.emailResp ?? "");
  const [cepResp, setCepResp] = useState(formatarCep(responsavelEditando?.cepResp ?? ""));
  const [enderecoResp, setEnderecoResp] = useState(responsavelEditando?.enderecoResp ?? "");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const emEnvioRef = useRef(false);

  useEffect(() => {
    setNomeResp(responsavelEditando?.nomeResp ?? "");
    setCpfResp(formatarCpf(responsavelEditando?.cpfResp ?? ""));
    setTelefoneResp(formatarTelefone(responsavelEditando?.telefoneResp ?? ""));
    setEmailResp(responsavelEditando?.emailResp ?? "");
    setCepResp(formatarCep(responsavelEditando?.cepResp ?? ""));
    setEnderecoResp(responsavelEditando?.enderecoResp ?? "");
    setErro(null);
  }, [responsavelEditando]);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (emEnvioRef.current) return;

    if (!nomeResp.trim()) {
      setErro("O nome do responsável é obrigatório.");
      return;
    }

    const cpfDigitos = limparCpf(cpfResp);
    if (cpfResp.trim()) {
      if (cpfDigitos.length !== 11) {
        setErro("O CPF deve conter exatamente 11 dígitos.");
        return;
      }
      if (!validarCpf(cpfDigitos)) {
        setErro("CPF inválido. Verifique os números digitados.");
        return;
      }
    }

    const cepDigitos = limparCep(cepResp);
    if (cepResp.trim() && cepDigitos.length !== 8) {
      setErro("O CEP deve conter exatamente 8 dígitos.");
      return;
    }

    const telDigitos = limparTelefone(telefoneResp);
    if (telefoneResp.trim() && ![10, 11].includes(telDigitos.length)) {
      setErro("O telefone deve ter DDD + número (10 ou 11 dígitos).");
      return;
    }

    emEnvioRef.current = true;
    setEnviando(true);
    setErro(null);

    try {
      await salvar({
        nomeResp: nomeResp.trim(),
        cpfResp: cpfResp.trim() ? cpfDigitos : null,
        telefoneResp: telefoneResp.trim() ? telDigitos : null,
        emailResp: emailResp.trim() || null,
        cepResp: cepResp.trim() ? cepDigitos : null,
        enderecoResp: enderecoResp.trim() || null,
      });
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar o responsável.");
    } finally {
      emEnvioRef.current = false;
      setEnviando(false);
    }
  }

  return (
    <section className="formulario-responsavel">
      <header className="formulario-responsavel__cabecalho">
        <h2>{responsavelEditando ? "Editar Responsável" : "Novo Responsável"}</h2>
      </header>

      <form className="formulario-responsavel__form" onSubmit={handleSubmit} noValidate>
        <label className="formulario-responsavel__campo formulario-responsavel__campo--largo">
          <span>Nome completo *</span>
          <input
            value={nomeResp}
            onChange={(evento) => {
              setNomeResp(evento.target.value);
              setErro(null);
            }}
            maxLength={100}
            disabled={enviando}
            placeholder="Ex.: Maria da Silva Rocha"
            autoFocus
          />
        </label>

        <label className="formulario-responsavel__campo">
          <span>CPF</span>
          <input
            value={cpfResp}
            onChange={(evento) => {
              setCpfResp(formatarCpf(evento.target.value));
              setErro(null);
            }}
            maxLength={14}
            disabled={enviando}
            placeholder="000.000.000-00"
            inputMode="numeric"
          />
        </label>

        <label className="formulario-responsavel__campo">
          <span>Telefone</span>
          <input
            value={telefoneResp}
            onChange={(evento) => {
              setTelefoneResp(formatarTelefone(evento.target.value));
              setErro(null);
            }}
            maxLength={15}
            disabled={enviando}
            placeholder="(86) 99999-0000"
            inputMode="tel"
          />
        </label>

        <label className="formulario-responsavel__campo">
          <span>E-mail</span>
          <input
            type="email"
            value={emailResp}
            onChange={(evento) => {
              setEmailResp(evento.target.value);
              setErro(null);
            }}
            maxLength={100}
            disabled={enviando}
            placeholder="nome@email.com"
          />
        </label>

        <label className="formulario-responsavel__campo">
          <span>CEP</span>
          <input
            value={cepResp}
            onChange={(evento) => {
              setCepResp(formatarCep(evento.target.value));
              setErro(null);
            }}
            maxLength={9}
            disabled={enviando}
            placeholder="64000-000"
            inputMode="numeric"
          />
        </label>

        <label className="formulario-responsavel__campo formulario-responsavel__campo--largo">
          <span>Endereço</span>
          <input
            value={enderecoResp}
            onChange={(evento) => {
              setEnderecoResp(evento.target.value);
              setErro(null);
            }}
            maxLength={200}
            disabled={enviando}
            placeholder="Rua, número — bairro, cidade/UF"
          />
        </label>

        {erro && (
          <p className="formulario-responsavel__erro" role="alert">
            {erro}
          </p>
        )}

        <div className="formulario-responsavel__acoes">
          <button
            type="button"
            className="formulario-responsavel__botao-cancelar"
            onClick={cancelar}
            disabled={enviando}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="formulario-responsavel__botao-salvar"
            disabled={enviando}
          >
            {enviando
              ? "Salvando..."
              : responsavelEditando
                ? "Salvar alterações"
                : "Cadastrar responsável"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioResponsavel;