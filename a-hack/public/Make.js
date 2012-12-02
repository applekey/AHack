
      var socket =io.connect('http://localhost/');
      InitlizeSockets();

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
    



      


      



      

    







      
      
      