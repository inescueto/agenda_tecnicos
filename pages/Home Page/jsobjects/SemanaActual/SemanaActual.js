export default {
  
  getSemana() {
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    const dias = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
    
    let semana = [];

    for (let i = 0; i < 7; i++) {
      let fecha = new Date(monday);
      fecha.setDate(monday.getDate() + i);

      semana.push({
        dia: dias[i],
        numero: fecha.getDate(),
        fechaISO: fecha.toISOString().split("T")[0]
      });
    }

    return semana;
  }

}
