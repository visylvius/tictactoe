var Game = {};
var FB = {};

FB.ref = new Firebase("https://cht3game.firebaseio.com/dsajfkljasdfjkadskljfloeqworuoierutoie");
FB.gameRef = FB.ref.child("game");
FB.playersRef = FB.gameRef.child("players");
FB.gridRef = FB.gameRef.child("grid");
FB.turnRef = FB.gameRef.child("turn");

$(document).ready(function() {
  var clickedCell, currentUserMark, gridUpdate = {}, isMyTurn;

  $("button#Login").on("click", function(){
    FB.ref.authWithOAuthPopup("twitter", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
    });
  });

  $(".cell").on("click", function() {
    isMyTurn = Game.isMyTurn();
    currentUserMark = Game.getCurrentUserMark();
    var cellText = $(this).text();
    if (isMyTurn && !cellText) {
      clickedCell = $(this).data("cell");
      gridUpdate = {};
      gridUpdate[clickedCell] = currentUserMark;
      FB.turnRef.set({ lastMark: currentUserMark });
      FB.gridRef.update(gridUpdate);
      var claimedCells = $(".cell." + currentUserMark);
      var $marks = claimedCells.map(function(i, c) { return $(c).data("win"); });
      var marks = $.makeArray($marks);
      console.log(marks);
      var hasWon = false;
      "h1,h2,h3,v1,v2,v3,c1,c2".split(',').forEach(function(winCondition) {
        var conditionsMet = marks.reduce(function(total, currentCondition) {
          // var counter = 0;
            if (currentCondition === winCondition) {
              return total + 1;
            }
            return total;
        }, 0);
              if(winCondition === 3) {
                hasWon = true;
                alert("you win! Don't you feel so good about yourself?");
              }
      });
    }
  });
});



Game.isMyTurn = function() {
  return (Game.lastMark || 'o') !== Game.getCurrentUserMark();
};

Game.getCurrentUserMark = function() {
  if (Game.x === Game.currentUsername) {
    return 'x';
  }
  if (Game.o === Game.currentUsername) {
    return 'o';
  }
  return null;
};

FB.playersRef.on("value", assignPlayers);
FB.gridRef.on("value", redrawGrid);
FB.turnRef.on("value", storeLastMark);

function assignPlayers(snap) {
  var players = snap.val();
  if (!players) {
    return;
  }
  Game.players = players;
  Game.x = players.x;
  Game.o = players.o;

  $("#first-player").text(Game.players.x + " - X");
  $("#second-player").text(Game.players.o + " - O");
}

function redrawGrid(snap) {
  var grid = snap.val(), mark;
  $(".cell").removeClass("x o").text("");
  for(key in grid) {
    mark = grid[key];
    $(".cell[data-cell=" + key + "]").addClass(mark).text(mark);
  }
}

function storeLastMark(snap) {
  if (snap.val()) {
    Game.lastMark = snap.val().lastMark;
  }
}

Game.nextPlayer = function() {
  if (!this.x) {
    return 'x';
  }
  if (!this.o) {
    return 'o';
  }
  return null;
};

var isNewUser = true;
FB.ref.onAuth(function(authData) {
  if (authData && isNewUser) {
    // save the user's profile into Firebase so we can list users,
    // use them in Security and Firebase Rules, and show profiles
    // ref.child("users").child(authData.uid).set({//nested children of root -- this is kind of schema setup.
    //   provider: authData.provider,
    //   name: getName(authData)
    // });
    FB.playersRef.once("value", function(snap) {
      assignPlayers(snap);
      Game.currentUsername = authData.twitter.username;
      var options = {}, nextPlayer = Game.nextPlayer();
      if (nextPlayer) {
        options[nextPlayer] = Game.currentUsername;
        FB.playersRef.update(options);
      }
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
function checkWin() {

}
