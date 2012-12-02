      var map;
      var socket =io.connect('http://localhost/');

      var firstTabInitlized = false;
      var secondTabInitlized = false;
      var thirdTabInitlized = false;

      var listOfMarkers = new Array();
    

////////////////////////////////////////////////////////////////////////////////////////
      function InitilizeFirstTab()
      {
        if(firstTabInitlized === false)
        {
          socket.emit('getExplaination');
          socket.on('explaination',function(data){
          console.log(data);
          SetExplainationText(data[0]);
          });
          firstTabInitlized = true;
        }
      }


      function SetExplainationText(explainationData)
      {
        var organization = explainationData.organziation;
        var explainHtml= explainationData.explanationHtml;
        var lastTimeUpdated = explainationData.lastTimeUpdated;

        var newHTML = '<hero-unit>'
        +'<h1>'+organization +'</h1>'
        +'<p>' + explainHtml + '</p>'
        + '<h3>' + lastTimeUpdated +'</h3>'
        '</hero-unit>';
      
        document.getElementById('ExplaninationText').innerHTML = newHTML;
      }

/////////////////////////////////////////////////////////////////
      function InitizeSecondTab() {
        if(secondTabInitlized === false)
        {
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

            $("#mapDetails li").live('click', function(e) { 
              console.log($(this).index());
              var listIndex = $(this).index();
              ActivateMarker(listIndex);
              window.location.href = '#BottomOfMap';
            })
            secondTabInitlized = true; 
        }
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
            +'</div></li>'
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
          InitilizeThirdTab();
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

      

/////////////////////////////////////////////////////////////////      
      function InitilizeThirdTab(){

        if(thirdTabInitlized === false)
        {
          socket.on('updateFaqs', function (data) {
          $("#questionDetails").append('<ul>');
          for (var i = data.length - 1; i >= 0; i--) {
            $("#questionDetails ul").append('<li>'+data[i].Comments+'<br>'+data[i].CommentDate);
          };
          });
          socket.emit('getLatestQuestions');
          thirdTabInitlized = true;
        }
      }



      


      



      

    







      
      
      