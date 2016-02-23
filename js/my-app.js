// Initialize your app
var myApp = new Framework7();

var myApp = new Framework7({
  material: true,
  activeState: true

});



// Export selectors engine
var $$ = Dom7;

// Hide and show indicator during ajax requests


// Add view
var mainView = myApp.addView('.view-main', {
  // Because we use fixed-through navbar we can enable dynamic navbar
  dynamicNavbar: true

});

//Mostramos el nombre del dispositivo
//var deviceName = cordova.plugins.deviceName;
//// console.log(deviceName.name) // e.g: Becvert's iPad

var device = Framework7.prototype.device;

//lo dejamos por el momento solo en android
var tipodispositivo;
tipodispositivo = 4;
/*if (device.iphone) {
   console.log('this is iPhone');
       var cssId = 'myCss1';  // you could encode the css path itself to generate id..
        if (!document.getElementById(cssId))
        {
            var head  = document.getElementsByTagName('head')[0];
            var link  = document.createElement('link');
            //link.id   = cssId;
            link.rel  = 'stylesheet';

            link.href = 'css/framework7.ios.min.css';

            head.appendChild(link);

            var link2  = document.createElement('link');
            //link2.id   = cssId;
            link2.rel  = 'stylesheet';

            link2.href = 'css/framework7.ios.colors.min.css';

            head.appendChild(link2);
    <!--<link rel="stylesheet" href="css/framework7.material.colors.min.css">-->

        }
           tipodispositivo=2;


}else if(device.android){
   console.log('This is an Android');

    var cssId = 'myCss2';  // you could encode the css path itself to generate id..
        if (!document.getElementById(cssId))
        {
            var head  = document.getElementsByTagName('head')[0];
            var link  = document.createElement('link');
            link.id   = cssId;
            link.rel  = 'stylesheet';

            link.href = 'css/framework7.material.min.css';

            head.appendChild(link);

            var link2  = document.createElement('link');
            link2.id   = cssId;
            link2.rel  = 'stylesheet';

            link2.href = 'css/framework7.material.colors.min.css';

            head.appendChild(link2);


        }
        tipodispositivo=4;
}*/

setTimeout(verificardispreg(), 5000);

function verificardispreg() {
  //Verificamos si No existen las variables para almacenamiento local
  if (localStorage.getItem('AzureMobile') === null || localStorage.getItem('DeviceKey') === null) {
    mainView.router.loadPage('pags/registrardisp.html');
    myApp.showIndicator();
  } //Si existen pero no estan definidas
  else if (localStorage.getItem('AzureMobile') === "undefined" && localStorage.getItem('DeviceKey') === "undefined") {
    mainView.router.loadPage('pags/registrardisp.html');
    myApp.showIndicator();
  } else if (localStorage.getItem('AzureMobile') !== "undefined" && localStorage.getItem('DeviceKey') !== "undefined") {
    //1.-Verificamos si el dispositivo esta registrado o pueden estar dadas de baja las claves
    var admixProduct = 13;
    var typeDevice = tipodispositivo;
    var deviceKey = localStorage.getItem('DeviceKey');
    var deviceName = "Android-Simulator";

    var postdata = {};
    postdata.admixProduct = admixProduct;
    postdata.typeDevice = typeDevice;
    postdata.deviceKey = deviceKey;
    postdata.deviceName = deviceName;

    $.ajax({
      type: "GET",
      url: "http://admix.com.mx:8090/Test.asmx/DeviceRegistered",
      dataType: 'xml',
      contentType: 'application/xml;charset=utf-8',
      data: postdata,
      success: onSuccessdevreg,
      error: function(responseError, msg, e) {
        var tempError = JSON.stringify(responseError);
        // console.log(tempError.responseText);
        myApp.alert("Error,al verificar claves");
      }
    });
  }

  function onSuccessdevreg(data) {
    var ArrayData = $.parseJSON(data.documentElement.innerHTML);
    // // console.log(ArrayData);
    if (ArrayData[0].DeviceKey === null) {
      //myApp.alert(ArrayData[0].Error.Message);
      myApp.hideIndicator();
      myApp.alert(ArrayData[0].Error.Message);
      mainView.router.loadPage('pags/registrardisp.html');
    } else if (ArrayData[0].Error === null) {
      myApp.hideIndicator();
      mainView.router.reloadPage('pags/login.html');
    }


  }

}

//  var butyasoyusuario=document.getElementById('indexbutyasoyuser').onclick=function(){

//};


/*$$('.notification-single').on('click', function () {
   myApp.addNotification({
       message: 'Nuevo Usuario ?'
   });
});*/


var calendarDefault = myApp.calendar({
  input: '#calendar-default',
});

myApp.onPageInit('registrardisp', function(page) {
  myApp.hideIndicator();

  //var deviceName = .cordova.deviceName;
  //// console.log(deviceName.name); // e.g: Becvert's iPad

  localStorage.setItem("user", "");
  localStorage.setItem("password", "");

  document.getElementById('butregdisp').onclick = function() {
    myApp.showIndicator();
    var admixProduct = 13;
    var typeDevice = tipodispositivo;
    var deviceName = 'Android-Simulator';
    var user = document.getElementById('regdispusuario').value;
    var password = document.getElementById('regdispcontra').value;

    var postdata = {};
    postdata.admixProduct = admixProduct;
    postdata.typeDevice = typeDevice;
    postdata.deviceName = deviceName;
    postdata.user = user;
    postdata.password = password;

    $.ajax({
      type: "GET",
      url: "http://admix.com.mx:8090/Test.asmx/DeviceRegistrationAdministrator",
      dataType: 'xml',
      contentType: 'application/xml;charset=utf-8',
      data: postdata,
      success: onSuccessdevregad,
      error: function(responseError, msg, e) {
        var tempError = JSON.stringify(responseError);
        // console.log(tempError.responseText);

        myApp.alert("Error, Verifique sus Credenciales o Contacte a su Proveedor");
        myApp.hideIndicator();
      }
    });
  };

  function onSuccessdevregad(data) {
    var ArrayData = $.parseJSON(data.documentElement.innerHTML);
    if (ArrayData[0].DeviceKey === null) {
      myApp.hideIndicator();
      myApp.alert(ArrayData[0].Error.Message, "Error");
    } else {
      localStorage.setItem("AzureMobile", ArrayData[0].AzureMobile);
      localStorage.setItem("DeviceKey", ArrayData[0].DeviceKey);
      localStorage.setItem("Schema", ArrayData[0].Schema);
      mainView.router.loadPage('pags/login.html');

    }
    // // console.log(ArrayData);
  }
  //  {


  //      alert("fue exitoso");
  //$("#etiqueta").html("Result: " + data.d[1].Nombre);
  /*var i;
            for(i=1;i<=data.d.length;i++){
                document.getElementById("Item"+i).innerHTML = data.d[i].Nombre;
            }



    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });



    $$('.notification-single').on('click', function () {
    myApp.addNotification({
        message: 'Terminos de uso'
        });
    });

   // $(function() {

      /*  $("#registrardispbut").click(function() {

            var admixProduct=13;
            var typeDevice=4;
            var deviceKey='AFEA530DC12AAE8106FDC845A14B6176';
            var deviceName='Android-Simulator';

            var postdata = {};
            postdata.admixProduct=admixProduct;
            postdata.typeDevice=typeDevice;
            postdata.deviceKey=deviceKey;
            postdata.deviceName=deviceName;

            //alert("entro en llamada ajax");
                $.ajax({
                  type: "GET",
                  url: "http://192.168.0.134:8090/Test.asmx/DeviceRegistered",
                  dataType:'xml',
                  contentType:'application/xml;charset=utf-8',
                  data: postdata,
                  success: onSuccess
                });
            });*/
  /* $("#registrardispbut").click(function() {

       var admixProduct='13';
       var typeDevice='4';
       var deviceName='Android-Simulator';
       var user=$$('#regdispusuario').val();
       var password=$$('#regdispcontra').val();

       if (!user || !password){
         myApp.alert('Por favor llene todos los campos');
         return;
        }

       var postdata = {};

       postdata.admixProduct=admixProduct;
       postdata.typeDevice=typeDevice;
       postdata.deviceName=deviceName;
       postdata.user=user;
       postdata.password=password;



       //alert("entro en llamada ajax");
           $.ajax({
             type: "POST",
             url: "http://192.168.0.134:8090/Test.asmx/DeviceRegistrationAdministrator",
             dataType:'json',
             contentType:'application/json',
             data: postdata,
             success: onSuccess
           });
       });*/
  //  });

  /*  $("#resultLog").ajaxError(function(event, request, settings, exception) {
        alert("error");
      $("#resultLog").html("Error Calling: " + settings.url + "<br />HTTP Code: " + request.status);
    });*/

  //  function onSuccess(data)
  //  {
  //      alert("fue exitoso");
  //$("#etiqueta").html("Result: " + data.d[1].Nombre);
  /*var i;
  for(i=1;i<=data.d.length;i++){
      document.getElementById("Item"+i).innerHTML = data.d[i].Nombre;
  }*/

  // }



});

myApp.onPageInit('registrardispcad', function(page) {
  // run createContentPage func after link was clicked
  $$('.create-page').on('click', function() {
    createContentPage();
  });

  $$('.notification-single').on('click', function() {
    myApp.addNotification({
      message: 'Terminos de uso'
    });
  });
});


