var dbVacas = localStorage.getItem("dbVacas");
var operacion = "A"; // "A"=agregar; "E"=editar
dbVacas = JSON.parse(dbVacas); // Convertir a objeto
if (dbVacas === null) // Si no existe, creamos un array vacío.
    dbVacas = [];

var indice_selecionado = null; // Variable global para almacenar el índice seleccionado

function Mensaje(t) {
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
        default:
    }
}

function AgregarVaca() {
    var datos_cliente = JSON.stringify({
        Nombre: $("#nombre").val(),
        Correo: $("#correo").val(),
        Peso: $("#peso").val(),
        Fecha_nacimiento: $("#fecha_nacimiento").val(),
        Edad: $("#edad").val(),
        Pelaje: $("#pelaje").val() // Agregar el campo pelaje
    });

    dbVacas.push(datos_cliente); // Guardar datos en el array definido globalmente
    localStorage.setItem("dbVacas", JSON.stringify(dbVacas));

    ListarVacas();
    LimpiarFormulario(); // Limpiar el formulario después de agregar
    return Mensaje(1);
}

function ListarVacas() {
    $("#dbVacas-list").html(
        "<thead>" +
        "<tr>" +
        "<th> ID </th>" +
        "<th> Nombre </th>" +
        "<th> Correo </th>" +
        "<th> Peso </th>" +
        "<th> Fecha Nacimiento </th>" +
        "<th> Edad </th>" +
        "<th> Pelaje </th>" +
        "<th> Información </th>" +
        "<th> </th>" +
        "<th>  </th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>" +
        "</tbody>"
    );

    for (var i in dbVacas) {
        var d = JSON.parse(dbVacas[i]);
        $("#dbVacas-list tbody").append(
            "<tr>" +
            "<td>" + i + "</td>" +
            "<td>" + d.Nombre + "</td>" +
            "<td>" + d.Correo + "</td>" +
            "<td>" + d.Peso + "</td>" +
            "<td>" + d.Fecha_nacimiento + "</td>" +
            "<td>" + d.Pelaje + "</td>" + // Mostrar pelaje
            "<td> <a href='#' onclick='MostrarInformacion(" + i + ")'>Ver Info</a> </td>" +
            "<td> <a id='" + i + "' class='btnEditar' href='#'> <span class='glyphicon glyphicon-pencil'> </span>  </a> </td>" +
            "<td> <a id='" + i + "' class='btnEliminar' href='#'> <span class='glyphicon glyphicon-trash'> </span> </a> </td>" +
            "</tr>"
        );
    }

    // Reasignar eventos después de listar
    $(".btnEliminar").unbind("click").bind("click", function () {
        alert("¿Me quieres eliminar?");
        indice_selecionado = $(this).attr("id");
        Eliminar(indice_selecionado); // Eliminamos el elemento llamando la función de eliminar
        ListarVacas();
    });

    $(".btnEditar").unbind("click").bind("click", function () {
        alert("¿Me quieres editar?");
        operacion = "E";
        indice_selecionado = $(this).attr("id");
        var vacaItem = JSON.parse(dbVacas[indice_selecionado]);
        $("#nombre").val(vacaItem.Nombre);
        $("#correo").val(vacaItem.Correo);
        $("#peso").val(vacaItem.Peso);
        $("#fecha_nacimiento").val(vacaItem.Fecha_nacimiento);
        $("#edad").val(vacaItem.Edad);
        $("#pelaje").val(vacaItem.Pelaje); // Llenar el campo pelaje
        $("#nombre").focus();
    });
}

function MostrarInformacion(index) {
    var vacaItem = JSON.parse(dbVacas[index]);
    alert("Información de la Vaca:\n" +
        "Nombre: " + vacaItem.Nombre + "\n" +
        "Correo: " + vacaItem.Correo + "\n" +
        "Peso: " + vacaItem.Peso + " kg\n" +
        "Fecha de Nacimiento: " + vacaItem.Fecha_nacimiento + "\n" +
          "Edad: " + vacaItem.Edad + " años\n" +
        "Pelaje: " + vacaItem.Pelaje); // Mostrar pelaje
}

function Eliminar(e) {
    dbVacas.splice(e, 1); // Args (posición en el array, número de items a eliminar)
    localStorage.setItem("dbVacas", JSON.stringify(dbVacas));
    return Mensaje(2);
}

function LimpiarFormulario() {
    $("#nombre").val('');
    $("#correo").val('');
    $("#peso").val('');
    $("#fecha_nacimiento").val('');
    $("#edad").val('');
    $("#pelaje").val(''); // Limpiar el campo pelaje
}

function BuscarVaca() {
    var nombreBuscado = $("#buscar").val().toLowerCase();
    $("#dbVacas-list tbody tr").each(function () {
        var nombreVaca = $(this).find("td:nth-child(2)").text().toLowerCase();
        if (nombreVaca.includes(nombreBuscado)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

// Inicializar la lista de vacas
if (dbVacas.length !== 0) {
    ListarVacas();
} else {
    $("#dbVacas-list").append("<h2>No tienes vacas</h2>");
}

// Esperar el evento de envío del formulario !!
$("#vacas-form").bind("submit", function () {
    AgregarVaca();
    return false; // Prevenir el envío del formulario
});
