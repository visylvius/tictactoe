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

Game.nextPlayer = function() {
  if (!this.player1) {
    return 'player1';
  }
  if (!this.player2) {
    return 'player2';
  }
  return null;
}

gameRef.on("value", function(snap) {
  var game = snap.val();
  if (!game) {
    return;
  }
  Game.players = game.players;
  Game.player1 = game.players.player1;
  Game.player2 = game.players.player2;

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
    Game.currentUsername = authData.twitter.username;
    var options = {}, nextPlayer = Game.nextPlayer();
    if (nextPlayer) {
      options[nextPlayer] = Game.currentUsername;
      gameRef.child("players").update(options);
    }
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
