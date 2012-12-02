      var map;
      var socket =io.connect('http://localhost/');

      var listOfMarkers = new Array();
      
      $("#mapDetails").append('<ul>');

      $("#mapDetails li").live('click', function(e) { 
        console.log($(this).index());
        var listIndex = $(this).index();
        ActivateMarker(listIndex);
        window.location.href = '#BottomOfMap';

      })

      function InitilizeFirstTab()
      {
        SetExplainationText();
      }

      function InitizeSecondTab() {
        var mapOptions = {
        center: new google.maps.LatLng(43.6617, -79.3951),
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP  
        };
        var blah = document.getElementById("map_canvas");
        map = new google.maps.Map(blah,
        mapOptions);

        $("#mapDetails").append('<ul>');
        
        // create the request
        socket.emit('getMedicalLocations');
        var result = socket.on('medicalLocations', function (data) {
        CreateGoogleLocations(data, function(error,result){
           if(!error)
           {
              for(var i= 0;i<result.length;i++)
              {
               AddMarker(result[i],map);
              }
           }
          });
        });  
      }

      $("#questionDetails").append('<ul>');

      function AskAQuestion(){
       socket.emit('askAQuestion');
       socket.on('updateFaqs', function (data) {
       for (var i = data.length - 1; i >= 0; i--) {
        $("#questionDetails ul").append('<li>'+data[i].Comments+'<br>'+data[i].CommentDate);
       };

       });
      }

      function CreateGoogleLocations(locations,callback)
      {
        var googleLocations = new Array();
        //console.log(locations);
        for(var i = 0; i<locations.length;i++)
        {
          var recievedLocation = locations[i];
          googleLocations[i] = new google.maps.LatLng(recievedLocation.location[0].xLocation,recievedLocation.location[0].yLocation);
          $("#mapDetails ul").append('<li><div id="myhero" class="hero-unit">'
            +recievedLocation.Name
            +'<br>'+recievedLocation.Address
            +'<br>'+recievedLocation.rating
            +'<br>'+recievedLocation.waitTime
            );
        } 
        callback(null,googleLocations);
      }
      
      function AddMarker(location,map){
        var marker = new google.maps.Marker({
        position: location,
        title:"Hello World!"
        });
        marker.setMap(map);

        // push the marker
        listOfMarkers.push(marker);
       
        google.maps.event.addListener(marker, 'click', function() {
        //map.setZoom(17);
        //map.setCenter(marker.getPosition());
        SetupWindow(marker);
        });
      }
      
      function SetupWindow(marker){
      var infoWindowContent = "<h1>Address:</h1>";
      var infowindow = new google.maps.InfoWindow();
      infowindow.setContent(infoWindowContent);
      infowindow.open(map, marker);

      }

      function SetExplainationText()
      {
        var newHTML = "<span style='color:#0000FF'>" + 'This text comes from the db' + "</span>";
        document.getElementById('ExplaninationText').innerHTML = newHTML;
      }

      function ActivateMarker(infoWindowNumber)
      {
        var marker = listOfMarkers[infoWindowNumber];
        if(typeof marker ==='undefined')
          return;
        SetupWindow(marker);
      }

      
      $('a[data-toggle="tab"]').on('shown', function (e) {
      var href = e.target.href;
        if(href.substr(href.length - 1)==='3')
        {
          AskAQuestion();
        }
        else if(href.substr(href.length - 1)==='2')
        {
          InitizeSecondTab();
        }
        else if(href.substr(href.length - 1)==='1')
        {
          InitilizeFirstTab();
        }
        else 
        {

        }
      })



      

    







      
      
      