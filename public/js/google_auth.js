//getting profile info (sign in)
function onSignIn(googleUser) {
   var id_token = googleUser.getAuthResponse().id_token; //Id token sent to my server

   //sent with HTTP POST request
   var xhr = new XMLHttpRequest();
   xhr.open('POST', '/login');
   xhr.setRequestHeader('Content-Type', 'application/json');
   xhr.onload = function () {
      if (xhr.responseText == 'success')
         signOut();
      location.assign('/profileG');
   };
   xhr.send(JSON.stringify({
      token: id_token
   }));

}

//singout from google account
function signOut() {
   var auth2 = gapi.auth2.getAuthInstance();
   auth2.signOut().then(function () {
      console.log('User signed out.');
   });
}
