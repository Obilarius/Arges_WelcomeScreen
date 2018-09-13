let datum = getDatumLang();

$( document ).ready(function() {
  $("#date").html(datum);
  dynAppointment(); // Initiale befüllung mit Terminen

  // REGISTER MODAL SHOW FUNCTION
  $('#registerModalCenter').on('show.bs.modal', function (event) {
    $('.inputName').focus();
    var button = $(event.relatedTarget); // Button that triggered the modal

    $('#registerModalCenter .modal-body .inputName').removeClass("is-invalid");
    $('#registerModalCenter .modal-body .inputCompany').removeClass("is-invalid");
    $('#registerModalCenter .modal-footer span').css("display", "none");

    if (button[0].className == "userRegisterLink") {
      let name = button.data('name') // Extract info from data-* attributes
      let company = button.data('company')
      let host = button.data('host')
      let appID = button.data('appID')
      let location = button.data('location')

      // Update the modal's content.
      let modal = $(this)
      modal.find('.modal-title').text('Welcome ' + name)
      modal.find('.modal-body .inputName').val(name).attr("readonly", true)
      modal.find('.modal-body .inputCompany').val(company).attr("readonly", true)
      if (host) {
        modal.find('.modal-body .inputAppointment').val(host).attr("readonly", true)
      } else {
        modal.find('.modal-body .inputAppointment').val("").attr("readonly", false)
      }
      modal.find('.modal-body').data({ appID: button.data('appid'), location: button.data('location'), host: button.data('host') });
    } else {
      // Update the modal's content.
      let modal = $(this)
      modal.find('.modal-title').text("Welcome to ARGES")
      modal.find('.modal-body .inputName').val("").attr("readonly", false)
      modal.find('.modal-body .inputCompany').val("").attr("readonly", false)
      modal.find('.modal-body .inputAppointment').val("").attr("readonly", false)
      modal.find('.modal-body').data({ appID: "", location: "", host: "" });
    }
  })
  // REGISTER MODAL SET FOCUS
  $('#registerModalCenter').on('shown.bs.modal', function (event) {
    if ($('.modal-body .inputName').val() == "") {
      $('.inputName').focus();
    }
  })

  // REGISTER MODAL BUTTON ## INSERT IN DATENBANK UND ERZEUGT DAS LABEL
  $('#btnRegisterCheckIn').on('click', function (event) {
    var name = $('.modal-body .inputName').val();
    var company = $('.modal-body .inputCompany').val();
    var host = $('.modal-body .inputAppointment').val();

    if ( name == "" || company == "" ) {
      if ( name == "" ) {
        $('.modal-body .inputName').addClass("is-invalid");
      }
      if ( company == "" ) {
        $('.modal-body .inputCompany').addClass("is-invalid");
      }
    } else {
      if (host == "debug") {
        // ÜBERGABE AN DIE DRUCKFUNKTION ## ID BEINHALTET DIE ID DES GERADE EINGETRAGENEN DATENSATZES ZÜRÜCK
        var n = encodeURIComponent($('.modal-body .inputName').val());
        var c = encodeURIComponent($('.modal-body .inputCompany').val());

        var url = 'print.html';
        url += '?name=' + n;
        url += '&company=' + c;
        url += '&date=' + getDatum();
        url += '&debug=true';

        window.open( url, 'winPrint', '');
        $('#registerModalCenter').modal('hide');
      } else {
        // ÜBERGABE AN DIE DATENBANK
        $.post("mssql.php",
        {
            name: $('.modal-body .inputName').val(),
            company: $('.modal-body .inputCompany').val(),
            appid: $('.modal-body').data("appID"),
            location: $('.modal-body').data("location"),
            host: $('.modal-body .inputAppointment').val()
        }, function(id, status){
          if (id == -1) {
            $('#registerModalCenter .modal-footer span').css("display", "inline");

            window.setTimeout(function(){
               $('#registerModalCenter').modal('hide');
            }, 2000);
          } else {
            // ÜBERGABE AN DIE DRUCKFUNKTION ## ID BEINHALTET DIE ID DES GERADE EINGETRAGENEN DATENSATZES ZÜRÜCK
            var n = encodeURIComponent($('.modal-body .inputName').val());
            var c = encodeURIComponent($('.modal-body .inputCompany').val());

            var url = 'print.html';
            url += '?name=' + n;
            url += '&company=' + c;
            url += '&date=' + getDatum();
            url += '&code=' + $.trim(id);
            if ($('.modal-body .inputAppointment').val()) {
              var h = encodeURIComponent($('.modal-body .inputAppointment').val());
              url += '&host=' + h;
            }
            window.open( url, 'winPrint', 'width=210,height=80,resizeable=0,scrollable=0,menubar=0,status=0,top=0');
            $('#registerModalCenter').modal('hide');
          }
        });
      }
    } //End If Debug
  })

  // CHECKOUT MODAL SHOW FUNCTION
  $('#checkOutModalCenter').on('shown.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    $('.inputCheckOutId').focus();

    // Update the modal's content.
    let modal = $(this)
    modal.find('.checkout-body .inputCheckOutId').val("").show();
    modal.find('.checkout-body .checkout-msg').html("").hide();
  })

  // CHECKOUT MODAL BUTTON ## UPDATE IN DATENBANK
  $('#btnRegisterCheckOut').on('click', function (event) {
    var hashids = new Hashids("this is my salt", 6, "1234567890ABCDEF");
    var id = hashids.decode( $('.modal-body .inputCheckOutId').val().trim() );
    // ÜBERGABE AN DIE DATENBANK
    $.post("mssql.php", { visitorid: id[0] }, function(data){
      $('.checkout-body .inputCheckOutId').val("").hide();

      if (data == 1) {
        $('.checkout-body .checkout-msg').html("You have been successfully logged out").show();
      } else {
        $('.checkout-body .checkout-msg').html("You are already logged out").show();
      }
    });

    window.setTimeout(function(){
       $('#checkOutModalCenter').modal('hide');
    }, 1500);
  })


  // DYNAMISCHE TERMINE MIT INTERVAL
  window.setInterval(function()  {
    dynAppointment();
  }, 60000);

}); // Ende Document Ready



