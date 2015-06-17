var myFirebaseRef = new Firebase("https://keep-stuff.firebaseio.com/");


$(document).ready(function(){

  $("button#Login").on("click", function(){
    myFirebaseRef.authWithOAuthPopup("twitter", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        $(".hidden").removeClass("hidden");
      }
    });
  });
});

var isNewUser = true;
myFirebaseRef.onAuth(function(authData) {
  if (authData && isNewUser) {
    // save the user's profile into Firebase so we can list users,
    // use them in Security and Firebase Rules, and show profiles
    myFirebaseRef.child("users").child(authData.uid).set({//nested children of root -- this is kind of schema setup.
      provider: authData.provider,
      name: getName(authData)
    });
  }
});

function getName(authData) {
  switch(authData.provider) {
     case 'password':
       return authData.password.email.replace(/@.*/, '');
     case 'twitter':
       return authData.twitter.displayName;
     case 'facebook':
       return authData.facebook.displayName;
  }
}