myApp.onPageInit('iniciotabs', function(arrayempleados, page) {
  //console.log(arrayempleados);

  document.getElementById('diaselectcalendario').style.display = "none";



  // Add 'refresh' listener on it
  //refresh agenda del dia

  function refreshagendadia() {
    var idUsuario = sessionStorage.getItem("idUsuario");
    var idEmpleado = sessionStorage.getItem("idEmpleado");

    var consultaevhoy;
    if (idUsuario > 0 && idEmpleado === "null") {

      consultaevhoy = "SELECT * From dbCalendario_Tareas t inner join dbCalendario_Tareas_Participantes p on p.idTarea=t.id Where p.id_Participante=" + idUsuario + ";";
      // document.getElementById('users').style.display="none";
    }
    //CUando sea empleado de la empresa
    else if (idUsuario > 0 && idEmpleado != "null") {

      consultaevhoy = "SELECT * From dbCalendario_Tareas t inner join dbCalendario_Tareas_Participantes p on p.idTarea=t.id Where p.id_Participante=" + idEmpleado + ";";

      // document.getElementById('users').style.display="block";
      /**Cargamos los eventos de los usuarios seleccionados**/
      CargarlosEventosUsuarios(arrayempleados);
    }
    //Cuando sea Administrador
    else if (idUsuario == -1) {
      consultaevhoy = "SELECT * From dbCalendario_Tareas t inner join dbCalendario_Tareas_Participantes p on p.idTarea=t.id Where p.id_Participante=" + idUsuario + ";";

      // document.getElementById('users').style.display="block";
      /**Cargamos los eventos de los usuarios seleccionados**/
      //CargarlosEventosUsuarios(arrayempleados);
    }

    $("#contagenda").empty();

    var idEmpleado = sessionStorage.getItem("idEmpleado");
    var deviceKey = localStorage.getItem('DeviceKey');
    var Mobilekey = localStorage.getItem('AzureMobile');


    var postdata = {};

    postdata.deviceKey = deviceKey;
    postdata.mobileKey = Mobilekey;
    postdata.query = consultaevhoy;
    //alert("entro en llamada ajax");
    $.ajax({
      type: "GET",
      url: "http://admix.com.mx:8090/Test.asmx/Query",
      dataType: 'xml',
      contentType: 'application/xml;charset=utf-8',
      data: postdata,
      success: cargarevhoyrefresh,
      error: function(responseError, msg, e) {
        var tempError = JSON.stringify(responseError);
        //// console.log(tempError.responseText);
        myApp.alert("Error, de Carga del Servicio");
      }
    });

    function cargarevhoyrefresh(data) {
      var arraryev = $.parseJSON(data.documentElement.innerHTML);

      if (arraryev[0] == null || arraryev[0] == "null") {
        myApp.alert("Bienvenido, Para comenzar agregue un nuevo evento presionando el boton de (+)");
      } else {
        var eventoshoy = $.parseJSON(arraryev);

        if (eventoshoy[0] == "null") {
          myApp.alert("Comience Agregando un Evento", "Bienvenid@");
        }

        //console.log(eventoshoy);
        var fecha = new Date();
        var fechahoy = fecha.getFullYear() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getDate();

        //Eventos de la agenda del dia hoy
        for (var j = 0; j < eventoshoy.length; j++) {


          // la hora de fin de la cita
          var horadeevento = "";
          if (eventoshoy[j].Tipo == 2) {

            var FI = eventoshoy[j].Fecha_Inicio;
            //// console.log(usuarioeventos[j][k].Descripcion);

            //Fecha Inicio
            var inicio = FI.indexOf("(");
            var fin = FI.indexOf(")");
            var newdate = FI.substring(inicio + 1, fin);
            var cad = parseFloat(newdate);
            var fechainicio = new Date(cad);
            var fullfechaI = fechainicio.getFullYear() + "/" + (fechainicio.getMonth() + 1) + "/" + fechainicio.getDate();


            var HoraEv;
            if (fechainicio.getHours() < 10) {
              HoraEv = "0" + fechainicio.getHours();
            } else {
              HoraEv = fechainicio.getHours();
            }
            var MinEv;
            if (fechainicio.getMinutes() < 10) {
              MinEv = "0" + fechainicio.getMinutes();
            } else {
              MinEv = fechainicio.getMinutes();
            }



            //Para saber si es el sistema de horario a.m. o p.m.
            var sishorario;
            if (fechainicio.getHours() >= 0 && fechainicio.getHours() < 12) {
              sishorario = "a.m.";
            } else if (fechainicio.getHours() >= 12 && fechainicio.getHours() <= 23) {
              sishorario = "p.m."
            }
            var HoraInicio = HoraEv + ":" + MinEv + " " + sishorario;


            var FF = eventoshoy[j].Fecha_Fin;
            //// console.log(usuarioeventos[j][k].Descripcion);

            //Fecha Fin
            var iniciof = FF.indexOf("(");
            var finf = FF.indexOf(")");
            var newdatef = FF.substring(iniciof + 1, finf);
            var cadf = parseFloat(newdatef);
            var fechafin = new Date(cadf);
            var fullfechaf = fechafin.getFullYear() + "/" + (fechafin.getMonth() + 1) + "/" + fechafin.getDate();


            var HoraEvf;
            if (fechafin.getHours() < 10) {
              HoraEvf = "0" + fechafin.getHours();
            } else {
              HoraEvf = fechafin.getHours();
            }
            var MinEvf;
            if (fechafin.getMinutes() < 10) {
              MinEvf = "0" + fechafin.getMinutes();
            } else {
              MinEvf = fechafin.getMinutes();
            }



            //Para saber si es el sistema de horario a.m. o p.m.
            var sishorariof;
            if (fechafin.getHours() >= 0 && fechafin.getHours() < 12) {
              sishorariof = "a.m.";
            } else if (fechafin.getHours() >= 12 && fechafin.getHours() <= 23) {
              sishorariof = "p.m."
            }
            var Horafin = HoraEvf + ":" + MinEvf + " " + sishorariof;
            horadeevento = "Hoy de " + HoraInicio + " a <br>" + Horafin;


          } else if (eventoshoy[j].Tipo == 1) {
            var FI = eventoshoy[j].Fecha_Inicio;

            //Fecha Inicio
            var inicio = FI.indexOf("(");
            var fin = FI.indexOf(")");
            var newdate = FI.substring(inicio + 1, fin);
            var cad = parseFloat(newdate);
            var fechainicio = new Date(cad);
            var fullfechaI = fechainicio.getFullYear() + "/" + (fechainicio.getMonth() + 1) + "/" + fechainicio.getDate();

            var FL = eventoshoy[j].Fecha_Limite;
            //// console.log(usuarioeventos[j][k].Descripcion);

            //Fecha Fin
            var iniciol = FL.indexOf("(");
            var finl = FL.indexOf(")");
            var newdatel = FL.substring(iniciol + 1, finl);
            var cadl = parseFloat(newdatel);
            var fechalimite = new Date(cadl);
            var fullfechalimite = fechalimite.getFullYear() + "/" + (fechalimite.getMonth() + 1) + "/" + fechalimite.getDate();


            var HoraEvL;
            if (fechalimite.getHours() < 10) {
              HoraEvL = "0" + fechalimite.getHours();
            } else {
              HoraEvL = fechalimite.getHours();
            }
            var MinEvL;
            if (fechalimite.getMinutes() < 10) {
              MinEvL = "0" + fechalimite.getMinutes();
            } else {
              MinEvL = fechalimite.getMinutes();
            }



            //Para saber si es el sistema de horario a.m. o p.m.
            var sishorariol;
            if (fechalimite.getHours() >= 0 && fechalimite.getHours() < 12) {
              sishorariol = "a.m.";
            } else if (fechalimite.getHours() >= 12 && fechalimite.getHours() <= 23) {
              sishorariol = "p.m."
            }
            var Horalimite = HoraEvL + ":" + MinEvL + " " + sishorariol;
            horadeevento = "Hasta " + fullfechalimite + " " + Horalimite;
          }


          if (fullfechaI === fechahoy) {

            var imagen;
            if (eventoshoy[j].Tipo === 1) {
              imagen = 'img/taskmdpi.png';
            } else if (eventoshoy[j].Tipo === 2) {
              imagen = 'img/clock-mdpi.png';
            }

            //console.log("Eventos de hoy");
            //console.log(eventoshoy);

            //Estadovar Estado="null";
            var Estadowithcolor;
            if (eventoshoy[j].Estado === 0) {
              Estado = "Pendiente";
              Estadowithcolor = "<span class='badge' style='background:rgba(33, 150, 243, 0.67)'>" + Estado + "</span>";
            }
            if (eventoshoy[j].Estado === 1) {
              Estado = "En Proceso";
              Estadowithcolor = "<span class='badge' style='background:#FF9800'>" + Estado + "</span>";
            }
            if (eventoshoy[j].Estado === 2) {
              Estado = "Terminado";
              Estadowithcolor = "<span  class='badge' style='background:#009688'>" + Estado + "</span>";
            }
            if (eventoshoy[j].Estado === 3) {
              Estado = "Cancelado";
              Estadowithcolor = "<span class='badge' style='background:black'>" + Estado + "</span>";
            }



            var newNode = document.createElement('a');
            newNode.setAttribute('href', 'pags/eventosdetalle.html');
            newNode.setAttribute('onClick', 'eventodetalle(' + eventoshoy[j].id + ')');
            newNode.className = 'item-link';
            newNode.innerHTML = "<li class='swipeout'>" +
              "<div class='swipeout-content item-content'>" +
              "<div class='item-media'><img src='" + imagen + "'></div>" +
              "<div class='item-inner'>" +
              "<div class='item-title-row'>" +
              "<div class='item-title'>" + eventoshoy[j].Descripcion + "<br>" + horadeevento + "</div>" +
              "<div class='item-after'>" + Estadowithcolor + "</div>" +
              "</div>" +
              "</div>" +
              "<div class='swipeout-actions-right'>" +
              "<a class='swipeout-delete'  onClick='eliminar(" + eventoshoy[j].id + ")'>Eliminar</a>" +
              "</div>" +
              "</li>";

            document.getElementById('contagenda').appendChild(newNode);


          }

        }
      }
    }
  }

  function refreshtareas() {
    $("#contlista").empty();
    //Pestaña Tareas
    var idUsuario = sessionStorage.getItem('idUsuario');
    var idEmpleado = sessionStorage.getItem("idEmpleado");
    var idParticipante;
    //usuario solo con suscripcion
    if (idUsuario > 0 && idEmpleado == "null") {
      idParticipante = idUsuario;
    }
    //usuario EMpleado de departamento
    else if (idUsuario > 0 && idEmpleado != "null") {
      idParticipante = idEmpleado;
    }
    //Cuando sea Administrador
    else if (idUsuario == -1) {
      idParticipante = idUsuario;

    }

    var deviceKey = localStorage.getItem('DeviceKey');
    var Mobilekey = localStorage.getItem('AzureMobile');
    //var consulta='SELECT * FROM dbCalendario_Tareas Where Tipo=1 and id_Cliente='+idEmpleado;
    var consulta = "SELECT * From dbCalendario_Tareas t  inner join dbCalendario_Tareas_Participantes p on p.idTarea=t.id Where p.id_Participante=" + idParticipante + " and t.Tipo=1;";

    var postdata = {};

    postdata.deviceKey = deviceKey;
    postdata.mobileKey = Mobilekey;
    postdata.query = consulta;
    //alert("entro en llamada ajax");
    $.ajax({
      type: "GET",
      url: "http://admix.com.mx:8090/Test.asmx/Query",
      dataType: 'xml',
      contentType: 'application/xml;charset=utf-8',
      data: postdata,
      success: onSuccessrefresh,
      error: function(responseError, msg, e) {
        var tempError = JSON.stringify(responseError);
        //// console.log(tempError.responseText);
        myApp.alert("Error, de Carga del Servicio");
      }
    });

    function onSuccessrefresh(data) {
      var ArrayData = $.parseJSON(data.documentElement.innerHTML);
      if (ArrayData[0] == null) {
        myApp.alert("Actualmente no tiene Tareas", "Agregue una Tarea");
      } else {
        var obj = jQuery.parseJSON(ArrayData);
        //myApp.alert("Consulta realizada con exito"+obj[0].Descripcion);
        // // console.log(obj);

        //Cambiar el epochtime a date//
        var FI = obj[0].Fecha_Inicio;
        var FF = obj[0].Fecha_Fin;

        //Fecha Inicio
        var inicio = FI.indexOf("(");
        var fin = FI.indexOf(")");
        var newdate = FI.substring(inicio + 1, fin);
        var cad = parseFloat(newdate);
        var fechainicio = new Date(cad);

        /*//Fecha Fin
            var iniciof = FF.indexOf("(");
            var finf = FF.indexOf(")");
            var newdatef=FF.substring(iniciof + 1, finf);
            var cadf=parseFloat(newdatef);
            var fechafin = new Date(cadf);*/



        for (var i = 0; i < obj.length; i++) {

          var imagen;
          if (obj[i].Tipo === 1) {
            imagen = 'img/taskmdpi.png';
          } else if (obj[i].Tipo === 2) {
            imagen = 'img/clock-mdpi.png';
          }

          var Estado = "null";
          var Estadowithcolor;
          if (obj[i].Estado === 0) {
            Estado = "P";
            Estadowithcolor = "<span class='badge' style='background:#rgba(33, 150, 243, 0.67)'>" + Estado + "</span>";
          }
          if (obj[i].Estado === 1) {
            Estado = "P";
            Estadowithcolor = "<span class='badge' style='background:#FF9800'>" + Estado + "</span>";
          }
          if (obj[i].Estado === 2) {
            Estado = "T";
            Estadowithcolor = "<span  class='badge' style='background:#009688'>" + Estado + "</span>";
          }
          if (obj[i].Estado === 3) {
            Estado = "C";
            Estadowithcolor = "<span class='badge' style='background:black'>" + Estado + "</span>";
          }


          var newNode = document.createElement('a');
          newNode.setAttribute('href', 'pags/eventosdetalle.html');
          newNode.setAttribute('onClick', 'eventodetalle(' + obj[i].id + ')');
          newNode.className = 'item-link';
          newNode.innerHTML = "<li class='swipeout'>" +
            "<div class='swipeout-content item-content'>" +
            "<div class='item-media'><img src='" + imagen + "'></div>" +
            "<div class='item-inner'><div class='item-title'>" + obj[i].Descripcion + "<br>" +
            "</div>" +
            "<div class='item-after'>" + Estadowithcolor + "</div>" +
            "</div>" +

            "</div>" +
            "<div class='swipeout-actions-right'>" +
            "<a class='swipeout-delete' onClick='eliminar(" + obj[i].id + ")'>Eliminar</a>" +
            "</div>" +
            "</li>";


          document.getElementById('contlista').appendChild(newNode);
        }
        /*var i;
        for(i=0;i<obj.length;i++){
          document.getElementById('tarea'+i).onclick=function(){
            myApp.alert("Esta es la  tarea y el ide es:"+obj[this.value].Descripcion);
          }

        }*/
      }
    }


  }
  var ptrContent = $$('.pull-to-refresh-content');
  ptrContent.on('refresh', function(e) {
    // Emulate 2s loading
    myApp.showIndicator();
    setTimeout(function() {
      $("#contagenda").empty();
      $("#contlista").empty();
      refreshagendadia();
      refreshtareas();

      myApp.pullToRefreshDone();
      myApp.hideIndicator();
    }, 2000);
  });



  myApp.hideIndicator();
  $(function() {

    /* //Validamos que se terminen todas las citas de todos los usuarios una vez que pase el tiempo
        var deviceKey=localStorage.getItem('DeviceKey');
        var Mobilekey=localStorage.getItem('AzureMobile');
       // var consulta='SELECT * FROM dbCalendario_Tareas Where id_Cliente='+idEmpleado;
       // var consulta="SELECT * From dbCalendario_Tareas ev Where ev.Tipo=2 ";
        var consulta="UPDATE dbCalendario_Tareas  SET Estado=2 Where Tipo=2  AND GETDATE() > Fecha_Fin AND Estado<>3 AND Estado<>0";
        var postdata = {};

        postdata.deviceKey=deviceKey;
        postdata.mobileKey=Mobilekey;
        postdata.query=consulta;
        //alert("entro en llamada ajax");
            $.ajax({
              type: "GET",
              url: "http://192.168.0.134:8090/Test.asmx/Execute",
              dataType:'xml',
              contentType:'application/xml;charset=utf-8',
              data: postdata,
              success: seactualizaroncitas,
              error:function(responseError,msg, e){
                    var tempError =JSON.stringify(responseError);
                    //// console.log(tempError.responseText);
                    myApp.alert("Error, de Carga del Servicio");
                  }
            });
        function seactualizaroncitas(data){
            var arraycitas=$.parseJSON(data.documentElement.innerHTML);
            console.log(arraycitas);
            //var citas=$.parseJSON(arraycitas);
        }*/



    var idUser = sessionStorage.getItem("idUsuario");
    var idUsuario = sessionStorage.getItem("idUsuario");
    var idEmpleado = sessionStorage.getItem("idEmpleado");

    /* $$('#tab1').on('change', function () {
         myApp.alert('Tab change');
     });*/


    getIndex();

    function getIndex() {
      var tabactive = document.getElementsByClassName('tab active');

      /*var isActive = $('.tab#tab1').hasClass('active');
      if(isActive == true){
          //myApp.alert("esta activa la pestaña 1");
      }*/
      //console.log(tabactive[0].attributes[0].value);
      if (tabactive[0].attributes[0].value == "tab1") {

        document.getElementById("imgadd").onclick = function() {
          var fecha = new Date();
          var mes;
          if ((fecha.getMonth() + 1) < 10) {
            mes = "0" + (fecha.getMonth() + 1);
          } else {
            mes = (fecha.getMonth() + 1);
          }
          var dia;
          if (fecha.getDate() < 10) {
            dia = "0" + fecha.getDate();
          } else {
            dia = fecha.getDate();
          }
          var fechahoy = fecha.getFullYear() + "/" + mes + "/" + dia;

          // myApp.alert("se mostraria el modal");

          //Modal Agregar nuevo registro

          myApp.modal({
            title: 'Agregar Evento?',
            text: '',
            verticalButtons: true,
            buttons: [{
                text: 'Tarea',
                onClick: function() {
                  //mainView.router.loadPage('pags/agregarnuevoregistro.html');
                  // mainView.router.load({url:'pags/agregarnuevoregistro.html',query:{tipo:1}});

                  //document.getElementById('my-radio').checked= true;
                  //myApp.alert('Tarea');
                  mainView.router.load({
                    url: 'pags/agregarnuevoregistro.html',
                    query: {
                      tipo: 1,
                      pestanaactiva: 1,
                      fechaagendahoy: fechahoy
                    }
                  });
                }
              }, {
                text: 'Cita',
                onClick: function() {
                  //mainView.router.loadPage('pags/agregarnuevoregistro.html');
                  //  mainView.router.load({url:'pags/agregarnuevoregistro.html',query:{tipo:2}});
                  // document.getElementById('my-radio').checked= true;
                  //myApp.alert('Cita');
                  mainView.router.load({
                    url: 'pags/agregarnuevoregistro.html',
                    query: {
                      tipo: 2,
                      pestanaactiva: 1,
                      fechaagendahoy: fechahoy
                    }
                  });
                }
              },

              {
                text: 'Cancelar',
                onClick: function() {
                  myApp.closeModal('open-vertical-modal');
                }
              }
            ]
          })

        }
      }
    }



    $$('#tab1').on('show', function() {
      document.getElementById("imgadd").onclick = function() {

          getIndex();
          //mainView.router.load({url:'pags/agregarnuevoregistro.html',query:{tipo:1,fechaagendahoy:fechahoy}});

          //myApp.alert("Esta es una prueba");

        }
        /*document.getElementById('users').onclick=function(){
               //myApp.alert("cargar los usuarios para el calendario");
                //mainView.router.load({url:'pags/usuarios.html',query:{pestanaactiva:1}});
           }*/

    });

    $$('#tab2').on('show', function() {
      document.getElementById("imgadd").onclick = function() {
          var fechacaja = document.getElementById('calendar-default').value;
          var fechavieja = Date.parse(fechacaja + " " + "00:00:00");
          //console.log(fechavieja);
          var fecha = new Date(fechavieja);

          var dia;
          var mes;
          if ((fecha.getMonth() + 1) < 10) {
            mes = "0" + (fecha.getMonth() + 1);
          } else {
            mes = (fecha.getMonth() + 1);
          }

          if (fecha.getDate() < 10) {
            dia = "0" + fecha.getDate();
          } else {
            dia = fecha.getDate();
          }



          var fechaselec = fecha.getFullYear() + "/" + mes + "/" + dia;
          console.log(fechaselec);

          mainView.router.load({
            url: 'pags/agregarnuevoregistro.html',
            query: {
              tipo: 2,
              pestanaactiva: 2,
              fechaagendahoy: fechaselec
            }
          });
        }
        /*document.getElementById('users').onclick=function(){
            mainView.router.load({url:'pags/usuarios.html',query:{pestanaactiva:2}});
        }*/

    });

    $$('#tab3').on('show', function() {
      document.getElementById("imgadd").onclick = function() {

          var fecha = new Date();
          var mes;
          if ((fecha.getMonth() + 1) < 10) {
            mes = "0" + (fecha.getMonth() + 1);
          } else {
            mes = (fecha.getMonth() + 1);
          }
          var dia;
          if (fecha.getDate() < 10) {
            dia = "0" + fecha.getDate();
          } else {
            dia = fecha.getDate();
          }
          var fechahoy = fecha.getFullYear() + "/" + mes + "/" + dia;

          mainView.router.load({
            url: 'pags/agregarnuevoregistro.html',
            query: {
              tipo: 1,
              pestanaactiva: 3,
              fechaagendahoy: fechahoy
            }
          });
        }
        /*document.getElementById('users').onclick=function(){
            mainView.router.load({url:'pags/usuarios.html',query:{pestanaactiva:3}});

        }*/
    });

    //Cuando el usuario solo haya comprado el producto  talvez sea un cliente

    var consultaevhoy;
    if (idUsuario > 0 && idEmpleado === "null") {

      consultaevhoy = "SELECT * From dbCalendario_Tareas t inner join dbCalendario_Tareas_Participantes p on p.idTarea=t.id Where p.id_Participante=" + idUsuario + ";";
      // document.getElementById('users').style.display="none";
    }
    //CUando sea empleado de la empresa
    else if (idUsuario > 0 && idEmpleado != "null") {

      consultaevhoy = "SELECT * From dbCalendario_Tareas t inner join dbCalendario_Tareas_Participantes p on p.idTarea=t.id Where p.id_Participante=" + idEmpleado + ";";

      // document.getElementById('users').style.display="block";
      /**Cargamos los eventos de los usuarios seleccionados**/
      CargarlosEventosUsuarios(arrayempleados);
    }
    //Cuando sea Administrador
    else if (idUsuario == -1) {
      consultaevhoy = "SELECT * From dbCalendario_Tareas t inner join dbCalendario_Tareas_Participantes p on p.idTarea=t.id Where p.id_Participante=" + idUsuario + ";";

      // document.getElementById('users').style.display="block";
      /**Cargamos los eventos de los usuarios seleccionados**/
      //CargarlosEventosUsuarios(arrayempleados);
    }

    // myApp.alert(idUser);
    /**verifica si tiene agenda para hoy el usuario logueado **/

    $(function() {
      $("#contagenda").empty();

      var idEmpleado = sessionStorage.getItem("idEmpleado");
      var deviceKey = localStorage.getItem('DeviceKey');
      var Mobilekey = localStorage.getItem('AzureMobile');


      var postdata = {};

      postdata.deviceKey = deviceKey;
      postdata.mobileKey = Mobilekey;
      postdata.query = consultaevhoy;
      //alert("entro en llamada ajax");
      $.ajax({
        type: "GET",
        url: "http://admix.com.mx:8090/Test.asmx/Query",
        dataType: 'xml',
        contentType: 'application/xml;charset=utf-8',
        data: postdata,
        success: cargarevhoy,
        error: function(responseError, msg, e) {
          var tempError = JSON.stringify(responseError);
          //// console.log(tempError.responseText);
          myApp.alert("Error, de Carga del Servicio");
        }
      });

      function cargarevhoy(data) {
        var arraryev = $.parseJSON(data.documentElement.innerHTML);

        if (arraryev[0] == null || arraryev[0] == "null") {
          myApp.alert("Bienvenido, Para comenzar agregue un nuevo evento presionando el boton de (+)");
        } else {
          var eventoshoy = $.parseJSON(arraryev);

          if (eventoshoy[0] == "null") {
            myApp.alert("Comience Agregando un Evento", "Bienvenid@");
          }

          //console.log(eventoshoy);
          var fecha = new Date();
          var fechahoy = fecha.getFullYear() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getDate();

          //Eventos de la agenda del dia hoy
          for (var j = 0; j < eventoshoy.length; j++) {


            // la hora de fin de la cita
            var horadeevento = "";
            if (eventoshoy[j].Tipo == 2) {

              var FI = eventoshoy[j].Fecha_Inicio;
              //// console.log(usuarioeventos[j][k].Descripcion);

              //Fecha Inicio
              var inicio = FI.indexOf("(");
              var fin = FI.indexOf(")");
              var newdate = FI.substring(inicio + 1, fin);
              var cad = parseFloat(newdate);
              var fechainicio = new Date(cad);
              var fullfechaI = fechainicio.getFullYear() + "/" + (fechainicio.getMonth() + 1) + "/" + fechainicio.getDate();


              var HoraEv;
              if (fechainicio.getHours() < 10) {
                HoraEv = "0" + fechainicio.getHours();
              } else {
                HoraEv = fechainicio.getHours();
              }
              var MinEv;
              if (fechainicio.getMinutes() < 10) {
                MinEv = "0" + fechainicio.getMinutes();
              } else {
                MinEv = fechainicio.getMinutes();
              }



              //Para saber si es el sistema de horario a.m. o p.m.
              var sishorario;
              if (fechainicio.getHours() >= 0 && fechainicio.getHours() < 12) {
                sishorario = "a.m.";
              } else if (fechainicio.getHours() >= 12 && fechainicio.getHours() <= 23) {
                sishorario = "p.m."
              }
              var HoraInicio = HoraEv + ":" + MinEv + " " + sishorario;


              var FF = eventoshoy[j].Fecha_Fin;
              //// console.log(usuarioeventos[j][k].Descripcion);

              //Fecha Fin
              var iniciof = FF.indexOf("(");
              var finf = FF.indexOf(")");
              var newdatef = FF.substring(iniciof + 1, finf);
              var cadf = parseFloat(newdatef);
              var fechafin = new Date(cadf);
              var fullfechaf = fechafin.getFullYear() + "/" + (fechafin.getMonth() + 1) + "/" + fechafin.getDate();


              var HoraEvf;
              if (fechafin.getHours() < 10) {
                HoraEvf = "0" + fechafin.getHours();
              } else {
                HoraEvf = fechafin.getHours();
              }
              var MinEvf;
              if (fechafin.getMinutes() < 10) {
                MinEvf = "0" + fechafin.getMinutes();
              } else {
                MinEvf = fechafin.getMinutes();
              }



              //Para saber si es el sistema de horario a.m. o p.m.
              var sishorariof;
              if (fechafin.getHours() >= 0 && fechafin.getHours() < 12) {
                sishorariof = "a.m.";
              } else if (fechafin.getHours() >= 12 && fechafin.getHours() <= 23) {
                sishorariof = "p.m."
              }
              var Horafin = HoraEvf + ":" + MinEvf + " " + sishorariof;
              horadeevento = "Hoy de " + HoraInicio + " a <br>" + Horafin;


            } else if (eventoshoy[j].Tipo == 1) {

              var FI = eventoshoy[j].Fecha_Inicio;


              //Fecha Inicio
              var inicio = FI.indexOf("(");
              var fin = FI.indexOf(")");
              var newdate = FI.substring(inicio + 1, fin);
              var cad = parseFloat(newdate);
              var fechainicio = new Date(cad);
              var fullfechaI = fechainicio.getFullYear() + "/" + (fechainicio.getMonth() + 1) + "/" + fechainicio.getDate();

              if (eventoshoy[j].Fecha_Limite != null) {
                var FL = eventoshoy[j].Fecha_Limite;
                //// console.log(usuarioeventos[j][k].Descripcion);

                //Fecha Limite
                var iniciol = FL.indexOf("(");
                var finl = FL.indexOf(")");
                var newdatel = FL.substring(iniciol + 1, finl);
                var cadl = parseFloat(newdatel);
                var fechalimite = new Date(cadl);
                var fullfechalimite = fechalimite.getFullYear() + "/" + (fechalimite.getMonth() + 1) + "/" + fechalimite.getDate();


                var HoraEvL;
                if (fechalimite.getHours() < 10) {
                  HoraEvL = "0" + fechalimite.getHours();
                } else {
                  HoraEvL = fechalimite.getHours();
                }
                var MinEvL;
                if (fechalimite.getMinutes() < 10) {
                  MinEvL = "0" + fechalimite.getMinutes();
                } else {
                  MinEvL = fechalimite.getMinutes();
                }



                //Para saber si es el sistema de horario a.m. o p.m.
                var sishorariol;
                if (fechalimite.getHours() >= 0 && fechalimite.getHours() < 12) {
                  sishorariol = "a.m.";
                } else if (fechalimite.getHours() >= 12 && fechalimite.getHours() <= 23) {
                  sishorariol = "p.m."
                }
                var Horalimite = HoraEvL + ":" + MinEvL + " " + sishorariol;
                horadeevento = "Hasta " + fullfechalimite + " " + Horalimite;
              }

            }


            if (fullfechaI === fechahoy) {

              var imagen;
              if (eventoshoy[j].Tipo === 1) {
                imagen = 'img/taskmdpi.png';
              } else if (eventoshoy[j].Tipo === 2) {
                imagen = 'img/clock-mdpi.png';
              }

              //console.log("Eventos de hoy");
              //console.log(eventoshoy);
              //Estado
              var Estado = "null";
              var Estadowithcolor;
              if (eventoshoy[j].Estado === 0) {
                Estado = "Pendiente";
                Estadowithcolor = "<span class='badge' style='background:rgba(33, 150, 243, 0.67)'>" + Estado + "</span>";
              }
              if (eventoshoy[j].Estado === 1) {
                Estado = "En Proceso";
                Estadowithcolor = "<span class='badge' style='background:#FF9800'>" + Estado + "</span>";
              }
              if (eventoshoy[j].Estado === 2) {
                Estado = "Terminado";
                Estadowithcolor = "<span  class='badge' style='background:#009688'>" + Estado + "</span>";
              }
              if (eventoshoy[j].Estado === 3) {
                Estado = "Cancelado";
                Estadowithcolor = "<span class='badge' style='background:black'>" + Estado + "</span>";
              }



              var newNode = document.createElement('a');
              newNode.setAttribute('href', 'pags/eventosdetalle.html');
              newNode.setAttribute('onClick', 'eventodetalle(' + eventoshoy[j].id + ')');
              newNode.className = 'item-link';
              newNode.innerHTML = "<li class='swipeout'>" +
                "<div class='swipeout-content item-content'>" +
                "<div class='item-media'><img src='" + imagen + "'></div>" +
                "<div class='item-inner'>" +
                "<div class='item-title-row'>" +
                "<div class='item-title'>" + eventoshoy[j].Descripcion + "<br>" + horadeevento + "</div>" +
                "<div class='item-after'>" + Estadowithcolor + "</div>" +
                "</div>" +
                "</div>" +
                "<div class='swipeout-actions-right'>" +
                "<a class='swipeout-delete'  onClick='eliminar(" + eventoshoy[j].id + ")'>Eliminar</a>" +
                "</div>" +
                "</li>";

              document.getElementById('contagenda').appendChild(newNode);


            }

          }
        }
      }

      //Pestaña Tareas
      var idUsuario = sessionStorage.getItem('idUsuario');
      var idEmpleado = sessionStorage.getItem("idEmpleado");
      var idParticipante;
      //usuario solo con suscripcion
      if (idUsuario > 0 && idEmpleado == "null") {
        idParticipante = idUsuario;
      }
      //usuario EMpleado de departamento
      else if (idUsuario > 0 && idEmpleado != "null") {
        idParticipante = idEmpleado;
      }
      //Cuando sea Administrador
      else if (idUsuario == -1) {
        idParticipante = idUsuario;

      }


      var deviceKey = localStorage.getItem('DeviceKey');
      var Mobilekey = localStorage.getItem('AzureMobile');
      //var consulta='SELECT * FROM dbCalendario_Tareas Where Tipo=1 and id_Cliente='+idEmpleado;
      var consulta = "SELECT * From dbCalendario_Tareas t  inner join dbCalendario_Tareas_Participantes p on p.idTarea=t.id Where p.id_Participante=" + idParticipante + " and t.Tipo=1;";

      var postdata = {};

      postdata.deviceKey = deviceKey;
      postdata.mobileKey = Mobilekey;
      postdata.query = consulta;
      //alert("entro en llamada ajax");
      $.ajax({
        type: "GET",
        url: "http://admix.com.mx:8090/Test.asmx/Query",
        dataType: 'xml',
        contentType: 'application/xml;charset=utf-8',
        data: postdata,
        success: onSuccess,
        error: function(responseError, msg, e) {
          var tempError = JSON.stringify(responseError);
          //// console.log(tempError.responseText);
          myApp.alert("Error, de Carga del Servicio");
        }
      });

    });



    //// console.log(arrayempleados);

    /**Cargamos los eventos de los usuarios seleccionados**/
    //CargarlosEventosUsuarios(arrayempleados);

    function CargarlosEventosUsuarios(arrayempleados) {
      //$("#contagenda").empty();

      /*if(arrayempleados.query[0].Nombre!==undefined){
          // console.log(arrayempleados);
          document.getElementById("textagendadeldia").innerHTML="Agenda del Dia de:  <br>"+arrayempleados.query[0].Nombre;

      }    */


      //// console.log(arrayempleados);
      var arrayevuser = [];
      var cont = 0;
      for (var i = 0; i < arrayempleados.query.length; i++) {
        var idEmpleado = arrayempleados.query[i].id;

        var deviceKey = localStorage.getItem('DeviceKey');
        var Mobilekey = localStorage.getItem('AzureMobile');
        var consulta = 'SELECT * From dbCalendario_Tareas t inner join dbCalendario_Tareas_Participantes p on p.idTarea=t.id Where p.id_Participante=' + idEmpleado;

        var postdata = {};

        postdata.deviceKey = deviceKey;
        postdata.mobileKey = Mobilekey;
        postdata.query = consulta;

        $.ajax({
          type: "GET",
          url: "http://admix.com.mx:8090/Test.asmx/Query",
          dataType: 'xml',
          contentType: 'application/xml;charset=utf-8',
          data: postdata,
          success: ResultEventosUser,
          error: function(responseError, msg, e) {
            var tempError = JSON.stringify(responseError);
            //// console.log(tempError.responseText);
            myApp.alert("Error, Al consultar Usuario");
          }

        });

        function ResultEventosUser(data) {

          var datatojson = $.parseJSON(data.documentElement.innerHTML);
          //// console.log(data);

          var arreglovacio = [];
          arreglovacio = datatojson.length;

          if (datatojson[0] !== null) {
            var eventosusuario = $.parseJSON(datatojson);
            //// console.log(eventosusuario);
            arrayevuser[cont] = eventosusuario;
            cont++;


          } else {
            myApp.alert("Un usuario seleccionado no tiene eventos");
          }


          /*if (datatojson[i] !== 'undefined' && datatojson[i] !== null&& datatojson[i] !== [null]) {


              var eventosusuario=$.parseJSON(datatojson);
              //// console.log(eventosusuario);
              arrayevuser[cont]=eventosusuario;
              cont++;

              }else{
                myApp.alert("Un usuario no tiene eventos");

              }
              */



          /*if(datatojson[i]===null&& datatojson[i]==='undefinded'){
          //    myApp.alert("no tiene eventos");

              var arraysineventos=[];

                arraysineventos[i]="No tiene Eventos en Este Momento";
                //arrayevuser[cont]= arraysineventos;
                //cont++;

          }else{
               var eventosusuario=$.parseJSON(datatojson);
          //// console.log(eventosusuario);
          arrayevuser[cont]=eventosusuario;
          cont++;
          }*/

          //// console.log(arrayevuser);
          Agendadeldia(arrayevuser);
          Pestanatareas(arrayevuser);

          //Calendarioeventos(arrayevuser);

        }

        //// console.log(arrayevuser);
      }

      //// console.log(arrayevuser);


      //mainView.router.load({url:'pags/Iniciotabs.html',query:arrayevuser});


    }

    //Pestaña Agenda del Dia
    //carga de pestañas con usuarios seleccionados//
    function Agendadeldia(usuarioeventos) {
      // $("#contagenda").empty();
      //// console.log(usuarioeventos);
      //Fecha del Dia de hoy
      var fecha = new Date();
      var fechahoy = fecha.getFullYear + "/" + (fecha.getMonth() + 1) + "/" + fecha.getDate();

      //var arrayagendatemp=[];

      //var ArrayData = $.parseJSON(data.documentElement.innerHTML);
      //var objeto=$.parseJSON(ArrayData);

      console.log(usuarioeventos.length);
      for (var j = 0; j < usuarioeventos.length; j++) {
        console.log(usuarioeventos);

        $('#contscheduleuserpos' + j + '').empty();


        /*var nodotitulo = document.createElement('div');
            nodotitulo.className ="content-block-title";
            nodotitulo.innerHTML=""+usuarioeventos[j][0].Username+"";
        document.getElementById('bloquecontenidoagenda').appendChild(nodotitulo);*/

        var nodolista = document.createElement('div');
        nodolista.className = "list-block";
        nodolista.innerHTML = "<ul id='contscheduleuserpos" + j + "'>" +
          "</ul>";
        document.getElementById('bloquecontenidoagenda').appendChild(nodolista);

        for (var k = 0; k < usuarioeventos[j].length; k++) {

          var FI = usuarioeventos[j][k].Fecha_Inicio;
          //// console.log(usuarioeventos[j][k].Descripcion);

          //Fecha Inicio
          var inicio = FI.indexOf("(");
          var fin = FI.indexOf(")");
          var newdate = FI.substring(inicio + 1, fin);
          var cad = parseFloat(newdate);
          var fechainicio = new Date(cad);
          var fullfechaI = fechainicio.getFullYear + "/" + (fechainicio.getMonth() + 1) + "/" + fechainicio.getDate();

          if (fullfechaI === fechahoy) {

            var imagen;
            if (usuarioeventos[j][k].Tipo === 1) {
              imagen = 'img/taskmdpi.png';
            } else if (usuarioeventos[j][k].Tipo === 2) {
              imagen = 'img/clock-mdpi.png';
            }

            var HoraEv;
            if (fechainicio.getHours() < 10) {
              HoraEv = "0" + fechainicio.getHours();
            } else {
              HoraEv = fechainicio.getHours();
            }
            var MinEv;
            if (fechainicio.getMinutes() < 10) {
              MinEv = "0" + fechainicio.getMinutes();
            } else {
              MinEv = fechainicio.getMinutes();
            }



            //Para saber si es el sistema de horario a.m. o p.m.
            var sishorario;
            if (fechainicio.getHours() >= 0 && fechainicio.getHours() < 12) {
              sishorario = "a.m.";
            } else if (fechainicio.getHours() >= 12 && fechainicio.getHours() <= 23) {
              sishorario = "p.m."
            }
            var HoraInicio = HoraEv + ":" + MinEv + " " + sishorario;



            var newNode = document.createElement('a');
            newNode.setAttribute('href', 'pags/eventosdetalle.html');
            newNode.setAttribute('onClick', 'eventodetalle(' + usuarioeventos[j][k].id + ')');
            newNode.className = 'item-link';
            newNode.innerHTML = "<li class='swipeout'>" +
              "<div class='swipeout-content item-content'>" +
              "<div class='item-media'><img src='" + imagen + "'></div>" +
              "<div class='item-inner'><div class='item-title'>" + usuarioeventos[j][k].Descripcion + "<br>Hoy a las " + HoraInicio + "</div></div>" +
              "</div>" +
              "<div class='swipeout-actions-right'>" +
              "<a class='swipeout-delete'  onClick='eliminar(" + usuarioeventos[j][k].id + ")'>Eliminar</a>" +
              "</div>" +
              "</li>";

            document.getElementById('contscheduleuserpos' + j + '').appendChild(newNode);


          }



        }

      }



    }

    function Pestanatareas(usuarioeventos) {

      console.log(usuarioeventos);
      for (var j = 0; j < usuarioeventos.length; j++) {
        // console.log(usuarioeventos);

        $('#conttaskuserspos' + j + '').empty();


        /*var nodotitulo = document.createElement('div');
            nodotitulo.className ="content-block-title";
            nodotitulo.innerHTML=""+usuarioeventos[j][0].Username+"";
        document.getElementById('bloquecontenidoagenda').appendChild(nodotitulo);*/

        var nodolista = document.createElement('div');
        nodolista.className = "list-block";
        nodolista.innerHTML = "<ul id='conttaskuserspos" + j + "'>" +
          "</ul>";
        document.getElementById('bloquecontenidotareas').appendChild(nodolista);

        for (var k = 0; k < usuarioeventos[j].length; k++) {

          var FI = usuarioeventos[j][k].Fecha_Inicio;
          //// console.log(usuarioeventos[j][k].Descripcion);

          //Fecha Inicio
          var inicio = FI.indexOf("(");
          var fin = FI.indexOf(")");
          var newdate = FI.substring(inicio + 1, fin);
          var cad = parseFloat(newdate);
          var fechainicio = new Date(cad);
          var fullfechaI = fechainicio.getFullYear + "/" + (fechainicio.getMonth() + 1) + "/" + fechainicio.getDate();

          // if(fullfechaI===fechahoy){
          if (usuarioeventos[j][k].Tipo === 1) {
            var imagen;
            if (usuarioeventos[j][k].Tipo === 1) {
              imagen = 'img/taskmdpi.png';
            } else if (usuarioeventos[j][k].Tipo === 2) {
              imagen = 'img/clock-mdpi.png';
            }

            var HoraEv;
            if (fechainicio.getHours() < 10) {
              HoraEv = "0" + fechainicio.getHours();
            } else {
              HoraEv = fechainicio.getHours();
            }
            var MinEv;
            if (fechainicio.getMinutes() < 10) {
              MinEv = "0" + fechainicio.getMinutes();
            } else {
              MinEv = fechainicio.getMinutes();
            }



            //Para saber si es el sistema de horario a.m. o p.m.
            var sishorario;
            if (fechainicio.getHours() >= 0 && fechainicio.getHours() < 12) {
              sishorario = "a.m.";
            } else if (fechainicio.getHours() >= 12 && fechainicio.getHours() <= 23) {
              sishorario = "p.m."
            }
            var HoraInicio = HoraEv + ":" + MinEv + " " + sishorario;



            var newNode = document.createElement('a');
            newNode.setAttribute('href', 'pags/eventosdetalle.html');
            newNode.setAttribute('onClick', 'eventodetalle(' + usuarioeventos[j][k].id + ')');
            newNode.className = 'item-link';
            newNode.innerHTML = "<li class='swipeout'>" +
              "<div class='swipeout-content item-content'>" +
              "<div class='item-media'><img src='" + imagen + "'></div>" +
              "<div class='item-inner'><div class='item-title'>" + usuarioeventos[j][k].Descripcion + "</div></div>" +
              "</div>" +
              "<div class='swipeout-actions-right'>" +
              "<a class='swipeout-delete'  onClick='eliminar(" + usuarioeventos[j][k].id + ")'>Eliminar</a>" +
              "</div>" +
              "</li>";

            document.getElementById('conttaskuserspos' + j + '').appendChild(newNode);


          }



        }

      }

    }



    //Pestaña Calendario de Eventos

    $(function() {
      //Pestaña Tareas
      var idUsuario = sessionStorage.getItem('idUsuario');
      var idEmpleado = sessionStorage.getItem("idEmpleado");
      var idParticipante;
      var consulta;
      //usuario solo con suscripcion
      if (idUsuario > 0 && idEmpleado == "null") {
        idParticipante = idUsuario;
        consulta = "SELECT * From dbCalendario_Tareas t  inner join dbCalendario_Tareas_Participantes p on p.idTarea=t.id Where p.id_Participante=" + idParticipante + " AND t.Tipo=2";
      }
      //usuario EMpleado de departamento
      else if (idUsuario > 0 && idEmpleado != "null") {
        idParticipante = idEmpleado;
        consulta = "SELECT * From dbCalendario_Tareas t  inner join dbCalendario_Tareas_Participantes p on p.idTarea=t.id Where p.id_Participante=" + idParticipante + " AND t.Tipo=2";
      }
      //Cuando sea Administrador
      else if (idUsuario == -1) {
        idParticipante = idUsuario;
        consulta = "SELECT * From dbCalendario_Tareas t Where t.Tipo=2;";
      }

      var idEmpleado = sessionStorage.getItem('idEmpleado');
      var deviceKey = localStorage.getItem('DeviceKey');
      var Mobilekey = localStorage.getItem('AzureMobile');
      /*var consulta="SELECT * From dbCalendario_Tareas t  inner join dbCalendario_Tareas_Participantes p on p.idTarea=t.id Where p.id_Participante="+idParticipante+" AND t.Tipo=2;";*/


      var postdata = {};

      postdata.deviceKey = deviceKey;
      postdata.mobileKey = Mobilekey;
      postdata.query = consulta;
      //alert("entro en llamada ajax");
      $.ajax({
        type: "GET",
        url: "http://admix.com.mx:8090/Test.asmx/Query",
        dataType: 'xml',
        contentType: 'application/xml;charset=utf-8',
        data: postdata,
        success: pintardotsdeeventos,
        error: function(responseError, msg, e) {
          var tempError = JSON.stringify(responseError);
          //// console.log(tempError.responseText);
          myApp.alert("Error, de Carga del Servicio");
        }
      });
    });

    /***Aqui va el pintado de los dots***/

    var Fechasdot = [];

    function pintardotsdeeventos(data) {

      var ArrayEvento = $.parseJSON(data.documentElement.innerHTML);
      var objectoEvento = $.parseJSON(ArrayEvento);
      //// console.log(objectoEvento);

      for (var i = 0; i < objectoEvento.length; i++) {

        if (objectoEvento[i].Fecha_Inicio === null) {
          myApp.alert("Error, Hay un evento con fechas nulas");
        }



        var FI = objectoEvento[i].Fecha_Inicio;
        //Fecha Inicio
        var inicio = FI.indexOf("(");
        var fin = FI.indexOf(")");
        var newdate = FI.substring(inicio + 1, fin);
        var cad = parseFloat(newdate);
        var fechainicio = new Date(cad);

        var mes = (fechainicio.getMonth() + 1);
        var dia = (fechainicio.getDate());

        var mesfull;
        if (mes < 10) {
          mesfull = "0" + mes;
        } else {
          mesfull = mes;
        }
        var diafull;
        if (dia < 10) {
          diafull = "0" + dia;
        } else {
          diafull = dia;
        }

        var fullfechaI = fechainicio.getFullYear() + "/" + mesfull + "/" + diafull;

        //Fecha Fin
        var FF = objectoEvento[i].Fecha_Fin;

        var inicio = FF.indexOf("(");
        var fin = FF.indexOf(")");
        var newdatef = FF.substring(inicio + 1, fin);
        var cadf = parseFloat(newdatef);
        var fechafin = new Date(cadf);

        var mesf = (fechafin.getMonth() + 1);
        var diaf = (fechafin.getDate());

        var mesfullf;
        if (mesf < 10) {
          mesfullf = "0" + mesf;
        } else {
          mesfullf = mesf;
        }
        var diafullf;
        if (diaf < 10) {
          diafullf = "0" + diaf;
        } else {
          diafullf = diaf;
        }

        var fullfechaf = fechafin.getFullYear() + "/" + mesfullf + "/" + diafullf;

        var dateini = new Date(fullfechaI);
        var datefin = new Date(fullfechaf);

        var fechasdotobjecto = {
          from: dateini,
          to: datefin
        };
        Fechasdot[i] = fechasdotobjecto;

      }
      //// console.log(Fechasdot);
      var date = new Date();
      var monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      var dayNames = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

      var calendarEvents = myApp.calendar({

        container: '#calendar-inline-container',
        input: '#calendar-default',
        //toolbar:true,
        events: Fechasdot,

        value: [date],

        weekHeader: true,
        toolbarTemplate: '<div class="toolbar calendar-custom-toolbar">' +
          '<div class="toolbar-inner">' +
          '<div class="left">' +
          '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' +
          '</div>' +
          '<div class="center"></div>' +
          '<div class="right">' +
          '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' +
          '</div>' +
          '</div>' +
          '</div>'
          /* +
                  '<div class="picker-modal-inner">'+
                    '<div id="diassemana" class="picker-calendar-week-days">' +
                       '<div class="picker-calendar-week-day">Lun</div>' +
                       '<div class="picker-calendar-week-day">Mar</div>' +
                       '<div class="picker-calendar-week-day">Mie</div>'+
                       '<div class="picker-calendar-week-day">Jue</div>'+
                       '<div class="picker-calendar-week-day">Vie</div>' +
                       '<div class="picker-calendar-week-day picker-calendar-week-day-weekend"> Sab</div>' +
                       '<div class="picker-calendar-week-day picker-calendar-week-day-weekend"> Dom</div>' +
                  '</div>'*/
          ,
        onOpen: function(p) {
          //$$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
          $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] + ', ' + p.currentYear);


          // $$('.picker-calendar-week-day .center').text(daynames[p.dayNamesShort]);
          $$('.calendar-custom-toolbar .left .link').on('click', function() {
            calendarEvents.prevMonth();
          });
          $$('.calendar-custom-toolbar .right .link').on('click', function() {
            calendarEvents.nextMonth();
          });

        },
        onMonthYearChangeStart: function(p) {
          $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] + ', ' + p.currentYear);

        },
        onDayClick: function(p, dayContainer, year, month, day) {
          //myApp.alert("Año"+year+"month"+month+"day"+day);
        }

      });

      /*********************Mostreo de Eventos en el Calendario*********************/
      //Se muestra la lista de eventos seleccionados
      var fechaselec = document.getElementById('calendar-default').value;
      document.getElementById('calendar-default').onchange = function() {

        mostrareventos();

      };

      function mostrareventos() {
        $("#contcaleventos").empty();
        var idUsuario = sessionStorage.getItem('idUsuario');
        var idEmpleado = sessionStorage.getItem("idEmpleado");
        var idParticipante;
        var consulta;
        //usuario solo con suscripcion
        if (idUsuario > 0 && idEmpleado == "null") {
          idParticipante = idUsuario;
          consulta = "SELECT * From dbCalendario_Tareas t  inner join dbCalendario_Tareas_Participantes p on p.idTarea=t.id Where p.id_Participante=" + idParticipante + "AND t.Tipo=2;";
        }
        //usuario EMpleado de departamento
        else if (idUsuario > 0 && idEmpleado != "null") {
          idParticipante = idEmpleado;
          consulta = "SELECT * From dbCalendario_Tareas t  inner join dbCalendario_Tareas_Participantes p on p.idTarea=t.id Where p.id_Participante=" + idParticipante + "AND t.Tipo=2;";
        }
        //Cuando sea Administrador
        else if (idUsuario == -1) {
          idParticipante = idUsuario;
          consulta = "SELECT * From dbCalendario_Tareas t Where t.Tipo=2;";
        }


        fechaselec = document.getElementById('calendar-default').value;
        //myApp.alert("fecha de hoy"+fechaselec);
        $(function() {
          myApp.showIndicator();
          var idEmpleado = sessionStorage.getItem("idEmpleado");
          var deviceKey = localStorage.getItem('DeviceKey');
          var Mobilekey = localStorage.getItem('AzureMobile');

          /*var consulta="SELECT * From dbCalendario_Tareas t  inner join dbCalendario_Tareas_Participantes p on p.idTarea=t.id Where p.id_Participante="+idParticipante+"AND t.Tipo=2;";*/

          var postdata = {};

          postdata.deviceKey = deviceKey;
          postdata.mobileKey = Mobilekey;
          postdata.query = consulta;
          //alert("entro en llamada ajax");
          $.ajax({
            type: "GET",
            url: "http://admix.com.mx:8090/Test.asmx/Query",
            dataType: 'xml',
            contentType: 'application/xml;charset=utf-8',
            data: postdata,
            success: mostrareventosclick,
            error: function(responseError, msg, e) {
              var tempError = JSON.stringify(responseError);
              //// console.log(tempError.responseText);
              myApp.alert("Error, de Carga del Servicio");
            }
          });
        });

        var arraytempeventosel = [];

        function mostrareventosclick(data) {

          var Arraydata = $.parseJSON(data.documentElement.innerHTML);
          var eventostodos = $.parseJSON(Arraydata);
          //// console.log(eventostodos);


          for (var j = 0; j < eventostodos.length; j++) {

            var FI = eventostodos[j].Fecha_Inicio;


            //Fecha Inicio
            var inicio = FI.indexOf("(");
            var fin = FI.indexOf(")");
            var newdate = FI.substring(inicio + 1, fin);
            var cad = parseFloat(newdate);
            var fechainicio = new Date(cad);

            var mes = (fechainicio.getMonth() + 1);
            var dia = (fechainicio.getDate());

            var mesfull;
            if (mes < 10) {
              mesfull = "0" + mes;
            } else {
              mesfull = mes;
            }
            var diafull;
            if (dia < 10) {
              diafull = "0" + dia;
            } else {
              diafull = dia;
            }

            var fullfechaI = fechainicio.getFullYear() + "-" + mesfull + "-" + diafull;

            if (fullfechaI === fechaselec) {
              arraytempeventosel.push(eventostodos[j]);
              // myApp.alert("si es igual");
              // // console.log(arraytempeventosel);
            } else {
              myApp.hideIndicator();
            }
          }

          // console.log(arraytempeventosel);
          //Cargamos el nombre del participante para cada evento


          //console.log(arraytempeventosel);
          var cont = 0;
          var nombrespart = [];

          /*function cargaidpart(idpart,c){

              nombrespart[c]=idpart;

          }
          console.log(nombrespart);*/


          for (var k = 0; k < arraytempeventosel.length; k++) {

            var idTarea = arraytempeventosel[k].id;
            participante(idTarea);

            function participante(idTarea) {
              var deviceKey = localStorage.getItem('DeviceKey');
              var Mobilekey = localStorage.getItem('AzureMobile');
              var consultapart = "Select * from dbCalendario_Tareas_Participantes part Where idTarea=" + idTarea;
              var postdata = {};

              postdata.deviceKey = deviceKey;
              postdata.mobileKey = Mobilekey;
              postdata.query = consultapart;
              //alert("entro en llamada ajax");
              $.ajax({
                type: "GET",
                url: "http://admix.com.mx:8090/Test.asmx/Query",
                dataType: 'xml',
                contentType: 'application/xml;charset=utf-8',
                data: postdata,
                success: parttarea,
                error: function(responseError, msg, e) {
                  var tempError = JSON.stringify(responseError);
                  //// console.log(tempError.responseText);
                  myApp.alert("Error, de Carga del Servicio");
                }
              });

              function parttarea(data) {
                var arraypart = $.parseJSON(data.documentElement.innerHTML);
                var part = $.parseJSON(arraypart);
                //tenemos el idparticipante procedemos a verificar si es un empleado
                var idpart = part[0].id_Participante;


                var deviceKey = localStorage.getItem('DeviceKey');
                var Mobilekey = localStorage.getItem('AzureMobile');
                var consultapart = "Select * from dbEmpleados emp Where id=" + idpart;
                var postdata = {};

                postdata.deviceKey = deviceKey;
                postdata.mobileKey = Mobilekey;
                postdata.query = consultapart;
                //alert("entro en llamada ajax");
                $.ajax({
                  type: "GET",
                  url: "http://admix.com.mx:8090/Test.asmx/Query",
                  dataType: 'xml',
                  contentType: 'application/xml;charset=utf-8',
                  data: postdata,
                  success: partempleado,
                  error: function(responseError, msg, e) {
                    var tempError = JSON.stringify(responseError);
                    //// console.log(tempError.responseText);
                    myApp.alert("Error, de Carga del Servicio");
                  }
                });

                function partempleado(data) {
                  var arraypartemp = $.parseJSON(data.documentElement.innerHTML);
                  // var partempl=$.parseJSON(arraypartemp);



                  if (arraypartemp[0] != null) {
                    //el evento es de un empleado
                    // nombrespart[cont]=arraypartemp[0].id_Participante;
                    //cont++;
                    var deviceKey = localStorage.getItem('DeviceKey');
                    var Mobilekey = localStorage.getItem('AzureMobile');
                    var consultapart = "Select * from dbEmpleados  Where id=" + idpart;
                    var postdata = {};

                    postdata.deviceKey = deviceKey;
                    postdata.mobileKey = Mobilekey;
                    postdata.query = consultapart;
                    //alert("entro en llamada ajax");
                    $.ajax({
                      type: "GET",
                      url: "http://admix.com.mx:8090/Test.asmx/Query",
                      dataType: 'xml',
                      contentType: 'application/xml;charset=utf-8',
                      data: postdata,
                      success: nombreempleado,
                      error: function(responseError, msg, e) {
                        var tempError = JSON.stringify(responseError);
                        //// console.log(tempError.responseText);
                        myApp.alert("Error, de Carga del Servicio");
                      }
                    });

                    function nombreempleado(data) {
                      var arranameempl = $.parseJSON(data.documentElement.innerHTML);
                      var nombreempleado = $.parseJSON(arranameempl);
                      NombreParticipante = nombreempleado[0].Nombre;
                      cargaidpart(idpart, NombreParticipante, idTarea);
                    }

                  } else {
                    //es el administrador


                    if (idpart == -1) {

                      NombreParticipante = "Administrador";

                      cargaidpart(idpart, NombreParticipante, idTarea);
                      //es un usuario con sucripcion
                    } else if (idpart > 0) {
                      var deviceKey = localStorage.getItem('DeviceKey');
                      var Mobilekey = localStorage.getItem('AzureMobile');
                      var consultapart = "Select * from syUsers  Where id=" + idpart;
                      var postdata = {};

                      postdata.deviceKey = deviceKey;
                      postdata.mobileKey = Mobilekey;
                      postdata.query = consultapart;
                      //alert("entro en llamada ajax");
                      $.ajax({
                        type: "GET",
                        url: "http://admix.com.mx:8090/Test.asmx/Query",
                        dataType: 'xml',
                        contentType: 'application/xml;charset=utf-8',
                        data: postdata,
                        success: nombreusuario,
                        error: function(responseError, msg, e) {
                          var tempError = JSON.stringify(responseError);
                          //// console.log(tempError.responseText);
                          myApp.alert("Error, de Carga del Servicio");
                        }
                      });

                      function nombreusuario(data) {
                        var arranameuser = $.parseJSON(data.documentElement.innerHTML);
                        var nombreusuario = $.parseJSON(arranameuser);
                        NombreParticipante = nombreusuario[0].Username;
                        cargaidpart(idpart, NombreParticipante, idTarea);
                      }

                      //NombreParticipante="Usuario";


                    }

                    //elevento es de un cliente o administrador
                    //nombrespart[cont]=idpart;

                    //cargaidpart(idpart);
                    //cont++;
                    //console.log(idpart);
                    //return arraypartemp;

                  }

                  //console.log(arraypartemp);

                }

              }

            }

            function cargaidpart(idpart, Nombrepart, idTarea) {

              //console.log(arraytempeventosel);
              // var NombreParticipante;
              //console.log(idpart);
              //console.log(idTarea);
              var deviceKey = localStorage.getItem('DeviceKey');
              var Mobilekey = localStorage.getItem('AzureMobile');
              var consultapart = "Select * from dbCalendario_Tareas tar inner join dbCalendario_Tareas_Participantes par on tar.id=par.idTarea  Where par.idTarea=" + idTarea + " and " + "par.id_Participante=" + idpart;
              var postdata = {};

              postdata.deviceKey = deviceKey;
              postdata.mobileKey = Mobilekey;
              postdata.query = consultapart;
              //alert("entro en llamada ajax");
              $.ajax({
                type: "GET",
                url: "http://admix.com.mx:8090/Test.asmx/Query",
                dataType: 'xml',
                contentType: 'application/xml;charset=utf-8',
                data: postdata,
                success: tareapart,
                error: function(responseError, msg, e) {
                  var tempError = JSON.stringify(responseError);
                  //// console.log(tempError.responseText);
                  myApp.alert("Error, de Carga del Servicio");
                }
              });

              function tareapart(data) {
                var arraytareapart = $.parseJSON(data.documentElement.innerHTML);
                var tareapart = $.parseJSON(arraytareapart);
                //console.log(tareapart);
                //console.log(idpart);
                //console.log(Nombrepart);

                var imagen;
                if (tareapart[0].Tipo === 1) {
                  imagen = 'img/taskmdpi.png';
                } else if (tareapart[0].Tipo === 2) {
                  imagen = 'img/clock-mdpi.png';
                }

                //Estado
                var Estado = "null";
                var Estadowithcolor;
                if (tareapart[0].Estado === 0) {
                  Estado = "Pendiente";
                  Estadowithcolor = "<span style='color:#FF9800'>" + Estado + "</span>";
                }
                if (tareapart[0].Estado === 1) {
                  Estado = "En Proceso";
                  Estadowithcolor = "<span style='color:#FF9800'>" + Estado + "</span>";
                }
                if (tareapart[0].Estado === 2) {
                  Estado = "Terminado";
                  Estadowithcolor = "<span style='color:#009688'>" + Estado + "</span>";
                }
                if (tareapart[0].Estado === 3) {
                  Estado = "Cancelado";
                  Estadowithcolor = "<span style='color:black'>" + Estado + "</span>";
                }


                var newNode = document.createElement('a');
                newNode.setAttribute('href', 'pags/eventosdetalle.html');
                newNode.setAttribute('onClick', 'eventodetalle(' + tareapart[0].id + ')');
                newNode.className = 'item-link';
                newNode.innerHTML = "<li class='swipeout'>" +
                  "<div class='swipeout-content item-content'>" +
                  "<div class='item-media'><img src='" + imagen + "'></div>" +
                  "<div class='item-inner'><div class='item-title'>" + tareapart[0].Descripcion + "<br><span style='color:#2196F3'>" + Nombrepart + "</span><br>" + Estadowithcolor + "</div></div>" +
                  "</div>" +
                  "<div class='swipeout-actions-right'>" +
                  "<a class='swipeout-delete'  onClick='eliminar(" + tareapart[0].id + ")'>Eliminar</a>" +

                  "</div>" +
                  "</li>";

                document.getElementById('contcaleventos').appendChild(newNode);
                myApp.hideIndicator();
              }


            }

          }

        }
      }
    }

    function onSuccess(data) {


      var ArrayData = $.parseJSON(data.documentElement.innerHTML);
      if (ArrayData[0] == null) {
        myApp.alert("Actualmente no tiene Tareas", "Agregue una Tarea");
      } else {
        var obj = jQuery.parseJSON(ArrayData);
        //myApp.alert("Consulta realizada con exito"+obj[0].Descripcion);
        // // console.log(obj);

        //Cambiar el epochtime a date//
        var FI = obj[0].Fecha_Inicio;
        var FF = obj[0].Fecha_Fin;

        //Fecha Inicio
        var inicio = FI.indexOf("(");
        var fin = FI.indexOf(")");
        var newdate = FI.substring(inicio + 1, fin);
        var cad = parseFloat(newdate);
        var fechainicio = new Date(cad);

        /*//Fecha Fin
            var iniciof = FF.indexOf("(");
            var finf = FF.indexOf(")");
            var newdatef=FF.substring(iniciof + 1, finf);
            var cadf=parseFloat(newdatef);
            var fechafin = new Date(cadf);*/



        for (var i = 0; i < obj.length; i++) {

          /*var newNode = document.createElement('li');
          newNode.setAttribute('href','pags/eventosdetalle.html');
          newNode.setAttribute('onClick','eventodetalle('+obj[i].id+')');
          newNode.className = 'swipeout';
          newNode.innerHTML ="<div class='swipeout-content item-content'>"+
                             "<div class='item-media'><img src='img/clock-mdpi.png'></div>"+
                             "<div class='item-inner'><div class='item-title'>Terminar detalles de Proyecto</div></div>"+
                             "</div>"+
                             "<div class='swipeout-actions-right'>"+
                             "<a href='#' class='action1 bg-red'>Eliminar</a>"+
                             "</div>" ;

           document.getElementById('contlista').appendChild(newNode);*/

          var Estado = "null";
          var Estadowithcolor;
          if (obj[i].Estado === 0) {
            Estado = "P";
            Estadowithcolor = "<span class='badge' style='background:#rgba(33, 150, 243, 0.67)'>" + Estado + "</span>";
          }
          if (obj[i].Estado === 1) {
            Estado = "P";
            Estadowithcolor = "<span class='badge' style='background:#FF9800'>" + Estado + "</span>";
          }
          if (obj[i].Estado === 2) {
            Estado = "T";
            Estadowithcolor = "<span  class='badge' style='background:#009688'>" + Estado + "</span>";
          }
          if (obj[i].Estado === 3) {
            Estado = "C";
            Estadowithcolor = "<span class='badge' style='background:black'>" + Estado + "</span>";
          }


          var imagen;
          if (obj[i].Tipo === 1) {
            imagen = 'img/taskmdpi.png';
          } else if (obj[i].Tipo === 2) {
            imagen = 'img/clock-mdpi.png';
          }

          var newNode = document.createElement('a');
          newNode.setAttribute('href', 'pags/eventosdetalle.html');
          newNode.setAttribute('onClick', 'eventodetalle(' + obj[i].id + ')');
          newNode.className = 'item-link';
          newNode.innerHTML = "<li class='swipeout'>" +
            "<div class='swipeout-content item-content'>" +
            "<div class='item-media'><img src='" + imagen + "'></div>" +
            "<div class='item-inner'><div class='item-title'>" + obj[i].Descripcion + "<br>" +
            "</div>" +
            "<div class='item-after'>" + Estadowithcolor + "</div>" +
            "</div>" +

            "</div>" +
            "<div class='swipeout-actions-right'>" +
            "<a class='swipeout-delete' onClick='eliminar(" + obj[i].id + ")'>Eliminar</a>" +
            "</div>" +
            "</li>";

          document.getElementById('contlista').appendChild(newNode);


        }
        /*var i;
        for(i=0;i<obj.length;i++){
          document.getElementById('tarea'+i).onclick=function(){
            myApp.alert("Esta es la  tarea y el ide es:"+obj[this.value].Descripcion);
          }

        }*/
      }
    }



  });

});



