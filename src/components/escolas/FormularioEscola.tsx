import { useRef, useState, type FormEvent } from "react";
import type { Escola, EscolaEntrada } from "../../types";
import "./FormularioEscola.css";

interface FormularioEscolaProps {
  escolaEditando?: Escola | null;

  salvar: (dados: EscolaEntrada) => Promise<void>;
  cancelar: () => void;
}

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FormularioEscola({ escolaEditando, salvar, cancelar }: FormularioEscolaProps) {
  const [nomeEscola, setNomeEscola] = useState(escolaEditando?.nomeEscola ?? "");
  const [codigoInep, setCodigoInep] = useState(escolaEditando?.codigoInep ?? "");
  const [cnpj, setCnpj] = useState(escolaEditando?.cnpj ?? "");
  const [redeEnsino, setRedeEnsino] = useState(escolaEditando?.redeEnsino ?? "");
  const [enderecoEscola, setEnderecoEscola] = useState(escolaEditando?.enderecoEscola ?? "");
  const [telefoneEscola, setTelefoneEscola] = useState(escolaEditando?.telefoneEscola ?? "");
  const [emailEscola, setEmailEscola] = useState(escolaEditando?.emailEscola ?? "");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const emEnvioRef = useRef(false);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (emEnvioRef.current) return;

    if (!nomeEscola.trim()) {
      setErro("O nome da escola é obrigatório.");
      return;
    }
    if (cnpj.length !== 14) {
      setErro("O CNPJ é obrigatório e deve ter 14 dígitos.");
      return;
    }
    if (emailEscola.trim() && !REGEX_EMAIL.test(emailEscola.trim())) {
      setErro("Informe um e-mail válido.");
      return;
    }

    emEnvioRef.current = true;
    setEnviando(true);
    setErro(null);
    try {
      await salvar({
        nomeEscola: nomeEscola.trim(),
        codigoInep: codigoInep.trim() || null,
        cnpj,
        redeEnsino: redeEnsino.trim() || null,
        enderecoEscola: enderecoEscola.trim() || null,
        telefoneEscola: telefoneEscola.trim() || null,
        emailEscola: emailEscola.trim() || null,
      });
      
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar a escola.");
    } finally {
      emEnvioRef.current = false;
      setEnviando(false);
    }
  }

  return (
    <section className="formulario-escola">
      <header className="formulario-escola__cabecalho">
        <h2>{escolaEditando ? "Editar Escola" : "Nova Escola"}</h2>
      </header>

      <form className="formulario-escola__form" onSubmit={handleSubmit} noValidate>
        {erro && (
          <p className="formulario-escola__erro" role="alert">
            {erro}
          </p>
        )}

        <label className="formulario-escola__campo formulario-escola__campo--largo">
          <span>Nome da escola *</span>
          <input
            value={nomeEscola}
            onChange={(evento) => setNomeEscola(evento.target.value)}
            maxLength={150}
            placeholder="Ex.: Escola Municipal Dom Pedro II"
            disabled={enviando}
          />
        </label>

        <label className="formulario-escola__campo">
          <span>Código INEP</span>
          <input
            value={codigoInep}
            onChange={(evento) => setCodigoInep(evento.target.value)}
            maxLength={8}
            placeholder="Opcional"
            disabled={enviando}
          />
        </label>

        <label className="formulario-escola__campo">
          <span>CNPJ *</span>
          <input
            value={cnpj}
            onChange={(evento) => setCnpj(evento.target.value.replace(/\D/g, "").slice(0, 14))}
            inputMode="numeric"
            maxLength={14}
            placeholder="14 dígitos, sem pontuação"
            disabled={enviando}
          />
        </label>

        <label className="formulario-escola__campo formulario-escola__campo--largo">
          <span>Rede de ensino</span>
          <input
            value={redeEnsino}
            onChange={(evento) => setRedeEnsino(evento.target.value)}
            list="redes-ensino"
            maxLength={50}
            placeholder="Opcional (ex.: Municipal, Estadual)"
            disabled={enviando}
          />
          <datalist id="redes-ensino">
            <option value="Municipal" />
            <option value="Estadual" />
            <option value="Federal" />
            <option value="Particular" />
          </datalist>
        </label>

        <label className="formulario-escola__campo formulario-escola__campo--largo">
          <span>Endereço</span>
          <input
            value={enderecoEscola}
            onChange={(evento) => setEnderecoEscola(evento.target.value)}
            maxLength={200}
            placeholder="Opcional"
            disabled={enviando}
          />
        </label>

        <label className="formulario-escola__campo">
          <span>Telefone</span>
          <input
            value={telefoneEscola}
            onChange={(evento) => setTelefoneEscola(evento.target.value)}
            maxLength={13}
            placeholder="Opcional"
            disabled={enviando}
          />
        </label>

        <label className="formulario-escola__campo">
          <span>E-mail</span>
          <input
            type="email"
            value={emailEscola}
            onChange={(evento) => setEmailEscola(evento.target.value)}
            maxLength={100}
            placeholder="Opcional"
            disabled={enviando}
          />
        </label>

        <div className="formulario-escola__acoes">
          <button
            type="button"
            className="formulario-escola__botao-cancelar"
            onClick={cancelar}
            disabled={enviando}
          >
            Cancelar
          </button>
          <button type="submit" className="formulario-escola__botao-salvar" disabled={enviando}>
            {enviando ? "Salvando..." : escolaEditando ? "Salvar alterações" : "Cadastrar escola"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioEscola;
