//@author hcadavid
apiclient = (function () {
//PARA PROBAR EL EJEMPLO:
//-Analice qué hacen las funciones implementadas en el módulo, y revise cómo la función pública (invocada con el botón) las invoca 'secuencialmente'.
//-Use la aplicación (oprima el botón) y mire el resultado.
//-Cambie la función pública para que encadene las funciones a través de promesas.
//-Pruebe nuevamente el funcionamiento y analice por qué es diferente el resultado.
//-En la penúltima operación (GET), dañe la URL para que falle, y revise qué ocurre con la promesa final.
//private functions

    var request1Response = "";
    var request2Response = "";
    putForumPost = function (author, points, name) {
        var putPromise = $.ajax({
            url: "/blueprints/"+author+"/"+name+"/",
            type: 'PUT',
            data: points,
            contentType: "application/json"
        });
        putPromise.then(
                function () {
                    console.info("OK");
                },
                function () {
                    console.info("ERROR");
                }
        );
        return putPromise;
    };
    var getBlueprints = function (authname, callback) {

        var promise = $.get("/blueprints/"+ authname, callback);
        promise.then(
                function (data) {
                    request1Response = data;
                },
                function () {
                    alert("$.get failed!");
                }
        );

        return promise;
    };
    
    var finalAction = function () {
        alert("Collected data:\nAPI#1:" + JSON.stringify(request1Response) + "\n=======\nAPI #2:" + JSON.stringify(request2Response));
    };
    var getBlueprintsByNameAndAuthor = function (authname, namePlano, callback) {
        var promise = $.get("/blueprints/" + authname + "/" + namePlano, callback);
        promise.then(
                function (data) {
                    request2Response = data;
                },
                function () {
                    alert("$.get failed!");
                }
        );
        return promise;
    };
    //public functions
    return {
        chainedPromises: function (authname, name, points) {
            //With promises
            putForumPost(authname,name,points)
                    .then(function (){getBlueprintsByNameAndAuthor(authname, name);});
        },
        getBlueprintsByAuthor: function (authname, name) {
            $.get("/blueprints/" + authname, name);
        },
        getBlueprintsByNameAndAuthor: function (authname, bpname, callback) {
            $.get("/blueprints/" + authname + "/" + bpname, callback);
        }
    };

})();