function eventodetalle(id) {

  //Sacamos todos los eventos del usuario que ya hayan pasado


  // myApp.alert("it works "+id);
  //Se deja asi para que cualquiera pueda ver la tarea
  var deviceKey = localStorage.getItem('DeviceKey');
  var Mobilekey = localStorage.getItem('AzureMobile');
  var consulta = 'SELECT * FROM dbCalendario_Tareas Where id=' + id;

  var postdata = {};

  postdata.deviceKey = deviceKey;
  postdata.mobileKey = Mobilekey;
  postdata.query = consulta;
  //alert("entro en llamada ajax");
  $.ajax({
    type: "GET",
    url: "http://admix.com.mx:8090/Test.asmx/Query",
    dataType: 'xml',
    contentType: 'application/xml;charset=utf-8',
    data: postdata,
    success: Success,
    error: function(responseError, msg, e) {
      var tempError = JSON.stringify(responseError);
      // // console.log(tempError.responseText);
      myApp.alert("Error, de Carga del Servicio");
    }
  });
}

function Success(data) {


  var ArrayData = $.parseJSON(data.documentElement.innerHTML);
  var objecto = $.parseJSON(ArrayData);
  console.log(objecto);
  var Tipo = objecto[0].Tipo;
  var Cliente = objecto[0].id_Cliente;

  //Extraemos el Nombre del  Participante del Evento

  var idUsuario = sessionStorage.getItem('idUsuario');
  var idEmpleado = sessionStorage.getItem('idEmpleado');

  //Es un cliente con suscripcion
  var NombreParticipante;
  var queryparticipante;
  if (idUsuario > 0 && idEmpleado == "null") {

    queryparticipante = 'SELECT s.Username FROM syUsers s Where id=' + idUsuario;

    //Es un Empleado con suscripcion
  } else if (idUsuario > 0 && idEmpleado != "null") {
    queryparticipante = 'SELECT e.Nombre FROM dbEmpleados e Where id=' + idEmpleado;
    //Es el administrador
  } else if (idUsuario == -1) {

    //queryparticipante='SELECT s.Username FROM syUsers s Where id='+idUsuario;
    NombreParticipante = "Administrador";
  }
  //por defecto es el administrador
  if (queryparticipante != undefined) {
    var deviceKey = localStorage.getItem('DeviceKey');
    var Mobilekey = localStorage.getItem('AzureMobile');


    var postdata = {};

    postdata.deviceKey = deviceKey;
    postdata.mobileKey = Mobilekey;
    postdata.query = queryparticipante;
    //alert("entro en llamada ajax");
    $.ajax({
      type: "GET",
      url: "http://admix.com.mx:8090/Test.asmx/Query",
      dataType: 'xml',
      contentType: 'application/xml;charset=utf-8',
      data: postdata,
      success: SuccNombrePart,
      error: function(responseError, msg, e) {
        var tempError = JSON.stringify(responseError);
        // // console.log(tempError.responseText);
        myApp.alert("Error, de Carga del Servicio");
      }
    });

    function SuccNombrePart(data) {
      var arraypartname = $.parseJSON(data.documentElement.innerHTML);
      var partname = $.parseJSON(arraypartname);

      //verificamos si el participante es el cliente,empleado o administrador
      if (partname[0].Username != undefined) {
        NombreParticipante = partname[0].Username;
      } else if (partname[0].Nombre != undefined) {
        NombreParticipante = partname[0].Nombre;
      }
      document.getElementById('cajaparticipante').value = NombreParticipante;

      //console.log(partname);
    }
  } else {
    document.getElementById('cajaparticipante').value = NombreParticipante;
  }

  if (Tipo == 1) {
    document.getElementById('itemcliente').style.display = "none";
  } else if (Tipo == 2) {
    if (Cliente != null && Cliente > 0) {
      //obtenemos el nombre del cliente
      var deviceKey = localStorage.getItem('DeviceKey');
      var Mobilekey = localStorage.getItem('AzureMobile');
      var consulta = 'SELECT c.Nombre,c.RFC  FROM dbClientes c Where id=' + Cliente;

      var postdata = {};

      postdata.deviceKey = deviceKey;
      postdata.mobileKey = Mobilekey;
      postdata.query = consulta;
      //alert("entro en llamada ajax");
      $.ajax({
        type: "GET",
        url: "http://admix.com.mx:8090/Test.asmx/Query",
        dataType: 'xml',
        contentType: 'application/xml;charset=utf-8',
        data: postdata,
        success: Successcliente,
        error: function(responseError, msg, e) {
          var tempError = JSON.stringify(responseError);
          // // console.log(tempError.responseText);
          myApp.alert("Error, de Carga del Servicio");
        }
      });

      function Successcliente(data) {
        var arracliente = $.parseJSON(data.documentElement.innerHTML);
        var cliente = $.parseJSON(arracliente);

        //console.log(cliente);
        var clienteinfo = cliente[0].Nombre + '\n' + "RFC:" + cliente[0].RFC;
        document.getElementById('cajacliente').value = clienteinfo;
      }

      document.getElementById('itemcliente').style.display = "block";


    } else {
      document.getElementById('itemcliente').style.display = "none";
    }

  }
  //Cambiar el epochtime a date//
  var FI = objecto[0].Fecha_Inicio;

  //Fecha Inicio
  var inicio = FI.indexOf("(");
  var fin = FI.indexOf(")");
  var newdate = FI.substring(inicio + 1, fin);
  var cad = parseFloat(newdate);
  var fechainicio = new Date(cad);

  var diascompletos;
  if (fechainicio.getDate() < 10) {
    diascompletos = "0" + fechainicio.getDate();
  } else {
    diascompletos = fechainicio.getDate();
  }

  var mesescompletos;
  if ((fechainicio.getMonth() + 1) < 10) {
    mesescompletos = "0" + (fechainicio.getMonth() + 1);
  } else {
    mesescompletos = (fechainicio.getMonth() + 1);
  }

  var minutoscompletos;
  if (fechainicio.getMinutes() < 10) {
    minutoscompletos = "0" + fechainicio.getMinutes();
  } else {
    minutoscompletos = fechainicio.getMinutes();
  }

  var horacompleta;
  if (fechainicio.getHours() < 10) {
    horacompleta = "0" + fechainicio.getHours();
  } else {
    horacompleta = fechainicio.getHours();
  }

  var fechainiciosinhoras = fechainicio.getFullYear() + "/" + mesescompletos + "/" + diascompletos;
  var fullfechaInicio = fechainicio.getFullYear() + "/" + mesescompletos + "/" + diascompletos + " " + horacompleta + ":" + minutoscompletos;


  var fullfechalimite;
  if (objecto[0].Tipo == 1) {

    //Cambiar el epochtime a date//
    var FI = objecto[0].Fecha_Inicio;

    if (objecto[0].Fecha_Limite != null) {
      var FL = objecto[0].Fecha_Limite;

      //Fecha Limite
      var iniciol = FL.indexOf("(");
      var finl = FL.indexOf(")");
      var newdatel = FL.substring(iniciol + 1, finl);
      var cadl = parseFloat(newdatel);
      var fechalimite = new Date(cadl);

      var diascompletosl;
      if (fechalimite.getDate() < 10) {
        diascompletosl = "0" + fechalimite.getDate();
      } else {
        diascompletosl = fechalimite.getDate();
      }

      var mesescompletosl;
      if ((fechalimite.getMonth() + 1) < 10) {
        mesescompletosl = "0" + (fechalimite.getMonth() + 1);
      } else {
        mesescompletosl = (fechalimite.getMonth() + 1);
      }

      var minutoscompletosl;
      if (fechalimite.getMinutes() < 10) {
        minutoscompletosl = "0" + fechalimite.getMinutes();
      } else {
        minutoscompletosl = fechalimite.getMinutes();
      }

      var horacompletal;
      if (fechalimite.getHours() < 10) {
        horacompletal = "0" + fechalimite.getHours();
      } else {
        horacompletal = fechalimite.getHours();
      }

      var fechalimitesinhoras = fechalimite.getFullYear() + "/" + mesescompletosl + "/" + diascompletosl;
      var horasfechalimite = horacompletal + ":" + minutoscompletosl;
      fullfechalimite = fechalimite.getFullYear() + "/" + mesescompletosl + "/" + diascompletosl + " " + horacompletal + ":" + minutoscompletosl;

      document.getElementById('cajafechalimite').value = fullfechalimite;

    } else {
      myApp.alert("Tarea sin programacion de la fecha limite ", "Atención");
    }
    //si el estado esta como terminado que muestre la fecha de fin
    if (objecto[0].Estado == 2 || objecto[0].Estado == 3) {

      //Fecha Fin
      var FF = objecto[0].Fecha_Fin;
      var iniciof = FF.indexOf("(");
      var finf = FF.indexOf(")");
      var newdatef = FF.substring(iniciof + 1, finf);
      var cadf = parseFloat(newdatef);
      var fechafin = new Date(cadf);

      var diascompletosf;
      if (fechafin.getDate() < 10) {
        diascompletosf = "0" + fechafin.getDate();
      } else {
        diascompletosf = fechafin.getDate();
      }

      var mesescompletosf;
      if ((fechafin.getMonth() + 1) < 10) {
        mesescompletosf = "0" + (fechafin.getMonth() + 1);
      } else {
        mesescompletosf = (fechafin.getMonth() + 1);
      }

      var horacompletaf;
      if (fechafin.getHours() < 10) {
        horacompletaf = "0" + fechafin.getHours();
      } else {
        horacompletaf = fechafin.getHours();
      }


      var minutoscompletosf;
      if (fechafin.getMinutes() < 10) {
        minutoscompletosf = "0" + fechafin.getMinutes();
      } else {
        minutoscompletosf = fechafin.getMinutes();
      }
      var fechafinsinhoras = fechafin.getFullYear() + "/" + mesescompletosf + "/" + diascompletosf;
      var fullfechafin = fechafin.getFullYear() + "/" + mesescompletosf + "/" + diascompletosf + " " + horacompletaf + ":" + minutoscompletosf;

      document.getElementById("cajafechafin").value = fullfechafin;
    }


  } else if (objecto[0].Tipo == 2) {

    //Fecha Fin
    var FF = objecto[0].Fecha_Fin;
    var iniciof = FF.indexOf("(");
    var finf = FF.indexOf(")");
    var newdatef = FF.substring(iniciof + 1, finf);
    var cadf = parseFloat(newdatef);
    var fechafin = new Date(cadf);

    var diascompletosf;
    if (fechafin.getDate() < 10) {
      diascompletosf = "0" + fechafin.getDate();
    } else {
      diascompletosf = fechafin.getDate();
    }

    var mesescompletosf;
    if ((fechafin.getMonth() + 1) < 10) {
      mesescompletosf = "0" + (fechafin.getMonth() + 1);
    } else {
      mesescompletosf = (fechafin.getMonth() + 1);
    }

    var horacompletaf;
    if (fechafin.getHours() < 10) {
      horacompletaf = "0" + fechafin.getHours();
    } else {
      horacompletaf = fechafin.getHours();
    }


    var minutoscompletosf;
    if (fechafin.getMinutes() < 10) {
      minutoscompletosf = "0" + fechafin.getMinutes();
    } else {
      minutoscompletosf = fechafin.getMinutes();
    }
    var fechafinsinhoras = fechafin.getFullYear() + "/" + mesescompletosf + "/" + diascompletosf;
    var fullfechafin = fechafin.getFullYear() + "/" + mesescompletosf + "/" + diascompletosf + " " + horacompletaf + ":" + minutoscompletosf;

    document.getElementById("cajafechafin").value = fullfechafin;

    var fechafincompleta = fullfechafin;
    var FFsinhoras = fechafinsinhoras;
    var horasfin = (horacompletaf + ":" + minutoscompletosf);
  }


  //Prioridad
  var Prioridad = "null";

  if (objecto[0].Prioridad === 0) {
    Prioridad = "Sin Prioridad";
  }
  if (objecto[0].Prioridad === 1) {
    Prioridad = "Baja";
  }
  if (objecto[0].Prioridad === 2) {
    Prioridad = "Media";
  }
  if (objecto[0].Prioridad === 3) {
    Prioridad = "Alta";
  }

  //Estado
  var Estado = "null";
  if (objecto[0].Estado === 0) {
    Estado = "Pendiente";

  }
  if (objecto[0].Estado === 1) {
    Estado = "En Proceso";
  }
  if (objecto[0].Estado === 2) {
    Estado = "Terminado";
  }
  if (objecto[0].Estado === 3) {
    Estado = "Cancelado";
  }

  //Tipo Evento
  var Tipo = "null";
  if (objecto[0].Tipo === 1) {
    Tipo = "Tarea";
  }
  if (objecto[0].Tipo === 2) {
    Tipo = "Cita";
  }
  if (objecto[0].Tipo === 3) {
    Tipo = "Proyecto";
  }

  var todoeldia = "";
  if (objecto[0].Fecha_DiaCompleto == true) {
    todoeldia = "Si";
  } else {
    todoeldia = "No";
  }

  //// console.log(objecto);
  document.getElementById("cajanombreevento").value = objecto[0].Descripcion;
  document.getElementById("cajaprioridad").value = Prioridad;
  document.getElementById("cajaestadoevento").value = Estado;
  document.getElementById("cajatipoevento").value = Tipo;
  document.getElementById("cajanotasinicio").value = objecto[0].Notas_Inicio;
  document.getElementById("cajanotasfin").value = objecto[0].Notas_Fin;
  document.getElementById("cajafechainicio").value = fullfechaInicio;

  document.getElementById("cajatodoeldia").value = todoeldia;
  document.getElementById("cajalugar").value = objecto[0].Lugar;
  document.getElementById("cajatags").value = objecto[0].Tags;


  //variables a ser enviadas a otro formulario
  var descripcion = objecto[0].Descripcion;
  var estado = objecto[0].Estado;
  var fechaadd = objecto[0].Fecha_Add;
  var fechadiacompleto = objecto[0].Fecha_DiaCompleto;
  var fechaedit = objecto[0].Fecha_Edit;
  var fechafin = objecto[0].Fecha_Fin;
  var fechainicio = objecto[0].Fecha_Inicio;
  var lugar = objecto[0].Lugar;
  var notasfin = objecto[0].Notas_Fin;
  var notasinicio = objecto[0].Notas_Inicio;
  var prioridad = objecto[0].Prioridad;
  var tags = objecto[0].Tags;
  var tipo = objecto[0].Tipo;
  var user_add = objecto[0].User_Add;
  var user_edit = objecto[0].User_Edit;
  var id = objecto[0].id;
  var id_cliente = objecto[0].id_Cliente;
  var id_cliente_grupo = objecto[0].id_Cliente_Grupo;
  var fechainiciocompleta = fullfechaInicio;
  var FIsinhoras = fechainiciosinhoras;
  var horasinicio = (horacompleta + ":" + minutoscompletos);


  /*Obtenemos la fecha de hoy para compararla con la fecha fin del evento(cita) o la fechalimite de la tarea*/

  var fecha = new Date();
  var mes;
  if ((fecha.getMonth() + 1) < 10) {
    mes = "0" + (fecha.getMonth() + 1);
  } else {
    mes = (fecha.getMonth() + 1);
  }
  var dia;
  if (fecha.getDate() < 10) {
    dia = "0" + fecha.getDate();
  } else {
    dia = fecha.getDate();
  }

  var hora;
  if (fecha.getHours() < 10) {
    hora = "0" + fecha.getHours();
  } else {
    hora = fecha.getHours();
  }
  var minutes;
  if (fecha.getMinutes() < 10) {
    minutes = "0" + fecha.getMinutes();
  } else {
    minutes = fecha.getMinutes();
  }

  var fechahoy = fecha.getFullYear() + "/" + mes + "/" + dia + " " + hora + ":" + minutes + ":" + "00";
  //Tarea
  if (tipo == 1) {
    document.getElementById('fechainicioitem').style.display = "none";
    document.getElementById('fechalimiteitem').style.display = "block";

    if (fechahoy > fullfechalimite) {
      //2 Terminado 3 Cancelado

      if (estado == 2 || estado == 3) {


        document.getElementById('fechafinitem').style.display = "block";
        $("#cajanotasfin").attr("readonly", true);
        document.getElementById('editarev').style.display = "none";
        document.getElementById('botoncancelandfinish').style.display = "none";
        document.getElementById('evtodoeldia').style.display = "none";
        document.getElementById('evlugar').style.display = "none";
        //0 Pendiente 1 Proceso
      } else if (estado == 0 || estado == 1) {
        document.getElementById('fechafinitem').style.display = "none";
        document.getElementById('botoncancelandfinish').style.display = "block";
        document.getElementById('editarev').style.display = "none";
        document.getElementById('evtodoeldia').style.display = "none";
        document.getElementById('evlugar').style.display = "none";
        document.getElementById('cajanotasfin').focus();
        $("#cajanotasfin").attr("readonly", false);

        document.getElementById('botoncancelar').onclick = function() {
          //Se va a cancelar la tarea
          var cajanotasfin = $("#cajanotasfin").val();

          var deviceKey = localStorage.getItem('DeviceKey');
          var Mobilekey = localStorage.getItem('AzureMobile');

          var consulta = "Update dbCalendario_Tareas set  Notas_Fin='" + cajanotasfin + "' ,  Estado=3 , Fecha_Fin='" + fechahoy + "' WHERE id=" + id + ";";

          var postdata = {};

          postdata.deviceKey = deviceKey;
          postdata.mobileKey = Mobilekey;
          postdata.query = consulta;
          //alert("entro en llamada ajax");
          $.ajax({
            type: "GET",
            url: "http://admix.com.mx:8090/Test.asmx/Execute",
            dataType: 'xml',
            contentType: 'application/xml;charset=utf-8',
            data: postdata,
            success: SuccessActEstadoyNotas,
            error: function(responseError, msg, e) {
              var tempError = JSON.stringify(responseError);
              // // console.log(tempError.responseText);
              myApp.alert("Error, de Carga del Servicio");
            }
          });

          function SuccessActEstadoyNotas(data) {
            var datahtml = $.parseJSON(data.documentElement.innerHTML);
            if (datahtml[0] == "True") {
              myApp.alert("Se cancelo la Tarea", "Exito");
              mainView.router.loadPage('pags/Iniciotabs.html');
            } else {
              myApp.alert("No se pudo Cancelar la Tarea", "Error");
            }
          }
        }

        document.getElementById('botonterminar').onclick = function() {

          var cajanotasfin = $("#cajanotasfin").val();

          var deviceKey = localStorage.getItem('DeviceKey');
          var Mobilekey = localStorage.getItem('AzureMobile');

          var consulta = "Update dbCalendario_Tareas set  Notas_Fin='" + cajanotasfin + "' ,  Estado=2 , Fecha_Fin='" + fechahoy + "' WHERE id=" + id + ";";

          var postdata = {};

          postdata.deviceKey = deviceKey;
          postdata.mobileKey = Mobilekey;
          postdata.query = consulta;
          //alert("entro en llamada ajax");
          $.ajax({
            type: "GET",
            url: "http://admix.com.mx:8090/Test.asmx/Execute",
            dataType: 'xml',
            contentType: 'application/xml;charset=utf-8',
            data: postdata,
            success: SuccessActEstadoyNotas,
            error: function(responseError, msg, e) {
              var tempError = JSON.stringify(responseError);
              // // console.log(tempError.responseText);
              myApp.alert("Error, de Carga del Servicio");
            }
          });

          function SuccessActEstadoyNotas(data) {
            var datahtml = $.parseJSON(data.documentElement.innerHTML);
            if (datahtml[0] == "True") {
              myApp.alert("Se Termino la Tarea", "Exito");
              mainView.router.loadPage('pags/Iniciotabs.html');
            } else {
              myApp.alert("No se pudo Terminar la Tarea", "Error");
            }
          }

        }

      }

    } else {
      $("#cajanotasfin").attr("readonly", true);
      document.getElementById('evtodoeldia').style.display = "none";
      document.getElementById('evlugar').style.display = "none";
      document.getElementById('editarev').style.display = "block";
      document.getElementById('botoncancelandfinish').style.display = "none";
      document.getElementById('fechafinitem').style.display = "none";
    }


    //Cita
  } else if (tipo == 2) {

    document.getElementById('prioridadtarea').style.display = "none";

    document.getElementById('fechalimiteitem').style.display = "none";
    document.getElementById('fechainicioitem').style.display = "block";
    document.getElementById('fechafinitem').style.display = "block";

    if (fechahoy > fechafincompleta) {
      //2 Terminado 3Cancelado
      if (estado == 2 || estado == 3) {
        $("#cajanotasfin").attr("readonly", true);
        document.getElementById('editarev').style.display = "none";
        document.getElementById('botoncancelandfinish').style.display = "none";
        //0 Pendiente 1 Proceso
      } else if (estado == 0 || estado == 1) {

        document.getElementById('botoncancelandfinish').style.display = "block";
        document.getElementById('editarev').style.display = "none";
        document.getElementById('cajanotasfin').focus();
        $("#cajanotasfin").attr("readonly", false);



        document.getElementById('botoncancelar').onclick = function() {


          var cajanotasfin = $("#cajanotasfin").val();

          var deviceKey = localStorage.getItem('DeviceKey');
          var Mobilekey = localStorage.getItem('AzureMobile');

          var consulta = "Update dbCalendario_Tareas set  Notas_Fin='" + cajanotasfin + "' ,  Estado=3 WHERE id=" + id + ";";

          var postdata = {};

          postdata.deviceKey = deviceKey;
          postdata.mobileKey = Mobilekey;
          postdata.query = consulta;
          //alert("entro en llamada ajax");
          $.ajax({
            type: "GET",
            url: "http://admix.com.mx:8090/Test.asmx/Execute",
            dataType: 'xml',
            contentType: 'application/xml;charset=utf-8',
            data: postdata,
            success: SuccessActEstadoyNotas,
            error: function(responseError, msg, e) {
              var tempError = JSON.stringify(responseError);
              // // console.log(tempError.responseText);
              myApp.alert("Error, de Carga del Servicio");
            }
          });

          function SuccessActEstadoyNotas(data) {
            var datahtml = $.parseJSON(data.documentElement.innerHTML);
            if (datahtml[0] == "True") {
              myApp.alert("Se cancelo la Cita", "Exito");
              mainView.router.loadPage('pags/Iniciotabs.html');
            } else {
              myApp.alert("No se pudo Cancelar la Cita", "Error");
            }
          }


        }
        document.getElementById('botonterminar').onclick = function() {


          var cajanotasfin = $("#cajanotasfin").val();

          var deviceKey = localStorage.getItem('DeviceKey');
          var Mobilekey = localStorage.getItem('AzureMobile');

          var consulta = "Update dbCalendario_Tareas set  Notas_Fin='" + cajanotasfin + "' ,  Estado=2 WHERE id=" + id + ";";

          var postdata = {};

          postdata.deviceKey = deviceKey;
          postdata.mobileKey = Mobilekey;
          postdata.query = consulta;
          //alert("entro en llamada ajax");
          $.ajax({
            type: "GET",
            url: "http://admix.com.mx:8090/Test.asmx/Execute",
            dataType: 'xml',
            contentType: 'application/xml;charset=utf-8',
            data: postdata,
            success: SuccessActEstadoyNotas,
            error: function(responseError, msg, e) {
              var tempError = JSON.stringify(responseError);
              // // console.log(tempError.responseText);
              myApp.alert("Error, de Carga del Servicio");
            }
          });

          function SuccessActEstadoyNotas(data) {
            var datahtml = $.parseJSON(data.documentElement.innerHTML);
            if (datahtml[0] == "True") {
              myApp.alert("Se Termino la Cita", "Exito");
              mainView.router.loadPage('pags/Iniciotabs.html');
            } else {
              myApp.alert("No se pudo Terminar la Cita", "Error");
            }
          }

        }
      }

    } else {
      $("#cajanotasfin").attr("readonly", true);
      document.getElementById('editarev').style.display = "block";
      document.getElementById('botoncancelandfinish').style.display = "none";
    }
  }



  //quitamos la caja participante
  document.getElementById('participantedelevento').style.display = "none";

  $$('#imgedit').on('click', function() {
    //creamos un objecto con mas variables que pueden ser utiles para despues
    mainView.router.load({
      url: 'pags/actualizarregistro.html',
      query: {
        Descripcion: descripcion,
        Estado: estado,
        Fecha_Add: fechaadd,
        Fecha_DiaCompleto: fechadiacompleto,
        Fecha_Edit: fechaedit,
        Fecha_Fin: fechafin,
        Fecha_Inicio: fechainicio,
        Lugar: lugar,
        Notas_Inicio: notasinicio,
        Notas_Fin: notasfin,
        Prioridad: prioridad,
        Tags: tags,
        Tipo: tipo,
        User_Add: user_add,
        User_Edit: user_edit,
        id: id,
        id_Cliente: id_cliente,
        id_Cliente_Grupo: id_cliente_grupo,
        Fecha_Inicio_Completa: fechainiciocompleta,
        Fecha_Inicio_sin_Horas: fechainiciosinhoras,
        Horas_FechaI: horasinicio,
        Fecha_Fin_Completa: fechafincompleta,
        Fecha_Fin_sin_Horas: fechafinsinhoras,
        Horas_FechaF: horasfin,
        Fechalimitesinhoras: fechalimitesinhoras,
        fechalimitehoras: horasfechalimite
      }
    });


  });

}

