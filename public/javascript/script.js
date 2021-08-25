$(document).ready(function(){
   $('.ui.accordion').accordion();

   function sendWebhook(orderId) {
      const url = '/orders/post/webhook'
      const target = document.getElementById(orderId).value
   
      if (target.length > 0) {
         (async () => {
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({id: orderId, target: target})
            });
            const content = await response.json();
          
            console.log(content);
            if (response.status == 200) {
               alert("Success")
            } else {
               alert("Failed")
            }
         })();
   
      } else {
         alert("URL field cannot be empty.")
      }
   }
});