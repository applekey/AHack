      var map;
      var socket =io.connect('http://localhost/');

      var firstTabInitlized = false;
      var secondTabInitlized = false;
      var thirdTabInitlized = false;

      var listOfMarkers = new Array();
      var currentOpenInfoWindow;

      var currentInstitution = 'UofT';

//////////////////////////////////////////////////////////////////////////////

      InitlizeSockets();
      function InitlizeSockets()
      {
         $("#questionDetails").append('<ul>');
         $("#mapDetails").append('<ul></ul>');

        socket.on('explaination',function(data){
          SetExplainationText(data[0]);
          });

        socket.on('medicalLocations', function (data) {
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

        socket.on('updateFaqs', function (data) {
          for (var i =0; i <data.length; i++) {
            $("#questionDetails ul").append('<li>'
              +data[i].Comments
              +'<br>'
              +data[i].CommentDate);
            };
          });


        socket.on('postSuccessful', function(data){
          // this can be from anybody

          $('#questionDetails li').last().remove();

          $("#questionDetails ul").prepend('<li>'
            +data.Comments
            +'<br>'
            +data.CommentDate
            +'<br>');
          });
      }
    

////////////////////////////////////////////////////////////////////////////////////////
      function InitilizeFirstTab()
      {
        if(firstTabInitlized === false)
        {
          
          socket.emit('getExplaination',currentInstitution);

          firstTabInitlized = true;
        }
      }

      function SetExplainationText(explainationData)
      {
        var organization = explainationData.organziation;
        var resourceAmount = explainationData.medicalResource;
        var explainHtml= explainationData.explanationHtml;
        var lastTimeUpdated = explainationData.lastTimeUpdated;

        //forDateTime
       var lastUpdate = new Date(lastTimeUpdated);
          month = lastUpdate.getMonth()+1;
          day = lastUpdate.getDate();
          year = lastUpdate.getFullYear();
        console.log(lastUpdate);

        var resourceHtml = '<h1>' 
                          +'<font color="red">$'+resourceAmount+'</font>'
                          + ' To Spend On Health Care'
                          + '</h1>';

        var newExplainiationHtml = '<hero-unit>'
        +'<h1>'+organization +'</h1>'
        +'<br>'
        +'<p>' + explainHtml + '</p>'
        +'<br>'
        +'Last Date Updated: '
        + '<em>' + year+'-'+month+'-'+day+'</em>'
        '</hero-unit>';
      
        document.getElementById('ExplaninationText').innerHTML = newExplainiationHtml;
        document.getElementById('headerResourceText').innerHTML=resourceHtml; 
      }

/////////////////////////////////////////////////////////////////
      
      
      function InitizeSecondTab() {
        if(secondTabInitlized === false)
        {
            // refresh the list
            listOfMarkers = new Array();
            currentOpenInfoWindow = null;

            var mapOptions = {
            center: new google.maps.LatLng(43.6617, -79.3951),
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP  
            };
            var blah = document.getElementById("map_canvas");
            map = new google.maps.Map(blah,
            mapOptions);

            
            socket.emit('getMedicalLocations',currentInstitution);

            $("#mapDetails li").live('click', function(e) { 
              var listIndex = $(this).index();
              ActivateMarker(listIndex);
              window.location.href = '#BottomOfMap';
            });

            secondTabInitlized = true; 
        }
      }

      function CreateGoogleLocations(locations,callback)
      {
        var pinuplocation = new Array();
        //console.log(locations);
        for(var i = 0; i<locations.length;i++)
        {
          var recievedLocation = locations[i];
          
          var popUPInformation = {
            googleLocation:new google.maps.LatLng(recievedLocation.location[0].xLocation,recievedLocation.location[0].yLocation),
            contactInformation:'6477873234'
          };

          pinuplocation[i] = popUPInformation;
          
          $("#mapDetails ul").append('<li><div id="myhero" class="hero-unit">'
            +'Name: '+recievedLocation.Name
            +'<br>'+'Addr: '+recievedLocation.Address
            +'<br>'+'Student Rating: '+recievedLocation.rating
            +'<br>'+'Average Wait Time: '+recievedLocation.waitTime
            +'</div></li>'
            );
        } 
        callback(null,pinuplocation);
      }
      
      function AddMarker(location,map){
        var marker = new google.maps.Marker({
        position: location.googleLocation,
        title:"Hello World!"
        });
        marker.setMap(map);

        // push the marker
        listOfMarkers.push(marker);
       
        google.maps.event.addListener(marker, 'click', function() {
        map.setZoom(17);
        map.setCenter(marker.getPosition());
        SetupWindow(marker);
        });
      }
      
      function SetupWindow(marker){
      var infoWindowContent = "<h1>Address:</h1>";
      var infowindow = new google.maps.InfoWindow();
      infowindow.setContent(infoWindowContent);
      
      if(currentOpenInfoWindow !=null)
        currentOpenInfoWindow.close();

      currentOpenInfoWindow = infowindow;
      infowindow.open(map, marker);
      }

      function ActivateMarker(infoWindowNumber)
      {
        var marker = listOfMarkers[infoWindowNumber];
        if(typeof marker ==='undefined')
          return;
        SetupWindow(marker);
      } 

/////////////////////////////////////////////////////////////////      
      function InitilizeThirdTab(){

        if(thirdTabInitlized === false)
        {
          
          socket.emit('getLatestQuestions',currentInstitution);
          thirdTabInitlized = true;
        }
      }

      function PostQuestion()
      {
       
        var text = $('textarea#new_message').val();

          var question = {
          Organization:currentInstitution,
          Comments:text,
          CommentDate:getCurrentDate()
        };

        socket.emit('postquestion',question);
      }

////////////////////////////////////////////////////////////////////
  function SetInstituation(Instituation)
  { 
    if(Instituation ===1)
    {
      if(currentInstitution !=='UofT')
      {
        currentInstitution ='UofT';
        SetTabIntilizationToFalse();
      }
    }
    if(Instituation ===2)
    {
      if(currentInstitution !=='Waterloo')
      {
        currentInstitution='Waterloo';
        SetTabIntilizationToFalse();
      }
    }
      
  }

  function SetTabIntilizationToFalse()
  {
    firstTabInitlized = false;
    secondTabInitlized = false;
    thirdTabInitlized = false;
    $("#mapDetails ul").empty();
    $("#questionDetails ul").empty();
    InitilizeFirstTab();
    InitizeSecondTab();
    InitilizeThirdTab();
  }

  function closeAllPreviousMarkers()
  {
    if(listOfMarkers.length >0)
    {
      for (var i = 0; i <listOfMarkers.length; i++) {
        listOfMarkers[i].close
      };
    }
  }


  function getCurrentDate()
  {
    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
    return currentTime;
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



      


      



      

    







      
      
      