function eliminar(id) {

  //validamos si son eventos pasados no se pueden eliminar atraves del id
  //validamos si son eventos futuros si se pueden eliminar ^^         ^^
  var idEmpleado = sessionStorage.getItem("idEmpleado");
  var idUsuario = sessionStorage.getItem("idUsuario");



  var idParticipante;
  //usuario solo con suscripcion
  if (idUsuario > 0 && idEmpleado == "null") {
    idParticipante = idUsuario;
  }
  //usuario EMpleado de departamento
  else if (idUsuario > 0 && idEmpleado != "null") {
    idParticipante = idEmpleado;
  }
  //Cuando sea Administrador
  else if (idUsuario == -1) {
    idParticipante = idUsuario;

  }


  var consulta = "SELECT * From dbCalendario_Tareas t  inner join dbCalendario_Tareas_Participantes p on p.idTarea=t.id Where p.id_Participante=" + idParticipante + " AND t.id=" + id + ";";


  var idEmpleado = sessionStorage.getItem('idEmpleado');
  var deviceKey = localStorage.getItem('DeviceKey');
  var Mobilekey = localStorage.getItem('AzureMobile');


  var postdata = {};

  postdata.deviceKey = deviceKey;
  postdata.mobileKey = Mobilekey;
  postdata.query = consulta;
  //alert("entro en llamada ajax");
  $.ajax({
    type: "GET",
    url: "http://admix.com.mx:8090/Test.asmx/Query",
    dataType: 'xml',
    contentType: 'application/xml;charset=utf-8',
    data: postdata,
    success: cargarev,
    error: function(responseError, msg, e) {
      var tempError = JSON.stringify(responseError);
      //// console.log(tempError.responseText);
      myApp.alert("Error, de Carga del Servicio");
    }
  });

  function cargarev(data) {
    var arrayev = $.parseJSON(data.documentElement.innerHTML);
    var evento = $.parseJSON(arrayev);
    if (evento[0] == "null") {
      myApp.alert("Actualmente no tiene ningun evento");
    } else {
      //obtenemos la fecha y hora de hoy
      var fecha = new Date();
      var mes;
      if ((fecha.getMonth() + 1) < 10) {
        mes = "0" + (fecha.getMonth() + 1);
      } else {
        mes = (fecha.getMonth() + 1);
      }
      var dia;
      if (fecha.getDate() < 10) {
        dia = "0" + fecha.getDate();
      } else {
        dia = fecha.getDate();
      }

      var hora;
      if (fecha.getHours() < 10) {
        hora = "0" + fecha.getHours();
      } else {
        hora = fecha.getHours();
      }
      var minutes;
      if (fecha.getMinutes() < 10) {
        minutes = "0" + fecha.getMinutes();
      } else {
        minutes = fecha.getMinutes();
      }

      var fechahoy = fecha.getFullYear() + "/" + mes + "/" + dia + " " + hora + ":" + minutes + ":" + "00";

      var citafechaNormal = [];
      var tareaNormal = [];
      var cont = 0;

      // for(var i=0;i<evento.length;i++){
      var Desc = evento[0].Descripcion;
      var Est = evento[0].Estado;
      var idT = evento[0].id;
      var FechaI = evento[0].Fecha_Inicio;
      var FechaF = evento[0].Fecha_Fin;
      var FechaL = evento[0].Fecha_Limite;
      var NotasF = evento[0].Notas_Fin;
      // var idPart=citas[i].id_Participante;
      // var idPart_Tipo=citas[i].id_Participante_Tipo;

      //Fecha Inicio
      var inicio = FechaI.indexOf("(");
      var fin = FechaI.indexOf(")");
      var newdate = FechaI.substring(inicio + 1, fin);
      var cad = parseFloat(newdate);
      var fechainicio = new Date(cad);

      var mesi;
      if ((fechainicio.getMonth() + 1) < 10) {
        mesi = "0" + (fechainicio.getMonth() + 1);
      } else {
        mesi = (fechainicio.getMonth() + 1);
      }
      var diai;
      if (fechainicio.getDate() < 10) {
        diai = "0" + fechainicio.getDate();
      } else {
        diai = fechainicio.getDate();
      }

      var HoraEv;
      if (fechainicio.getHours() < 10) {
        HoraEv = "0" + fechainicio.getHours();
      } else {
        HoraEv = fechainicio.getHours();
      }
      var MinEv;
      if (fechainicio.getMinutes() < 10) {
        MinEv = "0" + fechainicio.getMinutes();
      } else {
        MinEv = fechainicio.getMinutes();
      }

      var fullfechai = fechainicio.getFullYear() + "/" + mesi + "/" + diai + " " + HoraEv + ":" + MinEv + ":" + "00";

      if (evento[0].Tipo == 1) {

        //Fecha Limite
        var iniciofl = FechaL.indexOf("(");
        var finfl = FechaL.indexOf(")");
        var newdatefl = FechaL.substring(iniciofl + 1, finfl);
        var cadfl = parseFloat(newdatefl);
        var fechalimite = new Date(cadfl);

        var mesfl;
        if ((fechalimite.getMonth() + 1) < 10) {
          mesfl = "0" + (fechalimite.getMonth() + 1);
        } else {
          mesfl = (fechalimite.getMonth() + 1);
        }
        var diafl;
        if (fechalimite.getDate() < 10) {
          diafl = "0" + fechalimite.getDate();
        } else {
          diafl = fechalimite.getDate();
        }

        var HoraEvfl;
        if (fechalimite.getHours() < 10) {
          HoraEvfl = "0" + fechalimite.getHours();
        } else {
          HoraEvfl = fechalimite.getHours();
        }
        var MinEvfl;
        if (fechalimite.getMinutes() < 10) {
          MinEvfl = "0" + fechalimite.getMinutes();
        } else {
          MinEvfl = fechalimite.getMinutes();
        }

        var fullfechalimite = fechalimite.getFullYear() + "/" + mesfl + "/" + diafl + " " + HoraEvfl + ":" + MinEvfl + ":" + "00";

        var tarea = {
          id: idT,
          Descripcion: Desc,
          Estado: Est,
          Fecha_Inicio: fullfechai,
          Fecha_Limite: fullfechalimite,
          Notas_Finales: NotasF
        };
        tareaNormal[cont] = tarea;
        cont++;

        console.log(tareaNormal);
        if (fechahoy >= tareaNormal[0].Fecha_Limite) {

          myApp.alert("Este evento pasado no se puede eliminar", "Lo Sentimos");

          //Si es un evento futuro si se puede eliminar
        } else {
          //1.-obtenemos el numero de part del evento
          //si tiene 2 o mas se elimina solo de la tabla Participantes en caso contrario de dbCalTareas y Part.
          var idEmpleado = sessionStorage.getItem('idEmpleado');
          var idUser = sessionStorage.getItem("idUsuario");
          var deviceKey = localStorage.getItem('DeviceKey');
          var Mobilekey = localStorage.getItem('AzureMobile');
          var consulta = 'SELECT Count (*)NoPart FROM dbCalendario_Tareas_Participantes where idTarea=' + id + ';';

          var postdata = {};

          postdata.deviceKey = deviceKey;
          postdata.mobileKey = Mobilekey;
          postdata.query = consulta;
          //alert("entro en llamada ajax");
          $.ajax({
            type: "GET",
            url: "http://admix.com.mx:8090/Test.asmx/Query",
            dataType: 'xml',
            contentType: 'application/xml;charset=utf-8',
            data: postdata,
            success: numparttarea,
            error: function(responseError, msg, e) {
              var tempError = JSON.stringify(responseError);
              // // console.log(tempError.responseText);
              myApp.alert("Error, de Carga del Servicio");
            }
          });

          function numparttarea(data) {
            var idUsuario = sessionStorage.getItem("idUsuario");
            var idEmpleado = sessionStorage.getItem('idEmpleado');
            var datahtml = $.parseJSON(data.documentElement.innerHTML);
            var arraypart = $.parseJSON(datahtml);
            //2.-eliminamos solo el participante
            if (arraypart[0].NoPart > 1) {

              var idParticipante;
              //usuario solo con suscripcion
              if (idUsuario > 0 && idEmpleado == "null") {
                idParticipante = idUsuario;
              }
              //usuario EMpleado de departamento
              else if (idUsuario > 0 && idEmpleado != "null") {
                idParticipante = idEmpleado;
              }
              //Cuando sea Administrador
              else if (idUsuario == -1) {
                idParticipante = idUsuario;

              }

              var deviceKey = localStorage.getItem('DeviceKey');
              var Mobilekey = localStorage.getItem('AzureMobile');
              //var consulta='Delete  FROM dbCalendario_Tareas Where id='+id+'and id_Cliente='+idEmpleado;

              var consulta = 'DELETE FROM dbCalendario_Tareas_Participantes Where id=' + idParticipante;

              var postdata = {};

              postdata.deviceKey = deviceKey;
              postdata.mobileKey = Mobilekey;
              postdata.query = consulta;
              //alert("entro en llamada ajax");
              $.ajax({
                type: "GET",
                url: "http://admix.com.mx:8090/Test.asmx/Execute",
                dataType: 'xml',
                contentType: 'application/xml;charset=utf-8',
                data: postdata,
                success: succeliminarpartarea,
                error: function(responseError, msg, e) {
                  var tempError = JSON.stringify(responseError);
                  // // console.log(tempError.responseText);
                  myApp.alert("Error, de Carga del Servicio");
                }
              });

              function succeliminarparttarea(data) {
                var datohtml = $.parseJSON(data.documentElement.innerHTML);
                if (datohtml[0] == "True") {
                  myApp.alert("Ya no pertenece a este evento grupal", "Abandono");
                } else {
                  myApp.alert("No se pudo abandonar el evento ", "Error")
                }
              }

            } else {

              var idUsuario = sessionStorage.getItem("idUsuario");
              var idEmpleado = sessionStorage.getItem('idEmpleado');
              // var idUser=sessionStorage.getItem("idUsuario");
              var deviceKey = localStorage.getItem('DeviceKey');
              var Mobilekey = localStorage.getItem('AzureMobile');
              //var consulta='Delete  FROM dbCalendario_Tareas Where id='+id+'and id_Cliente='+idEmpleado;

              var idParticipante;
              //usuario solo con suscripcion
              if (idUsuario > 0 && idEmpleado == "null") {
                idParticipante = idUsuario;
              }
              //usuario EMpleado de departamento
              else if (idUsuario > 0 && idEmpleado != "null") {
                idParticipante = idEmpleado;
              }
              //Cuando sea Administrador
              else if (idUsuario == -1) {
                idParticipante = idUsuario;

              }
              var consulta = 'DELETE dbCalendario_Tareas FROM dbCalendario_Tareas  ta inner join dbCalendario_Tareas_Participantes part on ta.id=part.idTarea Where part.id_Participante=' + idParticipante + ' and ta.id=' + id + ';';

              var postdata = {};

              postdata.deviceKey = deviceKey;
              postdata.mobileKey = Mobilekey;
              postdata.query = consulta;
              //alert("entro en llamada ajax");
              $.ajax({
                type: "GET",
                url: "http://admix.com.mx:8090/Test.asmx/Execute",
                dataType: 'xml',
                contentType: 'application/xml;charset=utf-8',
                data: postdata,
                success: onSuccessdeletetarea,
                error: function(responseError, msg, e) {
                  var tempError = JSON.stringify(responseError);
                  // // console.log(tempError.responseText);
                  myApp.alert("Error, de Carga del Servicio");
                }
              });

              function onSuccessdeletetarea(data) {
                var borrado = $.parseJSON(data.documentElement.innerHTML);

                /* var elem = document.getElementById('id');
                 elem.parentNode.removeChild(elem);*/


                if (borrado[0] === "True") {
                  myApp.alert("Se elimino el evento", "Exito");

                  var idUsuario = sessionStorage.getItem("idUsuario");
                  var idEmpleado = sessionStorage.getItem('idEmpleado');


                  var deviceKey = localStorage.getItem('DeviceKey');
                  var Mobilekey = localStorage.getItem('AzureMobile');
                  //var consulta='Delete  FROM dbCalendario_Tareas Where id='+id+'and id_Cliente='+idEmpleado;

                  var consulta = 'DELETE FROM dbCalendario_Tareas_Participantes Where idTarea=' + id;

                  var postdata = {};

                  postdata.deviceKey = deviceKey;
                  postdata.mobileKey = Mobilekey;
                  postdata.query = consulta;
                  //alert("entro en llamada ajax");
                  $.ajax({
                    type: "GET",
                    url: "http://admix.com.mx:8090/Test.asmx/Execute",
                    dataType: 'xml',
                    contentType: 'application/xml;charset=utf-8',
                    data: postdata,
                    success: succesdelpart,
                    error: function(responseError, msg, e) {
                      var tempError = JSON.stringify(responseError);
                      // // console.log(tempError.responseText);
                      myApp.alert("Error, de Carga del Servicio");
                    }
                  });


                } else {
                  myApp.alert("No tiene permisos para eliminar este evento", "Denegado");
                }

              }

            }

          }

        }

      } else if (evento[0].Tipo == 2) {

        //Fecha Fin
        var iniciof = FechaF.indexOf("(");
        var finf = FechaF.indexOf(")");
        var newdatef = FechaF.substring(iniciof + 1, finf);
        var cadf = parseFloat(newdatef);
        var fechafin = new Date(cadf);

        var mesf;
        if ((fechafin.getMonth() + 1) < 10) {
          mesf = "0" + (fechafin.getMonth() + 1);
        } else {
          mesf = (fechafin.getMonth() + 1);
        }
        var diaf;
        if (fechafin.getDate() < 10) {
          diaf = "0" + fechafin.getDate();
        } else {
          diaf = fechafin.getDate();
        }

        var HoraEvf;
        if (fechafin.getHours() < 10) {
          HoraEvf = "0" + fechafin.getHours();
        } else {
          HoraEvf = fechafin.getHours();
        }
        var MinEvf;
        if (fechafin.getMinutes() < 10) {
          MinEvf = "0" + fechafin.getMinutes();
        } else {
          MinEvf = fechafin.getMinutes();
        }

        var fullfechaf = fechafin.getFullYear() + "/" + mesf + "/" + diaf + " " + HoraEvf + ":" + MinEvf + ":" + "00";

        var cita = {
          id: idT,
          Descripcion: Desc,
          Estado: Est,
          Fecha_Inicio: fullfechai,
          Fecha_Fin: fullfechaf,
          Notas_Finales: NotasF
        };
        citafechaNormal[cont] = cita;
        cont++;

        console.log(citafechaNormal);

        if (fechahoy >= citafechaNormal[0].Fecha_Fin) {

          myApp.alert("Este evento pasado no se puede eliminar", "Lo Sentimos");

          //Si es un evento futuro si se puede eliminar
        } else {
          //1.-obtenemos el numero de part del evento
          //si tiene 2 o mas se elimina solo de la tabla Participantes en caso contrario de dbCalTareas y Part.
          var idEmpleado = sessionStorage.getItem('idEmpleado');
          var idUser = sessionStorage.getItem("idUsuario");
          var deviceKey = localStorage.getItem('DeviceKey');
          var Mobilekey = localStorage.getItem('AzureMobile');
          var consulta = 'SELECT Count (*)NoPart FROM dbCalendario_Tareas_Participantes where idTarea=' + id + ';';

          var postdata = {};

          postdata.deviceKey = deviceKey;
          postdata.mobileKey = Mobilekey;
          postdata.query = consulta;
          //alert("entro en llamada ajax");
          $.ajax({
            type: "GET",
            url: "http://admix.com.mx:8090/Test.asmx/Query",
            dataType: 'xml',
            contentType: 'application/xml;charset=utf-8',
            data: postdata,
            success: numpartcita,
            error: function(responseError, msg, e) {
              var tempError = JSON.stringify(responseError);
              // // console.log(tempError.responseText);
              myApp.alert("Error, de Carga del Servicio");
            }
          });

          function numpartcita(data) {
            var datahtml = $.parseJSON(data.documentElement.innerHTML);
            var arraypart = $.parseJSON(datahtml);
            //2.-eliminamos solo el participante
            if (arraypart[0].NoPart > 1) {
              var idEmpleado = sessionStorage.getItem('idEmpleado');
              var idUsuario = sessionStorage.getItem("idUsuario");
              var idParticipante;
              //usuario solo con suscripcion
              if (idUsuario > 0 && idEmpleado == "null") {
                idParticipante = idUsuario;
              }
              //usuario EMpleado de departamento
              else if (idUsuario > 0 && idEmpleado != "null") {
                idParticipante = idEmpleado;
              }
              //Cuando sea Administrador
              else if (idUsuario == -1) {
                idParticipante = idUsuario;

              }
              var deviceKey = localStorage.getItem('DeviceKey');
              var Mobilekey = localStorage.getItem('AzureMobile');
              //var consulta='Delete  FROM dbCalendario_Tareas Where id='+id+'and id_Cliente='+idEmpleado;

              var consulta = 'DELETE FROM dbCalendario_Tareas_Participantes Where id=' + idParticipante;

              var postdata = {};

              postdata.deviceKey = deviceKey;
              postdata.mobileKey = Mobilekey;
              postdata.query = consulta;
              //alert("entro en llamada ajax");
              $.ajax({
                type: "GET",
                url: "http://admix.com.mx:8090/Test.asmx/Execute",
                dataType: 'xml',
                contentType: 'application/xml;charset=utf-8',
                data: postdata,
                success: succeliminarpartcita,
                error: function(responseError, msg, e) {
                  var tempError = JSON.stringify(responseError);
                  // // console.log(tempError.responseText);
                  myApp.alert("Error, de Carga del Servicio");
                }
              });

              function succeliminarpartcita(data) {
                var datohtml = $.parseJSON(data.documentElement.innerHTML);
                if (datohtml[0] == "True") {
                  myApp.alert("Ya no pertenece a este evento grupal", "Abandono");
                } else {
                  myApp.alert("No se pudo abandonar el evento ", "Error")
                }
              }

            } else {

              var idEmpleado = sessionStorage.getItem('idEmpleado');
              var idUsuario = sessionStorage.getItem("idUsuario");
              var deviceKey = localStorage.getItem('DeviceKey');
              var Mobilekey = localStorage.getItem('AzureMobile');
              //var consulta='Delete  FROM dbCalendario_Tareas Where id='+id+'and id_Cliente='+idEmpleado;
              var idParticipante;
              //usuario solo con suscripcion
              if (idUsuario > 0 && idEmpleado == "null") {
                idParticipante = idUsuario;
              }
              //usuario EMpleado de departamento
              else if (idUsuario > 0 && idEmpleado != "null") {
                idParticipante = idEmpleado;
              }
              //Cuando sea Administrador
              else if (idUsuario == -1) {
                idParticipante = idUsuario;

              }

              var consulta = 'DELETE dbCalendario_Tareas FROM dbCalendario_Tareas  ta inner join dbCalendario_Tareas_Participantes part on ta.id=part.idTarea Where part.id_Participante=' + idParticipante + ' and ta.id=' + id + ';';

              var postdata = {};

              postdata.deviceKey = deviceKey;
              postdata.mobileKey = Mobilekey;
              postdata.query = consulta;
              //alert("entro en llamada ajax");
              $.ajax({
                type: "GET",
                url: "http://admix.com.mx:8090/Test.asmx/Execute",
                dataType: 'xml',
                contentType: 'application/xml;charset=utf-8',
                data: postdata,
                success: onSuccessdeletecita,
                error: function(responseError, msg, e) {
                  var tempError = JSON.stringify(responseError);
                  // // console.log(tempError.responseText);
                  myApp.alert("Error, de Carga del Servicio");
                }
              });

              function onSuccessdeletecita(data) {
                var borrado = $.parseJSON(data.documentElement.innerHTML);

                /* var elem = document.getElementById('id');
                 elem.parentNode.removeChild(elem);*/


                if (borrado[0] === "True") {
                  myApp.alert("Se elimino el evento", "Exito");

                  var idUser = sessionStorage.getItem("idUsuario");
                  var deviceKey = localStorage.getItem('DeviceKey');
                  var Mobilekey = localStorage.getItem('AzureMobile');
                  //var consulta='Delete  FROM dbCalendario_Tareas Where id='+id+'and id_Cliente='+idEmpleado;

                  var consulta = 'DELETE FROM dbCalendario_Tareas_Participantes Where idTarea=' + id;

                  var postdata = {};

                  postdata.deviceKey = deviceKey;
                  postdata.mobileKey = Mobilekey;
                  postdata.query = consulta;
                  //alert("entro en llamada ajax");
                  $.ajax({
                    type: "GET",
                    url: "http://admix.com.mx:8090/Test.asmx/Execute",
                    dataType: 'xml',
                    contentType: 'application/xml;charset=utf-8',
                    data: postdata,
                    success: succesdelpart,
                    error: function(responseError, msg, e) {
                      var tempError = JSON.stringify(responseError);
                      // // console.log(tempError.responseText);
                      myApp.alert("Error, de Carga del Servicio");
                    }
                  });


                } else {
                  myApp.alert("No tiene permisos para eliminar este evento", "Denegado");
                }

              }

            }

          }

        }

      }

      //}

    }
  }

  /*function cargartodaslascitas(data){
      var arraycitas=$.parseJSON(data.documentElement.innerHTML);
      var citas=$.parseJSON(arraycitas);
      if(citas[0]=="null"){
          myApp.alert("Actualmente no tiene ningun evento");
      }else{
         //obtenemos la fecha y hora de hoy
          var fecha=new Date();
          var mes;
          if((fecha.getMonth()+1)<10){
               mes="0"+(fecha.getMonth()+1);
          }else{
              mes=(fecha.getMonth()+1);
          }
          var dia;
          if(fecha.getDate()<10){
              dia="0"+fecha.getDate();
          }else{
              dia=fecha.getDate();
          }

          var hora;
          if(fecha.getHours()<10){
              hora="0"+fecha.getHours();
          }else{
              hora=fecha.getHours();
          }
          var minutes;
          if(fecha.getMinutes()<10){
              minutes="0"+fecha.getMinutes();
          }else{
              minutes=fecha.getMinutes();
          }

          var fechahoy=fecha.getFullYear()+"/"+mes+"/"+dia+" "+hora+":"+minutes+":"+"00";

           var citasfechaNormal = [];
           var cont=0;
      for(var i=0;i<citas.length;i++){

          var Desc=citas[i].Descripcion;
          var Est=citas[i].Estado;
          var idT=citas[i].id;
          var FechaI=citas[i].Fecha_Inicio;
          var FechaF=citas[i].Fecha_Fin;
          var NotasF=citas[i].Notas_Fin;
         // var idPart=citas[i].id_Participante;
         // var idPart_Tipo=citas[i].id_Participante_Tipo;

               //Fecha Inicio
                  var inicio = FechaI.indexOf("(");
                  var fin = FechaI.indexOf(")");
                  var newdate=FechaI.substring(inicio + 1, fin);
                  var cad=parseFloat(newdate);
                  var fechainicio = new Date(cad);

                  var HoraEv;
                  if(fechainicio.getHours() < 10){
                      HoraEv="0"+fechainicio.getHours();
                  }else{
                      HoraEv=fechainicio.getHours();
                  }
                  var MinEv;
                  if(fechainicio.getMinutes() < 10){
                      MinEv="0"+fechainicio.getMinutes();
                  }else{
                      MinEv=fechainicio.getMinutes();
                  }

                  var fullfechai=fechainicio.getFullYear()+"/"+(fechainicio.getMonth()+1)+"/"+fechainicio.getDate()+" "+HoraEv+":"+MinEv+":"+"00";

              //Fecha Fin
                  var iniciof = FechaF.indexOf("(");
                  var finf = FechaF.indexOf(")");
                  var newdatef=FechaF.substring(iniciof + 1, finf);
                  var cadf=parseFloat(newdatef);
                  var fechafin = new Date(cadf);

                  var HoraEvf;
                  if(fechafin.getHours() < 10){
                      HoraEvf="0"+fechafin.getHours();
                  }else{
                      HoraEvf=fechafin.getHours();
                  }
                  var MinEvf;
                  if(fechafin.getMinutes() < 10){
                      MinEvf="0"+fechafin.getMinutes();
                  }else{
                      MinEvf=fechafin.getMinutes();
                  }

                  var fullfechaf=fechafin.getFullYear()+"/"+(fechafin.getMonth()+1)+"/"+fechafin.getDate()+" "+HoraEvf+":"+MinEvf+":"+"00";

                  var cita={id:idT,Descripcion:Desc,Estado:Est,Fecha_Inicio:fullfechai,Fecha_Fin:fullfechaf,Notas_Finales:NotasF};
                  citasfechaNormal[cont]=cita;
              cont++;

          }
          //hacemos el recorrido para comprobar si las fechas son antes de hoy
          for(var i;i<citasfechaNormal.length;i++){

              if(fechahoy > citasfechaNormal[i].Fecha_Fin ){

                  myApp.alert("Lo sentimos pero este evento pasado no se puede eliminar");

              }

          }



      }
  }*/



}

