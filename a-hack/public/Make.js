      var map;
      var socket =io.connect('http://localhost/');
      InitlizeSockets();
      InitlizeMaps();
      
      function InitlizeMaps()
      {
        console.log('should work');
        var mapOptions = {
            center: new google.maps.LatLng(43.6617, -79.3951),
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP  
            };
            var blah = document.getElementById("map_canvas");
            map = new google.maps.Map(blah,
            mapOptions);

        var request = {
        location: pyrmont,
        radius: '500',
        types: ['store']
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
      }

      function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            var place = results[i];
            createMarker(results[i]);
          }
        }
      }

      function InitlizeSockets()
      {
         socket.on('confirmRequest',function(error){

         });
      }

      function SendCreateRequest()
      {
        var newInstitutionItem = {ab:'cd'};
        socket.emit('makePost',newInstitutionItem);
      }
    



      


      



      

    







      
      
      