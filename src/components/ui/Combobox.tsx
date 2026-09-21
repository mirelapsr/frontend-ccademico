import { useState, useRef, useEffect, useMemo, type ChangeEvent, type MouseEvent } from "react";
import "./Combobox.css";

export interface OpcaoCombobox {
  valor: number | string;
  rotulo: string;
  subrotulo?: string; // Ex: Número de matrícula, CPF ou parentesco
}

export interface ComboboxProps {
  opcoes: OpcaoCombobox[];
  valorSelecionado?: number | string;
  onSelecionar: (valor: any) => void;
  placeholder?: string;
  rotulo?: string;
  obrigatorio?: boolean;
  desabilitado?: boolean;
  erro?: string;
}

export default function Combobox({
  opcoes,
  valorSelecionado,
  onSelecionar,
  placeholder = "Selecione...",
  rotulo,
  obrigatorio = false,
  desabilitado = false,
  erro,
}: ComboboxProps) {
  const [aberto, setAberto] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Normaliza string ignorando maiúsculas/minúsculas e acentuações
  const normalizar = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // Encontra a opção atualmente selecionada
  const opcaoAtual = useMemo(() => {
    return opcoes.find((op) => op.valor === valorSelecionado);
  }, [opcoes, valorSelecionado]);

  // Sincroniza o input com o rótulo da opção selecionada
  useEffect(() => {
    if (opcaoAtual) {
      setTermoBusca(opcaoAtual.rotulo);
    } else if (valorSelecionado === undefined || valorSelecionado === "" || valorSelecionado === 0) {
      setTermoBusca("");
    }
  }, [opcaoAtual, valorSelecionado]);

  // Filtra as opções em tempo real (rótulo ou subtitulo)
  const opcoesFiltradas = useMemo(() => {
    if (!aberto || (opcaoAtual && termoBusca === opcaoAtual.rotulo)) {
      return opcoes;
    }
    const buscaNorm = normalizar(termoBusca);
    return opcoes.filter((op) => {
      const rotuloNorm = normalizar(op.rotulo);
      const subrotuloNorm = op.subrotulo ? normalizar(op.subrotulo) : "";
      return rotuloNorm.includes(buscaNorm) || subrotuloNorm.includes(buscaNorm);
    });
  }, [opcoes, termoBusca, aberto, opcaoAtual]);

  // Fecha o menu ao clicar fora e restaura o valor anterior se nada foi selecionado
  useEffect(() => {
    function handleClickFora(event: globalThis.MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setAberto(false);
        if (opcaoAtual) {
          setTermoBusca(opcaoAtual.rotulo);
        } else {
          setTermoBusca("");
        }
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => {
      document.removeEventListener("mousedown", handleClickFora);
    };
  }, [opcaoAtual]);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setTermoBusca(e.target.value);
    if (!aberto) setAberto(true);
  }

  function handleSelecionarOpcao(op: OpcaoCombobox) {
    setTermoBusca(op.rotulo);
    setAberto(false);
    onSelecionar(op.valor);
  }

  function handleLimpar(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setTermoBusca("");
    onSelecionar("");
    setAberto(false);
  }

  return (
    <div className="combobox" ref={containerRef}>
      {rotulo && (
        <label className="combobox__label">
          {rotulo} {obrigatorio && <span className="combobox__obrigatorio">*</span>}
        </label>
      )}
      <div
        className={`combobox__control ${aberto ? "combobox__control--aberto" : ""} ${
          desabilitado ? "combobox__control--desabilitado" : ""
        } ${erro ? "combobox__control--erro" : ""}`}
        onClick={() => {
          if (!desabilitado) setAberto(true);
        }}
      >
        <input
          type="text"
          className="combobox__input"
          placeholder={placeholder}
          value={termoBusca}
          onChange={handleInputChange}
          onFocus={() => {
            if (!desabilitado) setAberto(true);
          }}
          disabled={desabilitado}
        />
        <div className="combobox__acoes">
          {termoBusca && !desabilitado && (
            <button
              type="button"
              className="combobox__botao-limpar"
              onClick={handleLimpar}
              aria-label="Limpar seleção"
            >
              ×
            </button>
          )}
          <span className={`combobox__chevron ${aberto ? "combobox__chevron--girado" : ""}`}>
            ▼
          </span>
        </div>
      </div>

      {aberto && !desabilitado && (
        <ul className="combobox__dropdown">
          {opcoesFiltradas.length > 0 ? (
            opcoesFiltradas.map((op) => (
              <li
                key={op.valor}
                className={`combobox__item ${op.valor === valorSelecionado ? "combobox__item--selecionado" : ""}`}
                onClick={() => handleSelecionarOpcao(op)}
              >
                <span className="combobox__item-rotulo">{op.rotulo}</span>
                {op.subrotulo && <span className="combobox__item-subrotulo">{op.subrotulo}</span>}
              </li>
            ))
          ) : (
            <li className="combobox__vazio">Nenhum resultado encontrado</li>
          )}
        </ul>
      )}

      {erro && <span className="combobox__mensagem-erro">{erro}</span>}
    </div>
  );
}