function succesdelpart(data) {
  var borradopart = $.parseJSON(data.documentElement.innerHTML);
  if (borradopart[0] === "True") {
    myApp.alert("Se quito el Participante del evento", "Exito");
  } else {
    myApp.alert("No se pudo eliminar el participante", "Error");
  }
}



//Funcion al hacer clic en la lista tareas

myApp.onPageInit('actualizarregistro', function(array, page) {
  var fecha = new Date();
  var mes;
  if ((fecha.getMonth() + 1) < 10) {
    mes = "0" + (fecha.getMonth() + 1);
  } else {
    mes = (fecha.getMonth() + 1);
  }
  var dia;
  if (fecha.getDate() < 10) {
    dia = "0" + fecha.getDate();
  } else {
    dia = fecha.getDate();
  }
  var fechahoy = fecha.getFullYear() + "/" + mes + "/" + dia;

  // Sugerencia de horas la Fecha de fin para la Cita
  var hourold = (fecha.getHours() + 1);

  var hourf;
  if (hourold < 10) {
    hourf = "0" + hourold;
  } else {
    hourf = hourold;
  }

  var minutes;
  if (fecha.getMinutes() < 10) {
    minutes = "0" + fecha.getMinutes();
  } else {
    minutes = fecha.getMinutes();
  }

  var hour;
  if (fecha.getHours() < 10) {
    hour = "0" + fecha.getHours();
  } else {
    hour = fecha.getHours();
  }

  //agregamos 5 minutos
  var minuteold = (fecha.getMinutes() + (5));
  var minuten;
  if (minuteold < 10) {
    minuten = "0" + minuteold;
  } else {
    minuten = minuteold;
  }

  var horahoy = hour + ":" + minuten;

  var horafinal = hourf + ":" + minutes;
  var hoycitaFF = fechahoy + " " + horafinal;

  //FechaInicio
  var today = new Date();
  var pickerDependent = myApp.picker({
    input: '#picker-actFI',
    rotateEffect: true,
    value: [today.getFullYear(), today.getMonth() + 1, today.getDate(), today.getHours(), (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())],

    onChange: function(picker, values, displayValues) {
      var daysInMonth = new Date(picker.value[2], picker.value[0] * 1 + 1, 0).getDate();
      if (values[1] > daysInMonth) {
        picker.cols[1].setValue(daysInMonth);
      }
    },
    formatValue: function(p, values, displayValues) {
      return values[0] + '/' + values[1] + '/' + values[2] + ' ' + values[3] + ':' + values[4];
    },
    cols: [

      // Years
      {
        values: (function() {
          var arr = [];
          for (var i = 1950; i <= 2030; i++) {
            arr.push(i);
          }
          return arr;
        })(),
      },
      // Months
      {
        values: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' '),
        displayValues: ('January February March April May June July August September October November December').split(' '),
        textAlign: 'left'
      },
      // Days
      {
        values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
      },
      // Space divider
      {
        divider: true,
        content: '  '
      },
      // Hours
      {
        values: (function() {
          var arr = [];
          for (var i = 0; i <= 23; i++) {
            arr.push(i);
          }
          return arr;
        })(),
      },
      // Divider
      {
        divider: true,
        content: ':'
      },
      // Minutes
      {
        values: (function() {
          var arr = [];
          for (var i = 0; i <= 59; i++) {
            arr.push(i < 10 ? '0' + i : i);
          }
          return arr;
        })(),
      }
    ]
  });
  //Fecha Fin
  var todayff = new Date();
  var pickerDependent = myApp.picker({
    input: '#picker-actFF',
    rotateEffect: true,
    value: [todayff.getFullYear(), todayff.getMonth() + 1, todayff.getDate(), todayff.getHours(), (todayff.getMinutes() < 10 ? '0' + todayff.getMinutes() : todayff.getMinutes())],

    onChange: function(picker, values, displayValues) {
      var daysInMonth = new Date(picker.value[2], picker.value[0] * 1 + 1, 0).getDate();
      if (values[1] > daysInMonth) {
        picker.cols[1].setValue(daysInMonth);
      }
    },
    formatValue: function(p, values, displayValues) {
      return displayValues[0] + '/' + values[1] + '/' + values[2] + ' ' + values[3] + ':' + values[4];
    },
    cols: [

      // Years
      {
        values: (function() {
          var arr = [];
          for (var i = 1950; i <= 2030; i++) {
            arr.push(i);
          }
          return arr;
        })(),
      },
      // Months
      {
        values: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' '),
        displayValues: ('January February March April May June July August September October November December').split(' '),
        textAlign: 'left'
      },
      // Days
      {
        values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
      },
      // Space divider
      {
        divider: true,
        content: '  '
      },
      // Hours
      {
        values: (function() {
          var arr = [];
          for (var i = 0; i <= 23; i++) {
            arr.push(i);
          }
          return arr;
        })(),
      },
      // Divider
      {
        divider: true,
        content: ':'
      },
      // Minutes
      {
        values: (function() {
          var arr = [];
          for (var i = 0; i <= 59; i++) {
            arr.push(i < 10 ? '0' + i : i);
          }
          return arr;
        })(),
      }
    ]
  });
  //Fecha Limite
  var todayfl = new Date();
  var pickerDependent = myApp.picker({
    input: '#picker-actFL',
    rotateEffect: true,
    value: [todayfl.getFullYear(), todayfl.getMonth() + 1, todayfl.getDate(), todayfl.getHours(), (todayfl.getMinutes() < 10 ? '0' + todayfl.getMinutes() : todayfl.getMinutes())],

    onChange: function(picker, values, displayValues) {
      var daysInMonth = new Date(picker.value[2], picker.value[0] * 1 + 1, 0).getDate();
      if (values[1] > daysInMonth) {
        picker.cols[1].setValue(daysInMonth);
      }
    },
    formatValue: function(p, values, displayValues) {
      return displayValues[0] + '/' + values[1] + '/' + values[2] + ' ' + values[3] + ':' + values[4];
    },
    cols: [

      // Years
      {
        values: (function() {
          var arr = [];
          for (var i = 1950; i <= 2030; i++) {
            arr.push(i);
          }
          return arr;
        })(),
      },
      // Months
      {
        values: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' '),
        displayValues: ('January February March April May June July August September October November December').split(' '),
        textAlign: 'left'
      },
      // Days
      {
        values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
      },
      // Space divider
      {
        divider: true,
        content: '  '
      },
      // Hours
      {
        values: (function() {
          var arr = [];
          for (var i = 0; i <= 23; i++) {
            arr.push(i);
          }
          return arr;
        })(),
      },
      // Divider
      {
        divider: true,
        content: ':'
      },
      // Minutes
      {
        values: (function() {
          var arr = [];
          for (var i = 0; i <= 59; i++) {
            arr.push(i < 10 ? '0' + i : i);
          }
          return arr;
        })(),
      }
    ]
  });



  var idUsuario = sessionStorage.getItem("idUsuario");
  //Distinguimos el tipo
  if (array.query.Tipo == 1) {
    document.getElementById('RadiobuttonTarea').style.display = "none";
    document.getElementById('RadiobuttonCita').style.display = "none";
    document.getElementById('actNotasF').style.display = "none";
    document.getElementById('actdiacompleto').style.display = "none";
    document.getElementById('actlugar').style.display = "none";
    document.getElementById('actPicker-DepFI').style.display = "none";
    document.getElementById('actPicker-DepFF').style.display = "none";
    document.getElementById('actPicker-DepFL').style.display = "block";
    document.getElementById('actPrioridad').style.display = "block";
    document.getElementById('smartselectclients').style.display = "none";

    //validamos si la fecha de limite se habia establecido al crearse la tarea
    var fechalimite
    if (array.query.Fechalimitesinhoras != undefined && array.query.fechalimitehoras != undefined) {
      fechalimite = array.query.Fechalimitesinhoras + " " + array.query.fechalimitehoras;

    } else {
      fechalimite = "";
    }

    document.getElementById('picker-actFL').value = fechalimite;


    //var FechaFinLimite=document.getElementById('actcalfechalimite').value=array.query.Fechalimitesinhoras;
    // var HoraFechaLimite=document.getElementById('acthorafinlimite').value=array.query.fechalimitehoras;

  } else if (array.query.Tipo == 2) {

    document.getElementById('RadiobuttonTarea').style.display = "none";
    document.getElementById('RadiobuttonCita').style.display = "none";
    document.getElementById('actNotasF').style.display = "none";


    document.getElementById('actPicker-DepFL').style.display = "none";
    document.getElementById('actPicker-DepFI').style.display = "block";
    document.getElementById('actPicker-DepFF').style.display = "block";

    var fechaInicio = array.query.Fechalimitesinhoras + " " + array.query.fechalimitehoras;
    document.getElementById('picker-actFI').value = array.query.Fecha_Inicio_Completa;
    document.getElementById('picker-actFF').value = array.query.Fecha_Fin_Completa;
    //document.getElementById('actitemprioridad').style.display="none";
    document.getElementById('actPrioridad').style.display = "none";

  }
  //console.log(array);
  //funcion onchange para el checkbox
  var checkFullDay = document.getElementById('actcheckboxFullDay');
  document.getElementById('actcheckboxFullDay').checked = checkFullDay;

  checkFullDay.onchange = function() {
    if (checkFullDay.checked) {

      var fechatodayam = fechahoy + " 00:00";
      var fechatodaynight = fechahoy + " 23:59";
      document.getElementById('picker-actFI').value = fechatodayam;
      document.getElementById('picker-actFF').value = fechatodaynight;

    } else {
      var hoy = fechahoy + " " + horahoy;
      var hoycitaFF = fechahoy + " " + horafinal;
      document.getElementById('picker-actFI').value = hoy;
      document.getElementById('picker-actFF').value = hoycitaFF;

    }
  }

  //Inicializamos tags
  $("#actbutaceptar").click(function() {
    var actcajatags = $$("#actcajatags").val();

    var newNode = document.createElement('div');
    newNode.className = 'chip';
    newNode.innerHTML = "<div class='chip-label'>" + actcajatags + "</div><a href='#' class='chip-delete'></a>";
    document.getElementById('contchips').appendChild(newNode);
    document.getElementById("actcajatags").value = "";

    $$('.chip-delete').on('click', function(e) {
      e.preventDefault();
      var chip = $$(this).parents('.chip');
      myApp.confirm('Desea borrar esta tag?', function() {

        document.getElementById("actcajatags").value = "";
        chip.remove();
      });
    });
  });


  document.getElementById('inputacttitulo').value = array.query.Descripcion;
  document.getElementById('actregNotasI').value = array.query.Notas_Inicio;
  //document.getElementById('actregNotasF').value=array.query.Notas_Fin;

  //lugar
  document.getElementById('actautocomplete-dropdown').value = array.query.Lugar;
  document.getElementById('actcajatags').value = array.query.Tags;

  //document.getElementById('actPrioridadEv').selectedIndex=array.query.Prioridad;
  document.getElementById('actEstadoEv').selectedIndex = array.query.Estado;

  if (array.query.Fecha_DiaCompleto === true) {
    document.getElementById('actcheckboxFullDay').checked = true;
  } else {
    document.getElementById('actcheckboxFullDay').checked = false;
  }

  if (array.query.Tipo === 1) {
    document.getElementById('radioacttarea').checked = true;
  }
  if (array.query.Tipo === 2) {
    document.getElementById('radioactcita').checked = true;
  }
  if (array.query.Tipo === 3) {
    document.getElementById('radioactproyecto').checked = true;
  }

  var actcajatags = $$("#actcajatags").val();
  if (actcajatags !== '' || actcajatags !== null) {
    //myApp.alert("aqui se invoca tags");
    var newNode = document.createElement('div');
    newNode.className = 'chip';
    newNode.innerHTML = "<div class='chip-label'>" + actcajatags + "</div><a href='#' class='chip-delete'></a>";
    document.getElementById('contchips').appendChild(newNode);

    $$('.chip-delete').on('click', function(e) {
      e.preventDefault();
      var chip = $$(this).parents('.chip');
      myApp.confirm('Desea borrar esta tag?', function() {
        chip.remove();
        document.getElementById("actcajatags").value = "";
      });
    });
    document.getElementById("actcajatags").value = "";
  }

  var idUsuario = sessionStorage.getItem("idUsuario");
  var idEmpleado = sessionStorage.getItem("idEmpleado");

  //Es un usuario con suscripcion pero no empleado (Cliente)
  if (idUsuario > 0 && idEmpleado == "null") {
    document.getElementById("participantes").style.display = "none";
    document.getElementById("smartselectclients").style.display = "none";


  } //Empleado Normal
  else if (idUsuario > 0 && idEmpleado != "null") {
    myApp.showIndicator();
    document.getElementById("participantes").style.display = "block";
    //document.getElementById("smartselectclients").style.display="block";
    document.getElementById('radiocita').onchange = function() {
      document.getElementById("smartselectclients").style.display = "block";
    }

    //Cargamos los clientes para el tipo evento cita
    var consulta = "Select id,Nombre from dbClientes";
    var deviceKey = localStorage.getItem('DeviceKey');
    var mobilekey = localStorage.getItem('AzureMobile');

    var postdata = {};

    postdata.deviceKey = deviceKey;
    postdata.mobileKey = mobilekey;
    postdata.query = consulta;

    $.ajax({
      type: "GET",
      url: "http://admix.com.mx:8090/Test.asmx/Query",
      dataType: 'xml',
      contentType: 'application/xml;charset=utf-8',
      data: postdata,
      success: onSuccessClientes,
      error: function(responseError, msg, e) {
        var tempError = JSON.stringify(responseError);
        // console.log(tempError.responseText);
        myApp.alert("Error, Carga de clientes incorrectamente");
      }
    });

    function onSuccessClientes(data) {
      var datahtml = $.parseJSON(data.documentElement.innerHTML);



      if (datahtml[0] !== null) {
        var arrayclientes = $.parseJSON(datahtml);
        console.log(arrayclientes);


        document.getElementById('optiongroupclient').label = arrayclientes[0].Nombre;

        for (var c = 0; c < arrayclientes.length; c++) {

          myApp.smartSelectAddOption('.smart-select select', '<option value="' + arrayclientes[c].id + '">' + arrayclientes[c].Nombre + '</option>');

        }

      } else {
        myApp.alert("Por el momento, No hay Clientes que agregar", "Error");
      }

      //console.log(arrayclientes);
      myApp.hideIndicator();
    }

  } else if (idUsuario == -1) {
    //deshabilitamos por el momento la opcion de agregar mas participantes
    myApp.showIndicator();
    document.getElementById("participantes").style.display = "none";
    document.getElementById("smartselectusers").style.display = "none";
    //Cargamos los clientes para el tipo evento cita
    var consulta = "Select id , Nombre from dbClientes Where id > 0 and id < 400";
    var deviceKey = localStorage.getItem('DeviceKey');
    var mobilekey = localStorage.getItem('AzureMobile');

    var postdata = {};

    postdata.deviceKey = deviceKey;
    postdata.mobileKey = mobilekey;
    postdata.query = consulta;

    $.ajax({
      type: "GET",
      url: "http://admix.com.mx:8090/Test.asmx/Query",
      dataType: 'xml',
      contentType: 'application/xml;charset=utf-8',
      data: postdata,
      success: onSuccessClientes,
      error: function(responseError, msg, e) {
        var tempError = JSON.stringify(responseError);
        // console.log(tempError.responseText);
        myApp.alert("Error, Carga de clientes incorrectamente");
      }
    });

    function onSuccessClientes(data) {
      var datahtml = $.parseJSON(data.documentElement.innerHTML);



      if (datahtml[0] !== null) {
        var arrayclientes = $.parseJSON(datahtml);
        //console.log(arrayclientes);


        document.getElementById('optiongroupclient').label = arrayclientes[0].Nombre;

        for (var c = 0; c < arrayclientes.length; c++) {

          myApp.smartSelectAddOption('.smart-select select', '<option value="' + arrayclientes[c].id + '">' + arrayclientes[c].Nombre + '</option>');

        }

      } else {
        myApp.alert("Por el momento, No hay Clientes que agregar", "Error");
      }

      //console.log(arrayclientes);
      myApp.hideIndicator();
    }

  }


  document.getElementById('imgsaveact').onclick = function() {


    /***********************************************************************/

    /*Obtenemos los nuevos valores*/
    var cajaacttitulo = document.getElementById('inputacttitulo').value;
    var cajaactnotasi = document.getElementById('actregNotasI').value;

    var valorradiopri;
    if (array.query.Tipo === 1) {
      var cajaactFL = document.getElementById('picker-actFL').value + ":00";

      //var radioprioridad=$$('#input[name="actradiopri"]:checked').val();
      var radiospri = document.getElementsByName('actradiopri');


      for (var i = 0, length = radiospri.length; i < length; i++) {
        if (radiospri[i].checked) {
          // do whatever you want with the checked radio
          //alert(radios[i].value);
          valorradiopri = radiospri[i].value;
          // only one radio can be logically checked, don't check the rest
          break;
        }
      }


    }
    if (array.query.Tipo === 2) {
      var cajaactFI = document.getElementById('picker-actFI').value + ":00";
      var cajaactFF = document.getElementById('picker-actFF').value + ":00";
      var checkFullD = document.getElementById('actcheckboxFullDay').checked;
      var cajaactlugar = document.getElementById('actautocomplete-dropdown').value;

      //obtenemos los ids de los participantes que van a tener el evento
      var clientes = document.getElementById('selectcliente');
      // console.log(usuario);

      var idsclientes = getSelectValues(clientes);

      function getSelectValues(select) {
        var result = [];
        var options = select && select.options;
        var opt;

        for (var i = 0, iLen = options.length; i < iLen; i++) {
          opt = options[i];

          if (opt.selected) {
            result.push(opt.value || opt.text);
          }
        }
        return result;
      }
      //console.log(idsclientes);

    }
    var arraytags = document.getElementsByClassName('chip-label');
    //sacamos las tags
    var tagsresult = '';
    for (var j = 0; j < arraytags.length; j++) {
      tagsresult += arraytags[j].innerHTML;
    }
    var actetiquetas = tagsresult;

    var Estado = document.getElementById("actEstadoEv");
    var actEstadoSel = Estado.options[Estado.selectedIndex].value;

    /* myApp.alert("Titulo: "+cajaacttitulo+"<br>"+
                "NotasI: "+cajaactnotasi+"<br>"+
                "FechaLimite"+cajaactFL+"<br>"+
                "Prioridad"+valorradiopri+"<br>"+
                "FechaInicio"+cajaactFI+"<br>"+
                "FechaFIn"+cajaactFF+"<br>"+
                "Fullday"+checkFullD+"<br>"+
                "Lugar"+cajaactlugar+"<br>"+
                "tags"+actetiquetas+"<br>"+
                "estado"+actEstadoSel);*/


    var idParticipante;
    var idEmpleado = sessionStorage.getItem("idEmpleado");
    var idUsuario = sessionStorage.getItem("idUsuario");
    //usuario solo con suscripcion
    if (idUsuario > 0 && idEmpleado == "null") {
      idParticipante = idUsuario;
    }
    //usuario EMpleado de departamento
    else if (idUsuario > 0 && idEmpleado != "null") {
      idParticipante = idEmpleado;
    }
    //Cuando sea Administrador
    else if (idUsuario == -1) {
      idParticipante = idUsuario;

    }
    var consulta;
    if (array.query.Tipo == 1 && idUsuario != -1) {

      consulta = "Update tar set Descripcion='" + cajaacttitulo + "' , Notas_Inicio='" + cajaactnotasi + "', Fecha_Limite='" + cajaactFL + "', Tags='" + actetiquetas + "', Prioridad=" + valorradiopri + " , Estado=" + actEstadoSel + " FROM dbCalendario_Tareas tar inner join dbCalendario_Tareas_Participantes p on tar.id=p.idTarea where tar.id=" + array.query.id + " and p.id_Participante=" + idParticipante + ";";

    } else if (array.query.Tipo == 2 && idsclientes[0] != null && idUsuario != -1) {
      consulta = "Update tar set Descripcion='" + cajaacttitulo + "' , Notas_Inicio='" + cajaactnotasi + "' ,  Fecha_Inicio='" + cajaactFI + "', Fecha_Fin='" + cajaactFF + "', Fecha_DiaCompleto='" + checkFullD + "', Lugar='" + cajaactlugar + "' , Tags='" + actetiquetas + "', Estado=" + actEstadoSel + ",id_Cliente=" + idsclientes[0] + " FROM dbCalendario_Tareas tar inner join dbCalendario_Tareas_Participantes p on tar.id=p.idTarea where tar.id=" + array.query.id + " and p.id_Participante=" + idParticipante + ";";
    } else if (array.query.Tipo == 2 && idsclientes[0] == null && idUsuario != -1) {
      consulta = "Update tar set Descripcion='" + cajaacttitulo + "' , Notas_Inicio='" + cajaactnotasi + "' ,  Fecha_Inicio='" + cajaactFI + "', Fecha_Fin='" + cajaactFF + "', Fecha_DiaCompleto='" + checkFullD + "', Lugar='" + cajaactlugar + "' , Tags='" + actetiquetas + "', Estado=" + actEstadoSel + " FROM dbCalendario_Tareas tar inner join dbCalendario_Tareas_Participantes p on tar.id=p.idTarea where tar.id=" + array.query.id + " and p.id_Participante=" + idParticipante + ";";
      //solo aplica para el administrador
    } else if (array.query.Tipo == 1 && idUsuario == -1) {
      consulta = "Update tar set Descripcion='" + cajaacttitulo + "' , Notas_Inicio='" + cajaactnotasi + "', Fecha_Limite='" + cajaactFL + "', Tags='" + actetiquetas + "', Prioridad=" + valorradiopri + " , Estado=" + actEstadoSel + " FROM dbCalendario_Tareas tar inner join dbCalendario_Tareas_Participantes p on tar.id=p.idTarea where tar.id=" + array.query.id;
    } else if (array.query.Tipo == 2 && idsclientes[0] != null && idUsuario == -1) {
      consulta = "Update tar set Descripcion='" + cajaacttitulo + "' , Notas_Inicio='" + cajaactnotasi + "' ,  Fecha_Inicio='" + cajaactFI + "', Fecha_Fin='" + cajaactFF + "', Fecha_DiaCompleto='" + checkFullD + "', Lugar='" + cajaactlugar + "' , Tags='" + actetiquetas + "', Estado=" + actEstadoSel + ",id_Cliente=" + idsclientes[0] + " FROM dbCalendario_Tareas tar inner join dbCalendario_Tareas_Participantes p on tar.id=p.idTarea where tar.id=" + array.query.id;
    } else if (array.query.Tipo == 2 && idsclientes[0] == null && idUsuario == -1) {
      consulta = "Update tar set Descripcion='" + cajaacttitulo + "' , Notas_Inicio='" + cajaactnotasi + "' ,  Fecha_Inicio='" + cajaactFI + "', Fecha_Fin='" + cajaactFF + "', Fecha_DiaCompleto='" + checkFullD + "', Lugar='" + cajaactlugar + "' , Tags='" + actetiquetas + "', Estado=" + actEstadoSel + " FROM dbCalendario_Tareas tar inner join dbCalendario_Tareas_Participantes p on tar.id=p.idTarea where tar.id=" + array.query.id;
    }
    // myApp.alert("Descripcion"+);


    var deviceKey = localStorage.getItem('DeviceKey');
    var Mobilekey = localStorage.getItem('AzureMobile');


    var postdata = {};

    postdata.deviceKey = deviceKey;
    postdata.mobileKey = Mobilekey;
    postdata.query = consulta;
    alert("entro en llamada ajax");
    $.ajax({
      type: "GET",
      url: "http://admix.com.mx:8090/Test.asmx/Execute",
      dataType: 'xml',
      contentType: 'application/xml;charset=utf-8',
      data: postdata,
      success: updateev,
      error: function(responseError, msg, e) {
        var tempError = JSON.stringify(responseError);
        //// console.log(tempError.responseText);
        myApp.alert("Error, de Carga del Servicio");
      }
    });

    function updateev(data) {
      var arrayupdateev = $.parseJSON(data.documentElement.innerHTML);
      // console.log(arrayupdateev);
      if (arrayupdateev[0] == "True") {
        myApp.alert("Se actualizo", "Exito");
        myApp.mainView.router.back({
          url: myApp.mainView.history[1],
          force: true
        });
        //console.log(responseupdate);
      } else {
        myApp.alert("No se actualizo ", "Error");
      }
      //var responseupdate=$.parseJSON(arrayev);


    }

  }


});

