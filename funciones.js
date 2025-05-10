// Función para verificar si localStorage está disponible
function checkLocalStorage() {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch (e) {
    console.error('localStorage no está disponible:', e);
    return false;
  }
}

// Inicializar variables
var dbVacas;
var operacion = "A"; // "A"=agregar; "E"=editar
var indice_selecionado = null; // Variable global para almacenar el índice seleccionado

// Cargar datos desde localStorage de manera segura
if (checkLocalStorage()) {
  dbVacas = localStorage.getItem("dbVacas");
  try {
    dbVacas = JSON.parse(dbVacas); // Convertir a objeto
  } catch (e) {
    console.error("Error al parsear dbVacas:", e);
    dbVacas = null;
  }
}

// Si no existe o hubo un error, creamos un array vacío
if (dbVacas === null) {
  dbVacas = [];
}

function Mensaje(t) {
  // Limpiar mensajes anteriores
  $(".mensaje-alerta").html("");
  
  switch (t) {
    case 1:
      $(".mensaje-alerta").append(
        "<div class='alert alert-success' role='alert'>Se agregó con éxito la vaca</div>"
      );
      break;
    case 2:
      $(".mensaje-alerta").append(
        "<div class='alert alert-danger' role='alert'>Se eliminó la vaca</div>"
      );
      break;
    case 3:
      $(".mensaje-alerta").append(
        "<div class='alert alert-info' role='alert'>Se actualizó la vaca</div>"
      );
      break;
    default:
  }
  
  // Hacer que el mensaje desaparezca después de 3 segundos
  setTimeout(function() {
    $(".mensaje-alerta").html("");
  }, 3000);
}

function AgregarVaca() {
  try {
    var datos_cliente = JSON.stringify({
      Nombre: $("#nombre").val(),
      Correo: $("#correo").val(),
      Peso: $("#peso").val(),
      Fecha_nacimiento: $("#fecha_nacimiento").val(),
      Pelaje: $("#pelaje").val() // Agregar el campo pelaje
    });

    dbVacas.push(datos_cliente); // Guardar datos en el array definido globalmente
    
    if (checkLocalStorage()) {
      localStorage.setItem("dbVacas", JSON.stringify(dbVacas));
    }

    ListarVacas();
    LimpiarFormulario(); // Limpiar el formulario después de agregar
    return Mensaje(1);
  } catch (e) {
    console.error("Error al agregar vaca:", e);
    alert("Error al agregar vaca. Revise la consola para más detalles.");
  }
}

function ListarVacas() {
  try {
    $("#dbVacas-list").html(
      "<thead>" +
      "<tr>" +
      "<th> ID </th>" +
      "<th> Nombre </th>" +
      "<th> Correo </th>" +
      "<th> Peso </th>" +
      "<th> Fecha Nacimiento </th>" +
      "<th> Pelaje </th>" +
      "<th> Información </th>" +
      "<th> </th>" +
      "<th>  </th>" +
      "</tr>" +
      "</thead>" +
      "<tbody>" +
      "</tbody>"
    );

    // Verificar si hay vacas para mostrar
    if (dbVacas.length === 0) {
      $("#dbVacas-list tbody").append("<tr><td colspan='9' class='text-center'>No tienes vacas</td></tr>");
      return;
    }

    for (var i = 0; i < dbVacas.length; i++) {
      try {
        var d = JSON.parse(dbVacas[i]);
        $("#dbVacas-list tbody").append(
          "<tr>" +
          "<td>" + i + "</td>" +
          "<td>" + d.Nombre + "</td>" +
          "<td>" + d.Correo + "</td>" +
          "<td>" + d.Peso + "</td>" +
          "<td>" + d.Fecha_nacimiento + "</td>" +
          "<td>" + d.Pelaje + "</td>" + // Mostrar pelaje
          "<td> <a href='javascript:void(0)' onclick='MostrarInformacion(" + i + ")'>Ver Info</a> </td>" +
          "<td> <a href='javascript:void(0)' onclick='PrepararEdicion(" + i + ")' class='btnEditar'> <span class='glyphicon glyphicon-pencil'> </span>  </a> </td>" +
          "<td> <a href='javascript:void(0)' onclick='ConfirmarEliminar(" + i + ")' class='btnEliminar'> <span class='glyphicon glyphicon-trash'> </span> </a> </td>" +
          "</tr>"
        );
      } catch (e) {
        console.error("Error al parsear elemento " + i + ":", e);
      }
    }
    
    // Mostrar número total de vacas
    $("#numeroVacas").html("<p>Total de vacas: " + dbVacas.length + "</p>");
  } catch (e) {
    console.error("Error al listar vacas:", e);
    $("#dbVacas-list").html("<div class='alert alert-danger'>Error al cargar la lista de vacas</div>");
  }
}

