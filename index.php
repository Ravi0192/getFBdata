<!DOCTYPE html>
<html>
  <head>
  <title>Facebook - Get Fanpage Data</title>
  <meta charset="UTF-8">
  <link href="css/bootstrap.css" rel="stylesheet" type="text/css"/>
  <link href="css/bootstrap-theme.css" rel="stylesheet" type="text/css"/>
  <link href="css/bootstrap-datetimepicker.css" rel="stylesheet" type="text/css"/>
  <link href="css/bootstrap-datepicker3.css" rel="stylesheet" type="text/css"/>
  <link href="css/global.css" rel="stylesheet" type="text/css"/>

  <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
  <script src="js/bootstrap-datepicker.js"></script> 
  <script src="js/jquery.dataTables.js"></script> 
  <script src="js/moment.min.js"></script> 
  <script src="js/app.js"></script> 
</head>
<body>
  <div id="fb-root"></div>
  <script>
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '1556948941252219',
        cookie     : true,  // enable cookies to allow the server to access 
                            // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.2' // use version 2.2
      });

      FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
      });
    };

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    // Here we run a very simple test of the Graph API after login is
    // successful.  See statusChangeCallback() for when this call is made.
    function testAPI() {
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
      });

      jQuery('.login').hide();
      jQuery('#FBdata').show();
    }

    function fbLogout() {
      FB.logout(function (response) {
          //Do what ever you want here when logged out like reloading the page
          window.location.reload();
      });
    }
  </script>
  
  <div class="container">
    <div class="row">
      <div class="login col-md-12 text-center">
        <h4 class="col-md-4 col-md-offset-4">Para usar esta herramienta, inicia sesión en la APP</h4>
        <div class="col-md-4 col-md-offset-4">
          <fb:login-button scope="public_profile,email,read_stream" onlogin="checkLoginState();"></fb:login-button>
        </div>
      </div>
    </div>

    <div id="FBdata">
      <div class="data-form row">
        <form method="post" class="col-md-10">
          <label for="pageID">
            <span>ID de la Página:</span>
            <input type="text" id="pageID" name="pageID" placeholder="https://www.facebook.com/TottusPeru" />
          </label>
          <label for="datepicker">
            <span>Desde:</span>
            <input type="text" id="datepicker" name="datepicker" />
          </label>
          <label for="datepicker">
            <span>Mostrar:</span>
            <select name="limit" id="limit">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30" selected>30</option>
              <option value="40">40</option>
              <option value="50">50</option>
            </select>
          </label>
          <input type="submit" id="getData" value="Obtener Info" />
        </form>

        <span id="fbLogout" class="col-md-2" onclick="fbLogout()">
          <a class="fb_button fb_button_medium">Logout</a>
        </span>

      </div>
    
      <script type="text/javascript">
        jQuery(document).ready(function() {
          jQuery('#fanpageData').dataTable( {
            "scrollCollapse": true,
            "paging":         false,
            "order": [ [1,"desc"] ],
            "columnDefs": [ {
                  "targets": [ 0 ],
                  "visible": false,
                  "searchable": false
              } ],
            "language": {
              "zeroRecords": "No se ingresaron datos aún"
            }
          });

          var body_height = parseInt(jQuery('#fanpageData_wrapper .dataTables_scrollBody').height());

          jQuery('.dataTables_scrollHeadInner, .dataTables_scrollHead .table').css({width:'100%'});
        });
      </script>
      <div class="fanpage-info row">
        <div class="picture col-md-2">
          <div class="image"></div>
        </div>
        <div class="info col-md-8">
          <div class="name">Nombre: <span></span></div>
          <div class="likes"># Likes: <span></span></div>
          <div class="tas"># PTAU: <span></span></div>
        </div>
        <div class="col-md-2">
          <a class="button">Generar CSV</a>
          <textarea name="JSONdata" id="JSONdata" cols="30" rows="10" class="hidden"></textarea>
        </div>
      </div>
      <table id="fanpageData" class="row table table-striped table-bordered">
          <thead>
              <tr>
                  <th class="text-center" style="width: 50px">ID</th>
                  <th class="text-center" style="width: 40px">Fecha</th>
                  <th class="text-center" style="width: 150px">Imagen</th>
                  <th class="text-center" style="width: 180px">Mención</th>
                  <th class="text-center" style="width: 30px">Likes</th>
                  <th class="text-center" style="width: 30px">Comentarios</th>
                  <th class="text-center" style="width: 30px">Shares</th>
              </tr>
          </thead>
          <tbody>
          </tbody>
      </table>
    </div>
  </div>
</body>
</html>