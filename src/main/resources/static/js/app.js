/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global apimock */
/* global apiclient */
var api = apiclient;

var app = (function () {
    var _nomAuthor;
    var _bpName;
    var _namePlano;

    //nombre del autor seleccionado
    var nombreAutor = function (author) {
        _nomAuthor = document.getElementById("autor").value;
        //alert(_nomAuthor);
    };

    var Gsuma = function (suma, bp) {
        return suma + bp.puntos;
    };
    // convierta sus elementos a objetos con sólo el nombre y el número de puntos.
    function convertirNombrePuntos(blues) {
        return {"name": blues.name, "puntos": blues.points.length};
    }

    // tome cada uno de estos elementos, y a través de jQuery agregue un elemento <tr> (con los respectvos <td>)
    function agregarElementoTabla(elem) {
        
        return "<tr><td>" + elem.name + "</td>\n\
             <td>" + elem.puntos + "</td>\n\
                <td><button type='button' onclick=\"app.dibujarPlanos(\'"+_nomAuthor+"\',\'"+ elem.name+"\')\">Open</button></td></tr>";
    }



    return{
        //ver autor seleccionado
        verAutor: function (author) {
            nombreAutor(author);
        },
        //actualizar listado segun autor seleccionado
        actualizarListadoPlanos: function (author) {
            if (_nomAuthor !== author) {
                app.verAutor(author);
                api.getBlueprintsByAuthor(author, function (bpname) {
                    // map convierta sus elementos a objetos con sólo el nombre y el número de puntos.
                    //_namePlano=document.getElementById("name");
                    var newbpname = bpname.map(convertirNombrePuntos);
                    var updatebpname = newbpname.map(agregarElementoTabla);
                    $("table tbody tr").remove();
                    $("table tbody").append(updatebpname);
                    //aplique un 'reduce' que calcule el número de puntos
                    $("#totalPuntos").text("Total user points: " + newbpname.reduce(Gsuma, 0));
                });
            }
        },
        crearBlueprintClick: function () {
            //calculo clicks realizados
            var canvas = document.getElementById('myCanvas');
            var ctx = canvas.getContext("2d");
            var client = canvas.getBoundingClientRect();
            //$("#titulo").text("¡¡ CREANDO UN NUEVO PLANO !!");
            ctx.beginPath();
            ctx.moveTo(0, 0);
            if (window.PointerEvent) {
                canvas.addEventListener("pointerdown", function (event) {
                    //alert('pointerdown at ' + (event.clientX - client.left) + ',' + (event.clientY - client.top));
                    ctx.lineTo(parseInt(event.clientX) - parseInt(client.left), parseInt(event.clientY) - parseInt(client.top));
                    ctx.stroke();
                });
            }
            ctx.closePath();
        },
        /*
        put: function () {
            alert('entro save');
            //apiclient.chainedPromises(_nomAuthor,_bpName,puntos  {
            apiclient.chainedPromises(_nomAuthor, function (bpname) {
                // map convierta sus elementos a objetos con sólo el nombre y el número de puntos.
                var newbpname = bpname.map(convertirNombrePuntos);
                var updatebpname = newbpname.map(agregarElementoTabla);
                $("table tbody tr").remove();
                $("table tbody").append(updatebpname);
                //aplique un 'reduce' que calcule el número de puntos
                $("#totalPuntos").text("Total user points: " + newbpname.reduce(Gsuma, 0));
                //apiclient.chainedPromises(_nomAuthor, _bpName,updatebpname);
            });
        
        },*/
        dibujarPlanos: function (author, namePlano) {
            api.getBlueprintsByNameAndAuthor(author, namePlano, function (blueprint) {
                _bpName = namePlano;
                $("#titulo").text("¡¡ CREANDO UN NUEVO PLANO !!");
                var canvas = document.getElementById('myCanvas');
                canvas.width = "500";
                var puntos = blueprint.points;
                var ax = 0;
                var ay = 0;
                var primera = true;
                var ctx = canvas.getContext("2d");
                ctx.beginPath();
                puntos.map(function (punto1) {
                    if (primera) {
                        ax = punto1.x;
                        ay = punto1.y;
                        primera = false;
                        ctx.moveTo(ax, ay);
                    } else {
                        ctx.lineTo(punto1.x, punto1.y);
                        ctx.stroke();
                    }
                });
                var client = canvas.getBoundingClientRect();
                if (window.PointerEvent) {
                    canvas.addEventListener("pointerdown", function (event) {
                        //alert('pointerdown at ' + (event.clientX - client.left) + ',' + (event.clientY - client.top));
                        ctx.lineTo(parseInt(event.clientX) - parseInt(client.left), parseInt(event.clientY) - parseInt(client.top));
                        ctx.stroke();
                    });
                }
                $("#titulo").text("Blueprints Draw: " + namePlano);
            });
        }

    };
})();