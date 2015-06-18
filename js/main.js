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
  if (!game) {
    return;
  }
  Game.players = game.players;
  Game.x = game.players.x;
  Game.o = game.players.o;

  $("#first-player").text(Game.players.x + " - X");
  $("#second-player").text(Game.players.o + " - O");

  Game.nextPlayer = function() {
    if (!this.x) {
      return 'x';
    }
    if (!this.o) {
      return 'o';
    }
    return null;
  }

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
      Game.currentUsername = authData.twitter.username;
      var options = {}, nextPlayer = Game.nextPlayer();
      if (nextPlayer) {
        options[nextPlayer] = Game.currentUsername;
        gameRef.child("players").update(options);
      }
    }
  });
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