function MostrarInformacion(index) {
  try {
    var vacaItem = JSON.parse(dbVacas[index]);
    alert("Información de la Vaca:\n" +
      "Nombre: " + vacaItem.Nombre + "\n" +
      "Correo: " + vacaItem.Correo + "\n" +
      "Peso: " + vacaItem.Peso + " kg\n" +
      "Fecha de Nacimiento: " + vacaItem.Fecha_nacimiento + "\n" +
      "Pelaje: " + vacaItem.Pelaje); // Mostrar pelaje
  } catch (e) {
    console.error("Error al mostrar información:", e);
    alert("Error al mostrar información de la vaca");
  }
}

function PrepararEdicion(index) {
  try {
    operacion = "E";
    indice_selecionado = index;
    var vacaItem = JSON.parse(dbVacas[indice_selecionado]);
    $("#nombre").val(vacaItem.Nombre);
    $("#correo").val(vacaItem.Correo);
    $("#peso").val(vacaItem.Peso);
    $("#fecha_nacimiento").val(vacaItem.Fecha_nacimiento);
    $("#pelaje").val(vacaItem.Pelaje); // Llenar el campo pelaje
    $("#nombre").focus();
  } catch (e) {
    console.error("Error al preparar edición:", e);
    alert("Error al cargar datos para edición");
  }
}

function ConfirmarEliminar(index) {
  if (confirm("¿Estás seguro que deseas eliminar esta vaca?")) {
    Eliminar(index);
  }
}

function Eliminar(e) {
  try {
    dbVacas.splice(e, 1); // Args (posición en el array, número de items a eliminar)
    
    if (checkLocalStorage()) {
      localStorage.setItem("dbVacas", JSON.stringify(dbVacas));
    }
    
    ListarVacas();
    return Mensaje(2);
  } catch (err) {
    console.error("Error al eliminar:", err);
    alert("Error al eliminar la vaca");
  }
}

function Editar() {
  try {
    var datos_cliente = JSON.stringify({
      Nombre: $("#nombre").val(),
      Correo: $("#correo").val(),
      Peso: $("#peso").val(),
      Fecha_nacimiento: $("#fecha_nacimiento").val(),
      Pelaje: $("#pelaje").val()
    });

    dbVacas[indice_selecionado] = datos_cliente;
    
    if (checkLocalStorage()) {
      localStorage.setItem("dbVacas", JSON.stringify(dbVacas));
    }
    
    operacion = "A"; // Volver al modo agregar
    ListarVacas();
    LimpiarFormulario();
    return Mensaje(3);
  } catch (e) {
    console.error("Error al editar:", e);
    alert("Error al editar la vaca");
  }
}

function LimpiarFormulario() {
  $("#nombre").val('');
  $("#correo").val('');
  $("#peso").val('');
  $("#fecha_nacimiento").val('');
  $("#pelaje").val(''); // Limpiar el campo pelaje
}

function BuscarVaca() {
  try {
    var nombreBuscado = $("#buscar").val().toLowerCase();
    
    // Si no hay texto de búsqueda, mostrar todas las vacas
    if (nombreBuscado === '') {
      $("#dbVacas-list tbody tr").show();
      return;
    }
    
    $("#dbVacas-list tbody tr").each(function() {
      var nombreVaca = $(this).find("td:nth-child(2)").text().toLowerCase();
      if (nombreVaca.includes(nombreBuscado)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  } catch (e) {
    console.error("Error en búsqueda:", e);
  }
}

// Inicializar la lista de vacas
$(document).ready(function() {
  if (dbVacas.length !== 0) {
    ListarVacas();
  } else {
    $("#dbVacas-list").html("<div class='text-center'><h2>No tienes vacas</h2></div>");
  }

  // Esperar el evento de envío del formulario
  $("#vacas-form").on("submit", function(e) {
    e.preventDefault(); // Prevenir el envío del formulario
    
    if (operacion == "A") {
      AgregarVaca();
    } else {
      Editar();
    }
    
    return false;
  });
});