function dynAppointment () {
  $.post("readFile.php",
  {
    url: "//filer/Public/Datenbankentwicklung/ARGESVisitors/ARGESVisitorsList.xml"
  }, function(data, status){
    xotree = new XML.ObjTree()
    var jsonObj = xotree.parseXML( data );
    if (!jsonObj.Report.table1) {
      return;
      // Hier Funktion wenn keine Termine in XML sind
    }
    jsonObj = jsonObj.Report.table1.Detail_Collection.Detail

    if (!Array.isArray(jsonObj)) {
      var temp = jsonObj;
      var jsonObj = new Array;
      jsonObj.push(temp);
    }

    $("#dynTermin").html("");
    $.each(jsonObj, function( key, termin ) {
      var terminTemplate = '<tr class="dynTr"><td class="col col1">'+ termin._Start_Time +'</td><td class="col col2"><ul>';

      // NAME IN ARRAY ZERLEGEN
      if ( typeof(termin._Visitors) != "undefined" ) {
        var names = termin._Visitors.replace( /\r\n/gm, "#" ).split("#");
      } else {
        var names = [];
      }

      names.forEach( function(name) {
        let company = termin._Company.replace(/[<br>]*<[/]*div[^>]*>/gi, "");
        company = company.replace(/<[/]*br[^>]*>/gi, " - ");

        let host = ( typeof termin._Host === "undefined" ? null : termin._Host.trim() );

        terminTemplate += '<li><span class="userRegisterLink" data-toggle="modal" data-target="#registerModalCenter"';
        terminTemplate += 'data-name="'+ name +'"';
        terminTemplate += 'data-company="'+ company +'"';
        terminTemplate += 'data-appid="'+ termin._ID +'"';
        terminTemplate += 'data-location="'+ termin._Location +'"';
        terminTemplate += 'data-host="'+ host +'"';
        terminTemplate += 'data-host="Host Name"';

        terminTemplate += '>'+ name +'</span></li>';
      });

      // Prüfung ob die Firmal ausgefüllt wurde
      let _company = ( typeof termin._Company === "undefined" ? "" : termin._Company.trim() );
      terminTemplate += '</ul></td><td class="col col3">'+ _company +'</td><td class="col col4"><img src="'+ termin._WelcomeLogo +'" alt=""></td></tr>';

      $("#dynTermin").append(terminTemplate);
    })
  });
} // Ende dynAppointment
