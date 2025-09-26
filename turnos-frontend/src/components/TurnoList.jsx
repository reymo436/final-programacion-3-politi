function TurnoList({ turnos, onDeleteTurno, onEditTurno }) {
  return (
    <ul>
      {turnos.map((turno) => (
        <li key={turno.id} style={{ marginBottom: "10px" }}>
          <strong>{turno.nombre_cliente}</strong>
          ({turno.fecha} {turno.hora}) – Estado: {turno.estado}
          <div style={{ marginTop: "5px" }}>
            <button onClick={() => onEditTurno(turno)}>Editar</button>
            <button
              onClick={() => onDeleteTurno(turno.id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Eliminar
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TurnoList;