myApp.onPageInit('usuarios', function(pest, page) {

  // run createContentPage func after link was clicked
  /*$$('.create-page').on('click', function () {
      createContentPage();
  });*/

  var idEmpleado = sessionStorage.getItem("idEmpleado");

  /**Consulta si pertenece a un departamento a traves del id empleado**/
  // var idEmpleado=usuario[0].IdEmpleado;

  $(function() {

    var deviceKey = localStorage.getItem('DeviceKey');
    var Mobilekey = localStorage.getItem('AzureMobile');
    var consultaemp = 'SELECT * From dbEmpleados Where id=' + idEmpleado;

    var postdata = {};

    postdata.deviceKey = deviceKey;
    postdata.mobileKey = Mobilekey;
    postdata.query = consultaemp;

    $.ajax({
      type: "GET",
      url: "http://admix.com.mx:8090/Test.asmx/Query",
      dataType: 'xml',
      contentType: 'application/xml;charset=utf-8',
      data: postdata,
      success: ResultConsultEmp,
      error: function(responseError, msg, e) {
        var tempError = JSON.stringify(responseError);
        // // console.log(tempError.responseText);
        myApp.alert("Error, Al consultar Empleado");
      }

    });

    function ResultConsultEmp(data) {
      var resultempl = $.parseJSON(data.documentElement.innerHTML);
      //  // // console.log(resultempl);
      var Empleado = $.parseJSON(resultempl);
      //// // console.log(Empleado);
      var idDepartamento = Empleado[0].IdDepartamento;
      var idPuesto = Empleado[0].IdPuesto;

      /**Sacamos todos los usuarios con el mismo departamento**/

      var deviceKey = localStorage.getItem('DeviceKey');
      var Mobilekey = localStorage.getItem('AzureMobile');
      //No excluimos el usuario de sesion
      // var consultaemp='SELECT * From dbEmpleados Where IdDepartamento='+idDepartamento;
      //Excluimos el usuario de sesion
      var consultaemp = 'SELECT * From dbEmpleados Where IdDepartamento=' + idDepartamento + 'And id<>' + idEmpleado;
      var postdata = {};

      postdata.deviceKey = deviceKey;
      postdata.mobileKey = Mobilekey;
      postdata.query = consultaemp;

      $.ajax({
        type: "GET",
        url: "http://admix.com.mx:8090/Test.asmx/Query",
        dataType: 'xml',
        contentType: 'application/xml;charset=utf-8',
        data: postdata,
        success: ResultEmpDepartamento,
        error: function(responseError, msg, e) {
          var tempError = JSON.stringify(responseError);
          // console.log(tempError.responseText);
          myApp.alert("Error, Al consultar Empleado");
        }

      });

      function ResultEmpDepartamento(data) {
        var resultempl = $.parseJSON(data.documentElement.innerHTML);
        //// console.log(resultempl);
        var empleadosdepto = $.parseJSON(resultempl);
        // // console.log(empleadosdepto);

        var idEmpleado = sessionStorage.getItem("idEmpleado");

        var usuariologueado = '';
        var idEmpladosel;
        for (var k = 0; k < empleadosdepto.length; k++) {

          //// console.log(empleadosdepto);
          if (empleadosdepto[k].id == idEmpleado) {
            usuariologueado = 'checked=true';
          } else {
            usuariologueado = '';
          }

          var newNode = document.createElement('li');
          // newNode.setAttribute('href','pags/eventosdetalle.html');
          //    newNode.setAttribute('onClick','eventodetalle('+obj[i].id+')');
          newNode.className = '';
          newNode.innerHTML = "<label class='label-checkbox item-content'>" +
            "<input type='checkbox' name='my-checkbox' value='" + empleadosdepto[k].id + "' >" +
            "<div class='item-media'>" +
            "<i class='icon icon-form-checkbox'></i>" +
            "</div>" +
            "<div class='item-inner'>" +
            "<div class='item-title'>" + empleadosdepto[k].Nombre + "</div>" +
            "</div>" +
            "</label>";


          document.getElementById('listausuarios').appendChild(newNode);



          /*   "<div class='item-media'><img src=img/usersicon.png ></div>"+
                        "<div class='item-inner'>"+
                            "<div class='item-title'>"+empleadosdepto[k].Nombre+"</div>"+
                            "<div class='item-after'>"+
                            "<input type='checkbox' name='my-checkbox' value='"+empleadosdepto[k].id+"' title='"+empleadosdepto[k].Nombre+"' "+usuariologueado+" >"+
                            "<div class='item-media'>"+
                            "<i class='icon icon-form-checkbox'></i>"+
                            "</div>"+
                            "</div>"+
                            "</div>";*/



          // document.getElementById('listausuarios').appendChild(newNode);


          /* var newNode = document.createElement('li');
                     // newNode.setAttribute('href','pags/eventosdetalle.html');
                    //    newNode.setAttribute('onClick','eventodetalle('+obj[i].id+')');
                        newNode.className = 'item-content';
                        newNode.innerHTML ="<div class='item-media'><img src=img/usersicon.png ></div>"+
                        "<div class='item-inner'>"+
                            "<div class='item-title'>"+empleadosdepto[k].Nombre+"</div>"+
                            "<div class='item-after'>"+
                            "<input type='checkbox' name='my-checkbox' value='"+empleadosdepto[k].id+"' title='"+empleadosdepto[k].Nombre+"' "+usuariologueado+" >"+
                            "<div class='item-media'>"+
                            "<i class='icon icon-form-checkbox'></i>"+
                            "</div>"+
                            "</div>"+
                            "</div>";



                             document.getElementById('listausuarios').appendChild(newNode); */



        }
        //usuarios callback
        $$('#imgbackuser').on('click', function() {

          var cont = 0;
          var empleadosobjeto = [];
          var checkedValue = null;
          var inputElements = document.getElementsByName('my-checkbox');
          for (var i = 0; inputElements[i]; ++i) {
            if (inputElements[i].checked) {
              // checkedValue = inputElements[i].value;
              var empleadosel = {
                id: inputElements[i].value,
                nombre: inputElements[i].title
              };
              empleadosobjeto[cont] = empleadosel;
              cont++;
              //break;
            }
          }

          //pestaña selecionada es la del calendario
          if (pest.query.pestanaactiva == 2) {
            // myApp.alert("pestaña del calendario");
            mainView.router.load({
              url: 'pags/Iniciotabs.html',
              query: empleadosobjeto
            });
            myApp.showTab('#tab2');


          } else if (pest.query.pestanaactiva == 3) {
            //myApp.alert("pestaña tareas");
            mainView.router.load({
              url: 'pags/Iniciotabs.html',
              query: empleadosobjeto
            });
            myApp.showTab('#tab3');

          } else {
            // myApp.alert("pestaña agenda del dia");
            mainView.router.load({
              url: 'pags/Iniciotabs.html',
              query: empleadosobjeto
            });
          }

          //// console.log(empleadosobjeto);
          //Sacamos todos los eventos de cada usuarios seleccionado
          // CargarlosEventosUsuarios(empleadosobjeto);



          // // console.log(empleadosobjeto);
        });
        /* var checkedValue = null;
           var inputElements = document.getElementsByName('my-checkbox');
           for(var i=0; inputElements[i]; ++i){
                 if(inputElements[i].checked){
                      checkedValue = inputElements[i].value;
                      break;
                 }
           } */

      }
    }
  });

});



