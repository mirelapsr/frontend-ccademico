import { useState, type FormEvent } from "react";
import type { Responsavel, ResponsavelEntrada } from "../../types";
import { limparCpf } from "../../utils/formatadores";
import "./FormularioResponsavel.css";

interface FormularioResponsavelProps {
  responsavelEditando?: Responsavel | null;
  salvar: (dados: ResponsavelEntrada) => void;
  cancelar: () => void;
}

function FormularioResponsavel({
  responsavelEditando,
  salvar,
  cancelar,
}: FormularioResponsavelProps) {
  const [nomeResp, setNomeResp] = useState(responsavelEditando?.nomeResp ?? "");
  const [cpfResp, setCpfResp] = useState(responsavelEditando?.cpfResp ?? "");
  const [telefoneResp, setTelefoneResp] = useState(responsavelEditando?.telefoneResp ?? "");
  const [emailResp, setEmailResp] = useState(responsavelEditando?.emailResp ?? "");
  const [cepResp, setCepResp] = useState(responsavelEditando?.cepResp ?? "");
  const [enderecoResp, setEnderecoResp] = useState(responsavelEditando?.enderecoResp ?? "");
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!nomeResp.trim()) {
      setErro("O nome do responsável é obrigatório.");
      return;
    }

    const cpfDigitos = cpfResp.trim() ? limparCpf(cpfResp) : "";
    if (cpfDigitos && cpfDigitos.length !== 11) {
      setErro("O CPF deve ter 11 dígitos.");
      return;
    }

    setErro(null);
    salvar({
      nomeResp: nomeResp.trim(),
      cpfResp: cpfDigitos || null,
      telefoneResp: telefoneResp.trim() || null,
      emailResp: emailResp.trim() || null,
      cepResp: cepResp.trim() || null,
      enderecoResp: enderecoResp.trim() || null,
    });
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
            onChange={(evento) => setNomeResp(evento.target.value)}
            placeholder="Ex.: Maria da Silva Rocha"
          />
        </label>

        <label className="formulario-responsavel__campo">
          <span>CPF</span>
          <input
            value={cpfResp}
            onChange={(evento) => setCpfResp(evento.target.value)}
            placeholder="000.000.000-00"
            inputMode="numeric"
          />
        </label>

        <label className="formulario-responsavel__campo">
          <span>Telefone</span>
          <input
            value={telefoneResp}
            onChange={(evento) => setTelefoneResp(evento.target.value)}
            placeholder="86 99999-0000"
          />
        </label>

        <label className="formulario-responsavel__campo">
          <span>E-mail</span>
          <input
            type="email"
            value={emailResp}
            onChange={(evento) => setEmailResp(evento.target.value)}
            placeholder="nome@email.com"
          />
        </label>

        <label className="formulario-responsavel__campo">
          <span>CEP</span>
          <input
            value={cepResp}
            onChange={(evento) => setCepResp(evento.target.value)}
            placeholder="64000-000"
          />
        </label>

        <label className="formulario-responsavel__campo formulario-responsavel__campo--largo">
          <span>Endereço</span>
          <input
            value={enderecoResp}
            onChange={(evento) => setEnderecoResp(evento.target.value)}
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
          >
            Cancelar
          </button>
          <button type="submit" className="formulario-responsavel__botao-salvar">
            {responsavelEditando ? "Salvar alterações" : "Cadastrar responsável"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioResponsavel;
