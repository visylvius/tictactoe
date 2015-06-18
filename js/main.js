var ref = new Firebase('https://cadestest.firebaseio.com/');
var gameRef = ref.child("game");
$(document).ready(init);

function init() {
  $('#login').on('click', loginClicked);
}


<<<<<<< HEAD
function loginClicked() {
  ref.authWithOAuthPopup("twitter", authHandler);
}
=======
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
>>>>>>> 7b43106689fac4dd81c43d7e63139aa64813876c

function authHandler(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
    authData.twitter.username;
    gameRef.push(authData.twitter.username)
  }
}
gameRef.child("players").on("value", function(snap) {
  var game = snap.val();
  var players = game.players;
  $('#first-player').text(players.player1);
  $('#second-player').text(players.player2);
});


var isNewUser = true;
var ref = new Firebase("https://BANANACREAMPIE.firebaseio.com");
ref.onAuth(function(authData) {
  if (authData && isNewUser) {
    // save the user's profile into Firebase so we can list users,
    // use them in Security and Firebase Rules, and show profiles
<<<<<<< HEAD
    ref.child("users").child(authData.uid).set({
      provider: authData.provider,
      name: getName(authData)
    });
    gameRef.child("players").set({player1: authData.twitter.username});
=======
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
>>>>>>> 7b43106689fac4dd81c43d7e63139aa64813876c
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