myApp.onPageInit('agregarnuevoregistro', function(tipoev, page) {
  // run createContentPage func after link was clicked
  // console.log(tipoev);
  var fecha = new Date();
  var mes;
  if ((fecha.getMonth() + 1) < 10) {
    mes = "0" + (fecha.getMonth() + 1);
  } else {
    mes = (fecha.getMonth() + 1);
  }
  var dia;
  if (fecha.getDate() < 10) {
    dia = "0" + fecha.getDate();
  } else {
    dia = fecha.getDate();
  }
  var fechahoy = fecha.getFullYear() + "/" + mes + "/" + dia;

  var hour;
  if (fecha.getHours() < 10) {
    hour = "0" + fecha.getHours();
  } else {
    hour = fecha.getHours();
  }

  //agregamos 5 minutos
  var minuteold = (fecha.getMinutes() + (5));
  var minuten;
  if (minuteold < 10) {
    minuten = "0" + minuteold;
  } else {
    minuten = minuteold;
  }

  var horahoy = hour + ":" + minuten;

  var hoycitaFI = fechahoy + " " + horahoy;

  // Sugerencia de horas la Fecha de fin para la Cita
  var hourold = (fecha.getHours() + 1);

  var hourf;
  if (hourold < 10) {
    hourf = "0" + hourold;
  } else {
    hourf = hourold;
  }

  var minutes;
  if (fecha.getMinutes() < 10) {
    minutes = "0" + fecha.getMinutes();
  } else {
    minutes = fecha.getMinutes();
  }

  var horafinal = hourf + ":" + minutes;
  var hoycitaFF = fechahoy + " " + horafinal;


  //Fecha Inicio
  var today = new Date();
  var pickerDependent = myApp.picker({
    input: '#picker-dependentFI',
    rotateEffect: true,
    value: [today.getFullYear(), today.getMonth() + 1, today.getDate(), today.getHours(), (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())],

    onChange: function(picker, values, displayValues) {
      var daysInMonth = new Date(picker.value[2], picker.value[0] * 1 + 1, 0).getDate();
      if (values[1] > daysInMonth) {
        picker.cols[1].setValue(daysInMonth);
      }
    },
    formatValue: function(p, values, displayValues) {
      return values[0] + '/' + values[1] + '/' + values[2] + ' ' + values[3] + ':' + values[4];
    },
    cols: [

      // Years
      {
        values: (function() {
          var arr = [];
          for (var i = 1950; i <= 2030; i++) {
            arr.push(i);
          }
          return arr;
        })(),
      },
      // Months
      {
        values: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' '),
        displayValues: ('January February March April May June July August September October November December').split(' '),
        textAlign: 'left'
      },
      // Days
      {
        values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
      },
      // Space divider
      {
        divider: true,
        content: '  '
      },
      // Hours
      {
        values: (function() {
          var arr = [];
          for (var i = 0; i <= 23; i++) {
            arr.push(i);
          }
          return arr;
        })(),
      },
      // Divider
      {
        divider: true,
        content: ':'
      },
      // Minutes
      {
        values: (function() {
          var arr = [];
          for (var i = 0; i <= 55; i++) {
            arr.push(i < 10 ? '0' + i : i);
          }
          return arr;
        })(),
      }
    ]
  });
  //Fecha Fin
  var pickerDependent = myApp.picker({
    input: '#picker-dependentFF',
    rotateEffect: true,
    value: [today.getFullYear(), today.getMonth() + 1, today.getDate(), today.getHours(), (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())],

    onChange: function(picker, values, displayValues) {
      var daysInMonth = new Date(picker.value[2], picker.value[0] * 1 + 1, 0).getDate();
      if (values[1] > daysInMonth) {
        picker.cols[1].setValue(daysInMonth);
      }
    },
    formatValue: function(p, values, displayValues) {
      return displayValues[0] + '/' + values[1] + '/' + values[2] + ' ' + values[3] + ':' + values[4];
    },
    cols: [

      // Years
      {
        values: (function() {
          var arr = [];
          for (var i = 1950; i <= 2030; i++) {
            arr.push(i);
          }
          return arr;
        })(),
      },
      // Months
      {
        values: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' '),
        displayValues: ('January February March April May June July August September October November December').split(' '),
        textAlign: 'left'
      },
      // Days
      {
        values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
      },
      // Space divider
      {
        divider: true,
        content: '  '
      },
      // Hours
      {
        values: (function() {
          var arr = [];
          for (var i = 0; i <= 23; i++) {
            arr.push(i);
          }
          return arr;
        })(),
      },
      // Divider
      {
        divider: true,
        content: ':'
      },
      // Minutes
      {
        values: (function() {
          var arr = [];
          for (var i = 0; i <= 59; i++) {
            arr.push(i < 10 ? '0' + i : i);
          }
          return arr;
        })(),
      }
    ]
  });
  //Fecha Limite
  var pickerDependent = myApp.picker({
    input: '#picker-dependentFL',
    rotateEffect: true,
    value: [today.getFullYear(), today.getMonth() + 1, today.getDate(), today.getHours(), (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())],

    onChange: function(picker, values, displayValues) {
      var daysInMonth = new Date(picker.value[2], picker.value[0] * 1 + 1, 0).getDate();
      if (values[1] > daysInMonth) {
        picker.cols[1].setValue(daysInMonth);
      }
    },
    formatValue: function(p, values, displayValues) {
      return displayValues[0] + '/' + values[1] + '/' + values[2] + ' ' + values[3] + ':' + values[4];
    },
    cols: [

      // Years
      {
        values: (function() {
          var arr = [];
          for (var i = 1950; i <= 2030; i++) {
            arr.push(i);
          }
          return arr;
        })(),
      },
      // Months
      {
        values: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' '),
        displayValues: ('January February March April May June July August September October November December').split(' '),
        textAlign: 'left'
      },
      // Days
      {
        values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
      },
      // Space divider
      {
        divider: true,
        content: '  '
      },
      // Hours
      {
        values: (function() {
          var arr = [];
          for (var i = 0; i <= 23; i++) {
            arr.push(i);
          }
          return arr;
        })(),
      },
      // Divider
      {
        divider: true,
        content: ':'
      },
      // Minutes
      {
        values: (function() {
          var arr = [];
          for (var i = 0; i <= 59; i++) {
            arr.push(i < 10 ? '0' + i : i);
          }
          return arr;
        })(),
      }
    ]
  });

  var tipo = tipoev.query.tipo;

  if (tipo == 1) {

    document.getElementById('radiotarea').checked = true;
    document.getElementById('picker-dependentFL').value = "";

  } else if (tipo == 2) {
    // sugerencia de la fecha inicio de la cita
    document.getElementById('radiocita').checked = true;
    document.getElementById('picker-dependentFI').value = hoycitaFI;
    document.getElementById('picker-dependentFF').value = hoycitaFF;

  }


  if (tipoev.query.pestanaactiva == 2) {
    // document.getElementById('calendariofechainicio').value=tipoev.query.fechaagendahoy;
    // document.getElementById('horainicio').value=horahoy;
    document.getElementById('regradiotarea').style.display = "none";
    document.getElementById('regradiocita').style.display = "none";
    document.getElementById('radiocita').checked = true;
    var hoy = tipoev.query.fechaagendahoy + " " + horahoy;
    var hoycitaFF = tipoev.query.fechaagendahoy + " " + horafinal;
    document.getElementById('picker-dependentFI').value = hoy;
    document.getElementById('picker-dependentFF').value = hoycitaFF;

  } else if (tipoev.query.pestanaactiva == 3) {
    // document.getElementById('calendariofechainicio').value=tipoev.query.fechaagendahoy;
    // document.getElementById('horainicio').value=horahoy;
    document.getElementById('regradiotarea').style.display = "none";
    document.getElementById('regradiocita').style.display = "none";
    document.getElementById('radiotarea').checked = true;

  } else if (tipoev.query.pestanaactiva == 1) {
    //  document.getElementById('calendariofechainicio').value=fechahoy;
    //  document.getElementById('horainicio').value=horahoy;
    document.getElementById('regradiotarea').style.display = "none";
    document.getElementById('regradiocita').style.display = "none";

    //document.getElementById('regradiotarea').style.display="none";
    //document.getElementById('regradiocita').style.display="none";
    //document.getElementById('radiotarea').checked=true;
    //Si es una tarea que no sugiera la hora

    //agregamos 1 hora a la hora de fin de la cita como sugerencia

  }

  var idUsuario = sessionStorage.getItem("idUsuario");
  var idEmpleado = sessionStorage.getItem("idEmpleado");

  //Es un usuario con suscripcion pero no empleado (Cliente)
  if (idUsuario > 0 && idEmpleado == "null") {
    document.getElementById("participantes").style.display = "none";
    document.getElementById("smartselectclients").style.display = "none";


  } //Empleado Normal
  else if (idUsuario > 0 && idEmpleado != "null") {
    myApp.showIndicator();
    document.getElementById("participantes").style.display = "block";
    //document.getElementById("smartselectclients").style.display="block";
    document.getElementById('radiocita').onchange = function() {
      document.getElementById("smartselectclients").style.display = "block";
    }

    //Cargamos los clientes para el tipo evento cita
    var consulta = "Select id,Nombre from dbClientes";
    var deviceKey = localStorage.getItem('DeviceKey');
    var mobilekey = localStorage.getItem('AzureMobile');

    var postdata = {};

    postdata.deviceKey = deviceKey;
    postdata.mobileKey = mobilekey;
    postdata.query = consulta;

    $.ajax({
      type: "GET",
      url: "http://admix.com.mx:8090/Test.asmx/Query",
      dataType: 'xml',
      contentType: 'application/xml;charset=utf-8',
      data: postdata,
      success: onSuccessClientes,
      error: function(responseError, msg, e) {
        var tempError = JSON.stringify(responseError);
        // console.log(tempError.responseText);
        myApp.alert("Error, Carga de clientes incorrectamente");
      }
    });

    function onSuccessClientes(data) {
      var datahtml = $.parseJSON(data.documentElement.innerHTML);



      if (datahtml[0] !== null) {
        var arrayclientes = $.parseJSON(datahtml);
        console.log(arrayclientes);


        document.getElementById('optiongroupclient').label = arrayclientes[0].Nombre;

        for (var c = 0; c < arrayclientes.length; c++) {

          myApp.smartSelectAddOption('.smart-select select', '<option value="' + arrayclientes[c].id + '">' + arrayclientes[c].Nombre + '</option>');

        }

      } else {
        myApp.alert("Por el momento, No hay Clientes que agregar", "Error");
      }

      //console.log(arrayclientes);
      myApp.hideIndicator();
    }

  } else if (idUsuario == -1) {
    //deshabilitamos por el momento la opcion de agregar mas participantes
    myApp.showIndicator();
    document.getElementById("participantes").style.display = "none";

    //Cargamos los clientes para el tipo evento cita
    var consulta = "Select id , Nombre from dbClientes Where id > 0 and id < 400";
    var deviceKey = localStorage.getItem('DeviceKey');
    var mobilekey = localStorage.getItem('AzureMobile');

    var postdata = {};

    postdata.deviceKey = deviceKey;
    postdata.mobileKey = mobilekey;
    postdata.query = consulta;

    $.ajax({
      type: "GET",
      url: "http://admix.com.mx:8090/Test.asmx/Query",
      dataType: 'xml',
      contentType: 'application/xml;charset=utf-8',
      data: postdata,
      success: onSuccessClientes,
      error: function(responseError, msg, e) {
        var tempError = JSON.stringify(responseError);
        // console.log(tempError.responseText);
        myApp.alert("Error, Carga de clientes incorrectamente");
      }
    });

    function onSuccessClientes(data) {
      var datahtml = $.parseJSON(data.documentElement.innerHTML);



      if (datahtml[0] !== null) {
        var arrayclientes = $.parseJSON(datahtml);
        //console.log(arrayclientes);


        document.getElementById('optiongroupclient').label = arrayclientes[0].Nombre;

        for (var c = 0; c < arrayclientes.length; c++) {

          myApp.smartSelectAddOption('.smart-select select', '<option value="' + arrayclientes[c].id + '">' + arrayclientes[c].Nombre + '</option>');

        }

      } else {
        myApp.alert("Por el momento, No hay Clientes que agregar", "Error");
      }

      //console.log(arrayclientes);
      myApp.hideIndicator();
    }

  }


  var bandtarea = false;

  if (document.getElementById('radiotarea').checked) {
    document.getElementById('Picker-DepFI').style.display = "none";
    document.getElementById('Picker-DepFF').style.display = "none";
    document.getElementById('Picker-DepFL').style.display = "block";

    document.getElementById('diacompletocheck').style.display = "none";

    document.getElementById('lugar').style.display = "none";
    document.getElementById('Prioridad').style.display = "block";
    document.getElementById('NotasFinales').style.display = "none";
    document.getElementById('Estado').style.display = "none";
    document.getElementById('smartselectclients').style.display = "none";

    bandtarea = true;

  } else if (document.getElementById('radiocita').checked) {
    document.getElementById('Picker-DepFI').style.display = "block";
    document.getElementById('Picker-DepFF').style.display = "block";
    document.getElementById('Picker-DepFL').style.display = "none";



    document.getElementById('diacompletocheck').style.display = "block";

    document.getElementById('lugar').style.display = "block";
    document.getElementById('Prioridad').style.display = "none";
    document.getElementById('Estado').style.display = "none";
    document.getElementById('NotasFinales').style.display = "none";
    document.getElementById('smartselectclients').style.display = "block";

    if (idUsuario > 0 && idEmpleado == "null") {
      document.getElementById("participantes").style.display = "none";
      document.getElementById("smartselectclients").style.display = "none";
    }

  }

  document.getElementById('radiotarea').onchange = function() {


    // myApp.alert("tarea ha sido seleccionado");
    document.getElementById('diacompletocheck').style.display = "none";
    document.getElementById('itemfechainicio').style.display = "none";
    document.getElementById('fechalimite').style.display = "block";
    document.getElementById('lugar').style.display = "none";
    document.getElementById('Prioridad').style.display = "block";
    document.getElementById('NotasFinales').style.display = "none";
    document.getElementById('Estado').style.display = "none";
    document.getElementById('smartselectclients').style.display = "none";
    document.getElementById('fechafinnuevoreg').style.display = "none";
    bandtarea = true;
  }



  document.getElementById('radiocita').onchange = function() {


    //myApp.showIndicator();
    // document.getElementById('fechafinnuevoreg').style.display="block";
    document.getElementById('diacompletocheck').style.display = "block";
    //  document.getElementById('itemfechainicio').style.display="block";
    // document.getElementById('fechalimite').style.display="none";
    document.getElementById('lugar').style.display = "block";
    document.getElementById('Prioridad').style.display = "none";
    document.getElementById('Estado').style.display = "none";
    document.getElementById('NotasFinales').style.display = "none";
    document.getElementById('smartselectclients').style.display = "block";

    if (idUsuario > 0 && idEmpleado == "null") {
      document.getElementById("participantes").style.display = "none";
      document.getElementById("smartselectclients").style.display = "none";
    }

  }



  var checkFullDay = document.getElementById('checkboxFullDay');
  checkFullDay.onchange = function() {
    if (checkFullDay.checked) {

      var fechatodayam = fechahoy + " 00:00";
      var fechatodaynight = fechahoy + " 23:59";
      document.getElementById('picker-dependentFI').value = fechatodayam;
      document.getElementById('picker-dependentFF').value = fechatodaynight;


    } else {
      var hoy = fechahoy + " " + horahoy;
      var hoycitaFF = fechahoy + " " + horafinal;
      document.getElementById('picker-dependentFI').value = hoy;
      document.getElementById('picker-dependentFF').value = hoycitaFF;


    }
  }



  //Ocultamos los radios tarea y cita
  //document.getElementById('regradiotarea').style.display="none";
  //document.getElementById('regradiocita').style.display="none";


  //Checkbox para agregar a varios partitipantes del evento

  var checkparticipantes = document.getElementById('checkboxswitch');

  document.getElementById('smartselectusers').style.display = "none";

  checkparticipantes.onchange = function() {

    if (checkparticipantes.checked) {


      // myApp.alert("Ya estuvo");
      document.getElementById('smartselectusers').style.display = "block";

      var idEmpleado = sessionStorage.getItem("idEmpleado");
      var deviceKey = localStorage.getItem('DeviceKey');
      var Mobilekey = localStorage.getItem('AzureMobile');
      var consultaemp = 'SELECT * From dbEmpleados Where id=' + idEmpleado;

      var postdata = {};

      postdata.deviceKey = deviceKey;
      postdata.mobileKey = Mobilekey;
      postdata.query = consultaemp;

      $.ajax({
        type: "GET",
        url: "http://admix.com.mx:8090/Test.asmx/Query",
        dataType: 'xml',
        contentType: 'application/xml;charset=utf-8',
        data: postdata,
        success: ResultConsultEmp,
        error: function(responseError, msg, e) {
          var tempError = JSON.stringify(responseError);
          // // console.log(tempError.responseText);
          myApp.alert("Error, Al consultar Empleado");
        }

      });

      function ResultConsultEmp(data) {
        var resultempl = $.parseJSON(data.documentElement.innerHTML);
        //  // // console.log(resultempl);
        var Empleado = $.parseJSON(resultempl);
        //// // console.log(Empleado);
        var idDepartamento = Empleado[0].IdDepartamento;
        var idPuesto = Empleado[0].IdPuesto;


        /**Sacamos todos los usuarios con el mismo departamento**/

        var deviceKey = localStorage.getItem('DeviceKey');
        var Mobilekey = localStorage.getItem('AzureMobile');
        //No excluimos el usuario de sesion
        var consultaemp = 'SELECT * From dbEmpleados Where IdDepartamento=' + idDepartamento;
        //Excluimos el usuario de sesion
        //var consultaemp='SELECT * From dbEmpleados Where IdDepartamento='+idDepartamento+'And id<>'+idEmpleado;
        var postdata = {};

        postdata.deviceKey = deviceKey;
        postdata.mobileKey = Mobilekey;
        postdata.query = consultaemp;

        $.ajax({
          type: "GET",
          url: "http://admix.com.mx:8090/Test.asmx/Query",
          dataType: 'xml',
          contentType: 'application/xml;charset=utf-8',
          data: postdata,
          success: ResultEmpDepartamento,
          error: function(responseError, msg, e) {
            var tempError = JSON.stringify(responseError);
            // console.log(tempError.responseText);
            myApp.alert("Error, Al consultar Empleado");
          }

        });

        function ResultEmpDepartamento(data) {
          var resultempl = $.parseJSON(data.documentElement.innerHTML);
          if (resultempl[0] !== null) {
            var empleadosdepto = $.parseJSON(resultempl);
            console.log(empleadosdepto);


            document.getElementById('optiongroup').label = empleadosdepto[0].Departamento;

            for (var u = 0; u < empleadosdepto.length; u++) {

              myApp.smartSelectAddOption('.smart-select select', '<option value="' + empleadosdepto[u].id + '">' + empleadosdepto[u].Nombre + '</option>');

            }

          } else {
            myApp.alert("Por el momento, No hay Participantes que agregar", "Error");
          }



        }

      }


    } else {
      document.getElementById('smartselectusers').style.display = "none";
    }
  }

  var imagenguardar = document.getElementById('imgsave');
  var pos = (tipoev.query.tipo - 1);
  var pos = 0; //solucion temp para
  var radios = document.getElementsByName('my-radio');
  radios[pos].checked = true;

  imagenguardar.onclick = function() {

    //Sacamos los ids de los clientes seleccionados


    //myApp.alert("si entro en guardar");

    //Nombre de Evento
    var descripcion = $$('#inputagreg').val();

    //Tipo de Evento

    var tipoevento = $$('#input[name="my-radio"]:checked').val();
    var radios = document.getElementsByName('my-radio');

    //var valorradio;
    /*for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            // do whatever you want with the checked radio
            //alert(radios[i].value);
            valorradio=radios[i].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }*/
    //valor del tipodeevento
    var valorradio = tipoev.query.tipo;
    console.log(valorradio);

    var radioprioridad = $$('#input[name="radiopri"]:checked').val();
    var radiospri = document.getElementsByName('radiopri');

    var valorradiopri;
    for (var i = 0, length = radiospri.length; i < length; i++) {
      if (radiospri[i].checked) {
        // do whatever you want with the checked radio
        //alert(radios[i].value);
        valorradiopri = radiospri[i].value;
        // only one radio can be logically checked, don't check the rest
        break;
      }
    }

    var notasI = document.getElementById('NotasI').value;
    var notasF = document.getElementById('NotasF').value;

    var checkFullDay = document.getElementById('checkboxFullDay').checked;
    var lugar = document.getElementById('autocomplete-dropdown').value;
    var arraytags = document.getElementsByClassName('chip-label');

    //Tags
    var j;
    var tagsresult = '';
    for (j = 0; j < arraytags.length; j++) {
      tagsresult = arraytags[j].innerHTML + ',' + tagsresult;
    }
    var etiquetas = tagsresult;


    //comentamos select prioridad para no borrarlo
    /*var Prioridad=document.getElementById("PrioridadEv");
    var Prioridadselected=Prioridad.options[Prioridad.selectedIndex].value;*/


    //var Estado=document.getElementById("EstadoEv");
    //var EstadoSel=Estado.options[Estado.selectedIndex].value;

    var EstadoSel;
    if (valorradio == 1) {
      EstadoSel = 1;
    } else if (valorradio == 2) {
      EstadoSel = 0;
    }

    //obtenemos los ids de los participantes que van a tener el evento
    var clientes = document.getElementById('selectcliente');
    // console.log(usuario);

    var idsclientes = getSelectValues(clientes);

    function getSelectValues(select) {
      var result = [];
      var options = select && select.options;
      var opt;

      for (var i = 0, iLen = options.length; i < iLen; i++) {
        opt = options[i];

        if (opt.selected) {
          result.push(opt.value || opt.text);
        }
      }
      return result;
    }
    console.log(idsclientes);

    //Sacamos la fecha limite
    // var fechalimite=document.getElementById("calfechalimite").value;
    // var Horalimite=document.getElementById("horafinlimite").value;
    // var fullfechalimite=fechalimite+" "+Horalimite.replace(/ /g, '')+":00";



    /* myApp.alert("descripcion: "+descripcion+"<br>"+
                "tipo de evento: "+valorradio+"<br>"+
                "NotasI: "+notasI+"<br>"+
                "NotasF: "+notasF+"<br>"+
                "FechaI: "+FechaI+"<br>"+
                "HoraI: "+HoraI+"<br>"+
                "FechaF: "+FechaF+"<br>"+
                "HoraF: "+HoraF+"<br>"+
                "check Full Day: "+checkFullDay+"<br>"+
                "Lugar: "+lugar+"<br>"+
                "Tags: "+etiquetas+"<br>"+
                //"Prioridad: "+Prioridadselected+"<br>"+
                 "Prioridad: "+valorradiopri+"<br>"+
                "Estado: "+EstadoSel+
                "fechalimite:"+fullfechalimite
                );*/



    /*query insert con idCliente

           var idEmpleado=sessionStorage.getItem("idEmpleado");

           var queryinsert="insert into dbCalendario_Tareas (Descripcion , Tipo , Notas_Inicio ,Notas_Fin , Fecha_Inicio , Fecha_Fin ,Fecha_DiaCompleto,  Lugar, Tags, Prioridad , Estado ,id_Cliente) values('"+descripcion+" ', "+valorradio+" ,'" +notasI+ "' , '"+notasF+"' , '"+FullFechaInicio+"' , '"+FullFechaFin+"' , '"+checkFullDay+"' , '"+lugar+"' , '"+etiquetas+"' , "+Prioridadselected+" , "+EstadoSel+" , "+idEmpleado+")";*/
    var fecha = new Date();
    var mes;
    if ((fecha.getMonth() + 1) < 10) {
      mes = "0" + (fecha.getMonth() + 1);
    } else {
      mes = (fecha.getMonth() + 1);
    }
    var dia;
    if (fecha.getDate() < 10) {
      dia = "0" + fecha.getDate();
    } else {
      dia = fecha.getDate();
    }
    var fechahoy = fecha.getFullYear() + "/" + mes + "/" + dia;

    var hour;
    if (fecha.getHours() < 10) {
      hour = "0" + fecha.getHours();
    } else {
      hour = fecha.getHours();
    }
    var minute;
    if (fecha.getMinutes() < 10) {
      minute = "0" + fecha.getMinutes();
    } else {
      minute = fecha.getMinutes();
    }

    var horahoy = hour + ":" + minute;
    var fechaactual = fecha.getFullYear() + "/" + mes + "/" + dia + " " + hour + ":" + minute + ":00"

    //Obtenemos las fechas de los pickers
    var cajapickerfechaI = document.getElementById('picker-dependentFI').value;
    var FECHAI = cajapickerfechaI + ":00";
    var cajapickerfechaF = document.getElementById('picker-dependentFF').value;
    var FECHAF = cajapickerfechaF + ":00";
    var cajapickerfechaL = document.getElementById('picker-dependentFL').value;
    var FECHAL = cajapickerfechaL + ":00";

    var queryinsert;
    if (valorradio == 1) {
      //Tarea
      if (cajapickerfechaL != "") {

        if (FECHAL > fechaactual) {
          var queryinsert = "insert into dbCalendario_Tareas (Descripcion , Tipo , Notas_Inicio ,Notas_Fin , Fecha_Inicio , Fecha_Limite ,Fecha_DiaCompleto,  Lugar, Tags, Prioridad , Estado) values('" + descripcion + " ', " + valorradio + " ,'" + notasI + "' , '" + notasF + "' , '" + fechaactual + "' , '" + FECHAL + "' , '" + checkFullDay + "' , '" + lugar + "' , '" + etiquetas + "' , " + valorradiopri + " , " + EstadoSel + ")";

        } else {
          myApp.alert("La fecha limite del evento no puede ser anterior a la fecha actual", "Error");

        }
      } else {
        /*myApp.alert("Falta establecer la Fecha Limite");*/
        //if(FECHAL>fechaactual){
        var queryinsert = "insert into dbCalendario_Tareas (Descripcion , Tipo , Notas_Inicio ,Notas_Fin , Fecha_Inicio ,Fecha_DiaCompleto,  Lugar, Tags, Prioridad , Estado) values('" + descripcion + " ', " + valorradio + " ,'" + notasI + "' , '" + notasF + "' , '" + fechaactual + "' , '" + checkFullDay + "' , '" + lugar + "' , '" + etiquetas + "' , " + valorradiopri + " , " + EstadoSel + ")";

        //}else{
        //  myApp.alert("La fecha limite del evento no puede ser anterior a la fecha actual","Error");

        // }
      }


    } else if (valorradio == 2 && idsclientes[0] != null) {
      //Cita

      if (FECHAI > fechaactual && FECHAF > fechaactual) {

        var queryinsert = "insert into dbCalendario_Tareas (Descripcion , Tipo , Notas_Inicio ,Notas_Fin , Fecha_Inicio , Fecha_Fin ,Fecha_DiaCompleto,  Lugar, Tags, Prioridad , Estado, id_Cliente) values('" + descripcion + " ', " + valorradio + " ,'" + notasI + "' , '" + notasF + "' , '" + FECHAI + "' , '" + FECHAF + "' , '" + checkFullDay + "' , '" + lugar + "' , '" + etiquetas + "' , " + valorradiopri + " , " + EstadoSel + "," + idsclientes[0] + ")";


      } else {
        myApp.alert("Las Fechas seleccionadas no pueden ser anteriores a la fecha actual", "Error");

      }

    } else if (valorradio == 2 && idsclientes[0] == null) {

      if (FECHAI > fechaactual && FECHAF > fechaactual) {
        // myApp.alert("Esta vacio casilla de clientes");
        var queryinsert = "insert into dbCalendario_Tareas (Descripcion , Tipo , Notas_Inicio ,Notas_Fin , Fecha_Inicio , Fecha_Fin ,Fecha_DiaCompleto,  Lugar, Tags, Prioridad , Estado) values('" + descripcion + " ', " + valorradio + " ,'" + notasI + "' , '" + notasF + "' , '" + FECHAI + "' , '" + FECHAF + "' , '" + checkFullDay + "' , '" + lugar + "' , '" + etiquetas + "' , " + valorradiopri + " , " + EstadoSel + ")";


      } else {
        myApp.alert("Las Fechas seleccionadas no pueden ser anteriores a la fecha actual", "Error");

      }


    }

    var deviceKey = localStorage.getItem('DeviceKey');
    var mobilekey = localStorage.getItem('AzureMobile');

    var postdata = {};

    postdata.deviceKey = deviceKey;
    postdata.mobileKey = mobilekey;
    postdata.query = queryinsert;
    if (postdata.query != undefined) {

      $.ajax({
        type: "GET",
        url: "http://admix.com.mx:8090/Test.asmx/Insert",
        dataType: 'xml',
        contentType: 'application/xml;charset=utf-8',
        data: postdata,
        success: onSuccessusers,
        error: function(responseError, msg, e) {
          var tempError = JSON.stringify(responseError);
          // console.log(tempError.responseText);
          myApp.alert("Error, No se guardo correctamente");
        }
      });

    }


    function onSuccessusers(data) {


      //obtenemos los ids de los participantes que van a tener el evento
      var usuarios = document.getElementById('selectusuario');
      // console.log(usuario);

      var ids = getSelectValues(usuarios);

      function getSelectValues(select) {
        var result = [];
        var options = select && select.options;
        var opt;

        for (var i = 0, iLen = options.length; i < iLen; i++) {
          opt = options[i];

          if (opt.selected) {
            result.push(opt.value || opt.text);
          }
        }
        return result;
      }


      //Bandera de participantes
      var bandP = false;
      if (ids[0] != null) {
        bandP = true;
      } else {
        bandP = false;
      }

      if (bandP == true) {

        console.log(ids);


        var ArrayData = $.parseJSON(data.documentElement.innerHTML);
        console.log(ArrayData);
        if (ArrayData[0] == "No se puede ejecutar la consulta.") {

          myApp.alert("No se pudo guardar su evento, revise sus campos", "Error");
        } else {
          var idTarea = ArrayData[0];
          var idEmpleado = sessionStorage.getItem("idEmpleado");
          var deviceKey = localStorage.getItem('DeviceKey');
          var mobilekey = localStorage.getItem('AzureMobile');

          for (var i = 0; i < ids.length; i++) {

            var querytareaparticipante = "insert into dbCalendario_Tareas_Participantes(idTarea , id_Participante, id_Participante_Tipo) values(" + idTarea + " , " + ids[i] + "," + 1 + ")";
            agregarpart(querytareaparticipante);

          }

          //metodo para insertar participantes
          function agregarpart(consulta) {
            var postdata = {};

            postdata.deviceKey = deviceKey;
            postdata.mobileKey = mobilekey;
            postdata.query = consulta;

            $.ajax({
              type: "GET",
              url: "http://admix.com.mx:8090/Test.asmx/Insert",
              dataType: 'xml',
              contentType: 'application/xml;charset=utf-8',
              data: postdata,
              success: registroparticipanteyevento,
              error: function(responseError, msg, e) {
                var tempError = JSON.stringify(responseError);
                // console.log(tempError.responseText);
                myApp.alert("Error, No se guardo correctamente");
              }
            });

            function registroparticipanteyevento(data) {
              var participante = $.parseJSON(data.documentElement.innerHTML);
              console.log(participante);
              console.log("se guardo el participante");
            }

            //myApp.alert("Se guardo el Evento");


          }
          mainView.router.loadPage('pags/Iniciotabs.html');
        }


      } else {
        var ArrayData = $.parseJSON(data.documentElement.innerHTML);
        console.log(ArrayData);
        if (ArrayData[0] == "No se puede ejecutar la consulta.") {

          myApp.alert("No se pudo guardar su evento, revise sus campos", "Error");
        } else {

          var idTarea = ArrayData[0];
          //Como el Administrador no pertenece a la tabla empleado se deja -1
          var idUsuario = sessionStorage.getItem("idUsuario");
          // var idEmpleado=sessionStorage.getItem("idEmpleado");
          var querytareaparticipante = "insert into dbCalendario_Tareas_Participantes(idTarea , id_Participante, id_Participante_Tipo) values(" + idTarea + " , " + idUsuario + "," + 1 + ")";

          var deviceKey = localStorage.getItem('DeviceKey');
          var mobilekey = localStorage.getItem('AzureMobile');

          var postdata = {};

          postdata.deviceKey = deviceKey;
          postdata.mobileKey = mobilekey;
          postdata.query = querytareaparticipante;

          $.ajax({
            type: "GET",
            url: "http://admix.com.mx:8090/Test.asmx/Insert",
            dataType: 'xml',
            contentType: 'application/xml;charset=utf-8',
            data: postdata,
            success: registroparticipanteyevento,
            error: function(responseError, msg, e) {
              var tempError = JSON.stringify(responseError);
              // console.log(tempError.responseText);
              myApp.alert("Error, No se guardo correctamente");
            }
          });

          function registroparticipanteyevento(data) {
            var participante = $.parseJSON(data.documentElement.innerHTML);
            console.log(participante);
          }
          //myApp.alert("Se guardo el Evento");
          mainView.router.loadPage('pags/Iniciotabs.html');

          /* if(ArrayData[0].DeviceKey===null){
               myApp.alert(ArrayData[0].Error.Message);
           }else{
             localStorage.setItem("AzureMobile", ArrayData[0].AzureMobile);
             localStorage.setItem("DeviceKey",ArrayData[0].DeviceKey);
             localStorage.setItem("Schema",ArrayData[0].Schema);
             mainView.router.loadPage('pags/login.html');

           }*/
          // // console.log(ArrayData);

        }

      }

    }

  };



  var calendarDateFormat = myApp.calendar({
    input: '#calendariofechainicio',
    dateFormat: 'yyyy/mm/dd'
  });
  var calendarDateFormat = myApp.calendar({
    input: '#calendariofechafin',
    dateFormat: 'yyyy/mm/dd'
  });
  var calendarDateFormat = myApp.calendar({
    input: '#calfechalimite',
    dateFormat: 'yyyy/mm/dd'
  });
  var pickerDevice = myApp.picker({
    input: '#horainicio',
    rotateEffect: true,
    cols: [{
      textAlign: 'left',
      values: ('00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23').split(' ')
    }, {
      values: (':').split(' ')
    }, {
      values: ('00 01 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59').split(' ')
    }, ]
  });
  var pickerDevice = myApp.picker({
    input: '#horafin',
    rotateEffect: true,
    cols: [{
      textAlign: 'left',
      values: ('00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23').split(' ')
    }, {
      values: (':').split(' ')
    }, {
      values: ('00 01 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59').split(' ')
    }, ]
  });
  var pickerDevice = myApp.picker({
    input: '#horafinlimite',
    rotateEffect: true,
    cols: [{
      textAlign: 'left',
      values: ('00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23').split(' ')
    }, {
      values: (':').split(' ')
    }, {
      values: ('00 01 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59').split(' ')
    }, ]
  });
  //tags
  $("#butaceptar").click(function() {
    var cajatags = $$("#cajatags").val();



    var newNode = document.createElement('div');
    newNode.className = 'chip';
    newNode.innerHTML = "<div class='chip-label'>" + cajatags + "</div><a href='#' class='chip-delete'></a>";
    document.getElementById('contchips').appendChild(newNode);

    $$('.chip-delete').on('click', function(e) {
      e.preventDefault();
      var chip = $$(this).parents('.chip');
      myApp.confirm('Desea borrar esta tag?', function() {
        document.getElementById("cajatags").value = "";
        chip.remove();

      });
    });


    /*<div class='chip'><div class='chip-label'>Example</div><a href='#' class='chip-delete'></a></div>*/

    /* var chip = document.createElement("div");
     var node = document.createTextNode(cajatags);
     chip.appendChild(node);
     var element = document.getElementById("contchips");
     element.appendChild(chip);*/
  });

  $$('.chip-delete').on('click', function(e) {
    e.preventDefault();
    var chip = $$(this).parents('.chip');
    myApp.confirm('Desea borrar esta tag?', function() {
      chip.remove();
    });
  });

});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('buscareventos', function(page) {
  // run createContentPage func after link was clicked
  $$('.create-page').on('click', function() {
    createContentPage();
  });
});

