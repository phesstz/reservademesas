import { useEffect, useState } from "react";
import "./reserva.css";

export default function Reserva() {
  const [mesas, setMesas] = useState([]);
  const [numeroMesa, setNumeroMesa] = useState("");
  const [horario, setHorario] = useState("almoco");
  const [cliente, setCliente] = useState("");
  const [pessoas, setPessoas] = useState(2);
  const [mensagem, setMensagem] = useState("");
  const [confirmada, setConfirmada] = useState(null);

  // 🔹 Buscar mesas no servidor
  useEffect(() => {
    fetch("http://localhost:3000/api/mesas")
      .then((res) => res.json())
      .then(setMesas)
      .catch(() => setMensagem("Erro ao carregar mesas"));
  }, []);

  // 🔹 Fazer reserva
  const reservarMesa = async () => {
    setMensagem("");
    try {
      const res = await fetch("http://localhost:3000/api/reservar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero: Number(numeroMesa),
          horario,
          cliente,
          pessoas: Number(pessoas),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensagem(data.mensagem || "Erro ao reservar");
        return;
      }

      setConfirmada(data.reserva);
      setMensagem(data.mensagem);
    } catch (err) {
      setMensagem("Erro de conexão com o servidor");
    }
  };

  // 🔹 Cancelar reserva localmente (não remove do servidor)
  const cancelar = () => {
    setConfirmada(null);
    setMensagem("");
  };

  return (
    <div className="container">
      <div className="form-section">
        <h1 className="titulo">Reserva de Mesas 🍽</h1>

        {!confirmada ? (
          <>
            <div className="campo">
              <label>Nome do Cliente</label>
              <input
                type="text"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Digite seu nome"
              />
            </div>

            <div className="campo">
              <label>Mesa</label>
              <select
                value={numeroMesa}
                onChange={(e) => setNumeroMesa(e.target.value)}
              >
                <option value="">Selecione uma mesa</option>
                {mesas.map((m) => (
                  <option key={m.numero} value={m.numero}>
                    Mesa {m.numero}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo">
              <label>Horário</label>
              <select
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
              >
                <option value="almoco">Almoço</option>
                <option value="jantar">Jantar</option>
              </select>
            </div>

            <div className="campo">
              <label>Pessoas</label>
              <select
                value={pessoas}
                onChange={(e) => setPessoas(e.target.value)}
              >
                {[1, 2, 3, 4].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <button onClick={reservarMesa} className="btn">
              Reservar
            </button>
            {mensagem && <p>{mensagem}</p>}
          </>
        ) : (
          <div className="confirmacao">
            <h2>Reserva Confirmada 🎉</h2>
            <p><b>Cliente:</b> {confirmada.cliente}</p>
            <p><b>Mesa:</b> {confirmada.horario === "almoco" ? "Almoço" : "Jantar"} - Mesa {numeroMesa}</p>
            <p><b>Pessoas:</b> {confirmada.pessoas}</p>
            <button onClick={cancelar} className="btn cancelar">
              Cancelar Reserva
            </button>
          </div>
        )}
      </div>

      <div className="imagem-section">
        {!confirmada ? (
          <>
            <h2>Faça sua reserva</h2>
            <img
              src="https://cdn-icons-png.flaticon.com/512/706/706195.png"
              alt="Reservar mesa"
            />
          </>
        ) : (
          <>
            <h2>Reserva Confirmada</h2>
            <img
              src="https://cdn-icons-png.flaticon.com/512/706/706205.png"
              alt="Reserva confirmada"
            />
          </>
        )}
      </div>
    </div>
  );
}