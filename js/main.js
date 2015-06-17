var ref = new Firebase("https://cht3game.firebaseio.com");
var gameRef = ref.child("game");

$(document).ready(function(){
  $("button#Login").on("click", function(){
    ref.authWithOAuthPopup("twitter", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
    });
  });
});

var Game = {};

gameRef.on("value", function(snap) {
  var game = snap.val();
  Game.players = game.players;

  $("#first-player").text(Game.players.player1);
  $("#second-player").text(Game.players.player2);
});

var isNewUser = true;
ref.onAuth(function(authData) {
  if (authData && isNewUser) {
    // save the user's profile into Firebase so we can list users,
    // use them in Security and Firebase Rules, and show profiles
    // ref.child("users").child(authData.uid).set({//nested children of root -- this is kind of schema setup.
    //   provider: authData.provider,
    //   name: getName(authData)
    // });
    $(".hidden").removeClass("hidden");
    var currentUsername = authData.twitter.username;
    // if you're not a player already, and we're still accepting players (players < 2)
    // gameRef.child("players").set({ player1: currentUserName });
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