myApp.onPageInit('login', function(page) {
  myApp.hideIndicator();
  // run createContentPage func after link was clicked
  $$('.create-page').on('click', function() {
    createContentPage();
  });


  $(function() {
    if (typeof(Storage) !== "undefined") {
      // Store

      // Retrieve
      document.getElementById('loginusuario').value = localStorage.getItem("email");
      document.getElementById('logincontra').value = localStorage.getItem("password");
      document.getElementById('remember-me').checked = true;


      var cajauser = document.getElementById('loginusuario').value = localStorage.getItem("email");
      var contra = document.getElementById('logincontra').value = localStorage.getItem("password");
      if (cajauser === "" || contra === "") {
        document.getElementById('remember-me').checked = false;
      }
    } else {
      myApp.alert("Tu Dipositivo no soporta almacenamiento local de variables");
    }
  });

  var checkRecordarContraseña = document.getElementById('remember-me');
  checkRecordarContraseña.onchange = function() {
    if (checkRecordarContraseña.checked) {
      var user = $$('#loginusuario').val();
      localStorage.setItem("email", user);
      var password = $$('#logincontra').val();
      localStorage.setItem("password", password);
    } else {
      localStorage.setItem("email", "");
      localStorage.setItem("password", "");
      document.getElementById('remember-me').checked = false;
    }
  }

  $("#loginbutton").click(function() {

    myApp.showIndicator();

    /*       // Check browser support
if (typeof(Storage) !== "undefined") {
    // Store
   localStorage.setItem("result", "guille");
    // Retrieve
    document.getElementById("loginusuario").innerHTML = localStorage.getItem("lastname");


} else {
    //document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
    myApp.alert('No soporta el amlamacenamiento local');
}*/


    var admixProduct = 13;
    var typeDevice = tipodispositivo;
    var deviceKey = localStorage.getItem('DeviceKey');
    var user = $$('#loginusuario').val();
    var password = $$('#logincontra').val();

    var postdata = {};

    postdata.admixProduct = admixProduct;
    postdata.typeDevice = typeDevice;
    postdata.deviceKey = deviceKey;
    postdata.user = user;
    postdata.password = password;

    //alert("entro en llamada ajax");
    $.ajax({
      type: "GET",
      url: "http://admix.com.mx:8090/Test.asmx/Login",
      dataType: 'xml',
      contentType: 'application/xml;charset=utf-8',
      data: postdata,
      success: onSuccessLogin,
      error: function(responseError, msg, e) {
        var tempError = JSON.stringify(responseError);
        // console.log(tempError.responseText);
        myApp.alert("Error, Introduzca las Credenciales Proporcionadas por su Proveedor de Admix");
        myApp.hideIndicator();
      }

    });

    function onSuccessLogin(data) {
      var ArrayData = $.parseJSON(data.documentElement.innerHTML);

      if (ArrayData[0].Error !== null) {
        myApp.alert("Error " + ArrayData[0].Error.Message + "<br>" + ArrayData[0].Error.Solution);
        myApp.hideIndicator();
      } else {
        // // console.log(ArrayData);
        // myApp.alert("Inicio de Sesion Correcto ", "Bienvenido");
        // console.log("Inicio de Sesion Correcto");

        /**Carga de Usuario y Empleados**/
        var idUser = ArrayData[0].IdUser;

        // console.log(idUser);
        if (idUser === -1) {
          //myApp.alert("Usuario Administrador");
          // console.log("Usuario Administrador");
          sessionStorage.setItem("idUsuario", idUser);
          mainView.router.loadPage('pags/Iniciotabs.html');

          //sessionStorage.setItem("idUsuario",idUser);

        } else {
          // console.log("Usuario Empleado u Otro");

          // mainView.router.load({url:'pags/Iniciotabs.html',query:{id_User:idUser}});
          //guardamos el iduserlogeado
          sessionStorage.setItem("idUsuario", idUser);

          //mainView.router.loadPage('pags/Iniciotabs.html');


          var deviceKey = localStorage.getItem('DeviceKey');
          var Mobilekey = localStorage.getItem('AzureMobile');
          var consulta = 'SELECT * From SyUsers Where id=' + idUser;

          var postdata = {};

          postdata.deviceKey = deviceKey;
          postdata.mobileKey = Mobilekey;
          postdata.query = consulta;

          $.ajax({
            type: "GET",
            url: "http://admix.com.mx:8090/Test.asmx/Query",
            dataType: 'xml',
            contentType: 'application/xml;charset=utf-8',
            data: postdata,
            success: ResultConsultUser,
            error: function(responseError, msg, e) {
              var tempError = JSON.stringify(responseError);
              // console.log(tempError.responseText);
              myApp.alert("Error, Al consultar Usuario");
            }

          });

          function ResultConsultUser(data) {
            var resul = $.parseJSON(data.documentElement.innerHTML);
            //  // console.log(resul);
            var usuario = $.parseJSON(resul);

            if (usuario[0].idEmpleado == null) {
              var idEmpleado = "null";
              sessionStorage.setItem('idEmpleado', idEmpleado);
              mainView.router.loadPage('pags/Iniciotabs.html');

            } else {
              /**Consulta si pertenece a un departamento a traves del id empleado**/

              var idEmpleado = usuario[0].IdEmpleado;
              sessionStorage.setItem('idEmpleado', idEmpleado);

              var deviceKey = localStorage.getItem('DeviceKey');
              var Mobilekey = localStorage.getItem('AzureMobile');
              var consultaemp = 'SELECT * From dbEmpleados Where id=' + idEmpleado;

              var postdata = {};

              postdata.deviceKey = deviceKey;
              postdata.mobileKey = Mobilekey;
              postdata.query = consultaemp;

              $.ajax({
                type: "GET",
                url: "http://admix.com.mx:8090/Test.asmx/Query",
                dataType: 'xml',
                contentType: 'application/xml;charset=utf-8',
                data: postdata,
                success: ResultConsultEmp,
                error: function(responseError, msg, e) {
                  var tempError = JSON.stringify(responseError);
                  // console.log(tempError.responseText);
                  myApp.alert("Error, Al consultar Empleado");
                }

              });

              function ResultConsultEmp(data) {
                var resultempl = $.parseJSON(data.documentElement.innerHTML);


                //  // console.log(resultempl);
                var Empleado = $.parseJSON(resultempl);
                //// console.log(Empleado);
                var idDepartamento = Empleado[0].IdDepartamento;
                var idPuesto = Empleado[0].IdPuesto;

                var idEmpleado = usuario[0].IdEmpleado;

                var userloggueado = [];
                var usuariologeado = {
                  id: idEmpleado,
                  Nombre: Empleado[0].Nombre
                };
                userloggueado[0] = usuariologeado;
                // console.log(userloggueado);
                // mainView.router.load({url:'pags/Iniciotabs.html',query:userloggueado});

                mainView.router.loadPage('pags/Iniciotabs.html');
                myApp.showTab('#tab1');
              }



            }

          }

        } //else de uaurio
        // mainView.router.load({url:'pags/Iniciotabs.html',query:userloggueado});
      }

    }

    /*  var admixProduct=13;
            var typeDevice=4;
            var deviceKey='AFEA530DC12AAE8106FDC845A14B6176';
            var deviceName='Android-Simulator';

            var postdata = {};
            postdata.admixProduct=admixProduct;
            postdata.typeDevice=typeDevice;
            postdata.deviceKey=deviceKey;
            postdata.deviceName=deviceName;

            //alert("entro en llamada ajax");
                $.ajax({
                  type: "GET",
                  url: "http://192.168.0.134:8090/Test.asmx/DeviceRegistered",
                  dataType:'xml',
                  contentType:'application/xml;charset=utf-8',
                  data: postdata,
                  success: onSuccess
                });

    function onSuccess(data,status,xr)
        {
            var ArrayData = $.parseJSON(data.documentElement.innerHTML);
            myApp.alert("Inicio de Sesion Correcto "+ ArrayData[0].IdUser);

            /* console.log(data.documentElement.innerHTML);
                        var ArrayData = $.parseJSON(data.documentElement.innerHTML);
                        // console.log(ArrayData);
            myApp.alert("clave de dispositivo a guardar <br>"+ArrayData[0].DeviceKey);*/



    //Generamos un  objeto con los datos
    /*function generartxt(datos){
        var texto = [];
        texto.push('admixProduct:');
        texto.push(datos.admixProduct);
        texto.push('\n');
        texto.push('typeDevice:');
        texto.push(datos.typeDevice);
        texto.push('\n');
        texto.push('deviceKey:');
        texto.push(datos.DeviceKey);
        texto.push('\n');
        deviceName('deviceName:');
        texto.push(datos.deviceName);
        texto.push('\n');
        //El contructor de Blob requiere un Array en el primer parámetro
        //así que no es necesario usar toString. el segundo parámetro
        //es el tipo MIME del archivo
        return new Blob(texto, {
            type: 'text/plain'
        });*/

    // };



    //callback(ArrayData);
    //alert("fue exitoso");
    //$("#etiqueta").html("Result: " + data.d[1].Nombre);
    /*var i;
    for(i=1;i<=data.d.length;i++){
        document.getElementById("Item"+i).innerHTML = data.d[i].Nombre;
    }*/

    // }*/
  });


});


// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function(page) {
  // run createContentPage func after link was clicked
  $$('.create-page').on('click', function() {
    createContentPage();
  });
});

myApp.onPageInit('settings', function(page) {
  // run createContentPage func after link was clicked
  $$('.create-page').on('click', function() {
    createContentPage();
  });

  var butdesvincular = document.getElementById('buttondesvinculardisp').onclick = function() {

    var admixProduct = 13;
    var typeDevice = tipodispositivo;
    var deviceKey = localStorage.getItem('DeviceKey');
    var deviceName = "Android-Simulator";
    //    var deviceKey="7E79E70A1951987A6A8B44FAA5F5A283";
    //    var deviceName="Motorola";
    var code = 0;


    var postdata = {};

    postdata.admixProduct = admixProduct;
    postdata.typeDevice = typeDevice;
    postdata.deviceKey = deviceKey;
    postdata.deviceName = deviceName;
    postdata.code = code;

    $.ajax({
      type: "GET",
      url: "http://admix.com.mx:8090/Test.asmx/DeviceDisassociate",
      dataType: 'xml',
      contentType: 'application/xml;charset=utf-8',
      data: postdata,
      success: onSuccessdevdes,
      error: function(responseError, msg, e) {
        var tempError = JSON.stringify(responseError);
        // console.log(tempError.responseText);
        myApp.alert("Error de servicio");
      }

    });

    function onSuccessdevdes(data) {
      var ArrayData = $.parseJSON(data.documentElement.innerHTML);
      // // console.log(ArrayData);
      myApp.alert("Su dispositivo se ha desvinculado");
      localStorage.setItem("AzureMobile", "undefined");
      localStorage.setItem("DeviceKey", "undefined");

      // mainView.router.reloadPage('index.html');
      //mainView.router.refreshPage('index.html');
      localStorage.setItem("email", "");
      localStorage.setItem("password", "");

      mainView.router.loadPage('pags/registrardisp.html');
      //document.getElementById('remember-me').checked=false;
    }



  }

});

myApp.onPageInit('eventosdetalle', function(page) {
  $$('.create-page').on('click', function() {
    createContentPage();
  });

  $$('.show-tab-3').on('click', function() {
    mainView.router.back();
    // mainView.router.loadPage("pags/Iniciotabs.html");
    //   myApp.showTab('#tab3');
  });
});

myApp.onPageInit('calendarioeventos', function(nummes, page) {



  $$('.show-tab-2').on('click', function() {
    mainView.router.loadPage("pags/Iniciotabs.html");
    myApp.showTab('#tab2');
  });

  $(function() {
    var deviceKey = localStorage.getItem('DeviceKey');
    var Mobilekey = localStorage.getItem('AzureMobile');
    var consulta = 'SELECT * FROM dbCalendario_Tareas';

    var postdata = {};

    postdata.deviceKey = deviceKey;
    postdata.mobileKey = Mobilekey;
    postdata.query = consulta;
    //alert("entro en llamada ajax");
    $.ajax({
      type: "GET",
      url: "http://admix.com.mx:8090/Test.asmx/Query",
      dataType: 'xml',
      contentType: 'application/xml;charset=utf-8',
      data: postdata,
      success: pintardotsdeeventos,
      error: function(responseError, msg, e) {
        var tempError = JSON.stringify(responseError);
        // console.log(tempError.responseText);
        myApp.alert("Error, de Carga del Servicio");
      }
    });

  });
  /***Aqui va el pintado de los dots***/
  var Fechasdot = [];

  function pintardotsdeeventos(data) {
    var ArrayEvento = $.parseJSON(data.documentElement.innerHTML);
    var objectoEvento = $.parseJSON(ArrayEvento);
    // console.log(objectoEvento);

    for (var i = 0; i < objectoEvento.length; i++) {

      if (objectoEvento[i].Fecha_Inicio === null) {
        myApp.alert("Error, Hay un evento con fechas nulas");
      }

      var FI = objectoEvento[i].Fecha_Inicio;
      //Fecha Inicio
      var inicio = FI.indexOf("(");
      var fin = FI.indexOf(")");
      var newdate = FI.substring(inicio + 1, fin);
      var cad = parseFloat(newdate);
      var fechainicio = new Date(cad);

      var mes = (fechainicio.getMonth() + 1);
      var dia = (fechainicio.getDate());

      var mesfull;
      if (mes < 10) {
        mesfull = "0" + mes;
      } else {
        mesfull = mes;
      }
      var diafull;
      if (dia < 10) {
        diafull = "0" + dia;
      } else {
        diafull = dia;
      }

      var fullfechaI = fechainicio.getFullYear() + "/" + mesfull + "/" + diafull;

      //Fecha Fin
      var FF = objectoEvento[i].Fecha_Fin;

      var inicio = FF.indexOf("(");
      var fin = FF.indexOf(")");
      var newdatef = FF.substring(inicio + 1, fin);
      var cadf = parseFloat(newdatef);
      var fechafin = new Date(cadf);

      var mesf = (fechafin.getMonth() + 1);
      var diaf = (fechafin.getDate());

      var mesfullf;
      if (mesf < 10) {
        mesfullf = "0" + mesf;
      } else {
        mesfullf = mesf;
      }
      var diafullf;
      if (diaf < 10) {
        diafullf = "0" + diaf;
      } else {
        diafullf = diaf;
      }

      var fullfechaf = fechafin.getFullYear() + "/" + mesfullf + "/" + diafullf;

      var dateini = new Date(fullfechaI);
      var datefin = new Date(fullfechaf);

      var fechasdotobjecto = {
        from: dateini,
        to: datefin
      };
      Fechasdot[i] = fechasdotobjecto;


    }
    // console.log(Fechasdot);


    var cajafechaini = "2016/01/04";
    var cajafechafin = "2016/01/04";

    var dateini = new Date(cajafechaini);
    var datefin = new Date(cajafechafin);

    var cajafechaini2 = "2016/01/09";
    var cajafechafin2 = "2016/01/10";

    var dateini2 = new Date(cajafechaini2);
    var datefin2 = new Date(cajafechafin2);
    //var dateini2=new Date(2016, 0, 25);
    //var datefin2=new Date(2016, 0, 26);



    //var prueba={new Date(2016, 0, 1)},{new Date(2016, 0, 2)};
    /*var prueba = [];
        prueba["from:"] = new Date(2016, 0, 1);
        person["to:"] = new Date(2016, 0, 2);*/

    var points = [{
      from: dateini,
      to: datefin
    }, {
      from: dateini2,
      to: datefin2
    }];
    // console.log(points);

    //fecha modifica el mes selecionado
    var date = new Date();
    date.setMonth(nummes.query.mes);


  }


  /*     var calendarDateFormat = myApp.calendar({
   input: '#calendarioselfechaini',
   dateFormat: 'yyyy/mm/dd'
   });
   var calendarDateFormat = myApp.calendar({
   input: '#calendarioselfechafin',
   dateFormat: 'yyyy/mm/dd'
   });*/



  //  $("#Crearevento").click(function() {

  //  var cajafechaini=$$('#calendarioselfechaini').val();
  //  var cajafechafin=$$('#calendarioselfechafin').val();



  //});
  /*********************Mostreo de Eventos en el Calendario*********************/
  //Se muestra la lista de eventos seleccionados
  var fechaselec = document.getElementById('calendar-default').value;
  document.getElementById('calendar-default').onchange = function() {

    mostrareventos();

  };

  // mostrareventos();
  function mostrareventos() {
    $("#contcaleventos").empty();


    fechaselec = document.getElementById('calendar-default').value;
    //myApp.alert("fecha de hoy"+fechaselec);
    $(function() {
      var deviceKey = localStorage.getItem('DeviceKey');
      var Mobilekey = localStorage.getItem('AzureMobile');
      var consulta = 'SELECT * FROM dbCalendario_Tareas';

      var postdata = {};

      postdata.deviceKey = deviceKey;
      postdata.mobileKey = Mobilekey;
      postdata.query = consulta;
      //alert("entro en llamada ajax");
      $.ajax({
        type: "GET",
        url: "http://admix.com.mx:8090/Test.asmx/Query",
        dataType: 'xml',
        contentType: 'application/xml;charset=utf-8',
        data: postdata,
        success: mostrareventosclick,
        error: function(responseError, msg, e) {
          var tempError = JSON.stringify(responseError);
          // console.log(tempError.responseText);
          myApp.alert("Error, de Carga del Servicio");
        }
      });
    });

    var arraytempeventosel = [];

    function mostrareventosclick(data) {
      var Arraydata = $.parseJSON(data.documentElement.innerHTML);
      var eventostodos = $.parseJSON(Arraydata);
      //// console.log(eventostodos);


      for (var j = 0; j < eventostodos.length; j++) {

        var FI = eventostodos[j].Fecha_Inicio;


        //Fecha Inicio
        var inicio = FI.indexOf("(");
        var fin = FI.indexOf(")");
        var newdate = FI.substring(inicio + 1, fin);
        var cad = parseFloat(newdate);
        var fechainicio = new Date(cad);

        var mes = (fechainicio.getMonth() + 1);
        var dia = (fechainicio.getDate());

        var mesfull;
        if (mes < 10) {
          mesfull = "0" + mes;
        } else {
          mesfull = mes;
        }
        var diafull;
        if (dia < 10) {
          diafull = "0" + dia;
        } else {
          diafull = dia;
        }

        var fullfechaI = fechainicio.getFullYear() + "-" + mesfull + "-" + diafull;

        if (fullfechaI === fechaselec) {
          arraytempeventosel.push(eventostodos[j]);
          // myApp.alert("si es igual");
          // // console.log(arraytempeventosel);
        }
      }


      for (var k = 0; k < arraytempeventosel.length; k++) {

        var imagen;
        if (arraytempeventosel[k].Tipo === 1) {
          imagen = 'img/taskmdpi.png';
        } else if (arraytempeventosel[k].Tipo === 2) {
          imagen = 'img/clock-mdpi.png';
        }

        var newNode = document.createElement('a');
        newNode.setAttribute('href', 'pags/eventosdetalle.html');
        newNode.setAttribute('onClick', 'eventodetalle(' + arraytempeventosel[k].id + ')');
        newNode.className = 'item-link';
        newNode.innerHTML = "<li class='swipeout'>" +
          "<div class='swipeout-content item-content'>" +
          "<div class='item-media'><img src='" + imagen + "'></div>" +
          "<div class='item-inner'><div class='item-title'>" + arraytempeventosel[k].Descripcion + "</div></div>" +
          "</div>" +
          "<div class='swipeout-actions-right'>" +
          "<a class='swipeout-delete' onClick='eliminar(" + arraytempeventosel[k].id + ")'>Eliminar</a>" +

          "</div>" +
          "</li>";

        document.getElementById('contcaleventos').appendChild(newNode);



      }

    }
  }

});


/**metodos del boton de regreso**/
/*myApp.onPageInit('test', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
});
myApp.onPageInit('test2', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
});

myApp.onPageInit('pantallainicio', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
});*/

// Generate dynamic page
/*var dynamicPageIndex = 0;
function createContentPage() {
  mainView.router.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-pages" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
  return;
}*/