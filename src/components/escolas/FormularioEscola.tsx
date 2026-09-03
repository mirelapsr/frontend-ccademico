import { useState, type FormEvent } from "react";
import type { Escola, EscolaEntrada } from "../../types";
import "./FormularioEscola.css";

interface FormularioEscolaProps {
  escolaEditando?: Escola | null;
  salvar: (dados: EscolaEntrada) => void;
  cancelar: () => void;
}

function FormularioEscola({ escolaEditando, salvar, cancelar }: FormularioEscolaProps) {
  const [nomeEscola, setNomeEscola] = useState(escolaEditando?.nomeEscola ?? "");
  const [codigoInep, setCodigoInep] = useState(escolaEditando?.codigoInep ?? "");
  const [cnpj, setCnpj] = useState(escolaEditando?.cnpj ?? "");
  const [enderecoEscola, setEnderecoEscola] = useState(escolaEditando?.enderecoEscola ?? "");
  const [telefoneEscola, setTelefoneEscola] = useState(escolaEditando?.telefoneEscola ?? "");
  const [emailEscola, setEmailEscola] = useState(escolaEditando?.emailEscola ?? "");
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!nomeEscola.trim()) {
      setErro("O nome da escola é obrigatório.");
      return;
    }

    setErro(null);
    salvar({
      nomeEscola: nomeEscola.trim(),
      codigoInep: codigoInep.trim() || null,
      cnpj: cnpj.trim() || null,
      enderecoEscola: enderecoEscola.trim() || null,
      telefoneEscola: telefoneEscola.trim() || null,
      emailEscola: emailEscola.trim() || null,
    });
  }

  return (
    <section className="formulario-escola">
      <header className="formulario-escola__cabecalho">
        <h2>{escolaEditando ? "Editar Escola" : "Nova Escola"}</h2>
      </header>

      <form className="formulario-escola__form" onSubmit={handleSubmit} noValidate>
        <label className="formulario-escola__campo formulario-escola__campo--largo">
          <span>Nome da escola *</span>
          <input
            value={nomeEscola}
            onChange={(evento) => setNomeEscola(evento.target.value)}
            placeholder="Ex.: Escola Municipal Dom Pedro II"
          />
        </label>

        <label className="formulario-escola__campo">
          <span>Código INEP</span>
          <input
            value={codigoInep}
            onChange={(evento) => setCodigoInep(evento.target.value)}
            maxLength={8}
            placeholder="Opcional"
          />
        </label>

        <label className="formulario-escola__campo">
          <span>CNPJ</span>
          <input
            value={cnpj}
            onChange={(evento) => setCnpj(evento.target.value)}
            maxLength={14}
            placeholder="Opcional"
          />
        </label>

        <label className="formulario-escola__campo formulario-escola__campo--largo">
          <span>Endereço</span>
          <input
            value={enderecoEscola}
            onChange={(evento) => setEnderecoEscola(evento.target.value)}
            placeholder="Opcional"
          />
        </label>

        <label className="formulario-escola__campo">
          <span>Telefone</span>
          <input
            value={telefoneEscola}
            onChange={(evento) => setTelefoneEscola(evento.target.value)}
            placeholder="Opcional"
          />
        </label>

        <label className="formulario-escola__campo">
          <span>E-mail</span>
          <input
            type="email"
            value={emailEscola}
            onChange={(evento) => setEmailEscola(evento.target.value)}
            placeholder="Opcional"
          />
        </label>

        {erro && (
          <p className="formulario-escola__erro" role="alert">
            {erro}
          </p>
        )}

        <div className="formulario-escola__acoes">
          <button
            type="button"
            className="formulario-escola__botao-cancelar"
            onClick={cancelar}
          >
            Cancelar
          </button>
          <button type="submit" className="formulario-escola__botao-salvar">
            {escolaEditando ? "Salvar alterações" : "Cadastrar escola"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioEscola;
