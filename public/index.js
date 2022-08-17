function handleSubmit() {
  const selectedRoom = document.getElementById("select_room").value;
  const username = document.getElementById("username").value;

  if (selectedRoom == "-1") {
    alert("Selecione uma sala valida!");
    return false;
  }

  if (username === "") {
    alert("Coloque um nome valido!");
    return false;
  }

  return true;
}
