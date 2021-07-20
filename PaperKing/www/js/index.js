angular.module("paperking", [
  "ngMaterial",
  "ngSanitize",
  "ngLocale",
  "LocalStorageModule",
  "ui.router",
  "angular.filter",
]);

var app = {
  // Application Constructor
  initialize: function () {
    document.addEventListener(
      "deviceready",
      this.onDeviceReady.bind(this),
      false
    );
    document.addEventListener("pause", this.onDevicePaused.bind(this), false);
    document.addEventListener("resume", this.onDeviceResumed.bind(this), false);
    document.addEventListener(
      "menubutton",
      this.onMenuKeyDown.bind(this),
      false
    );
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function () {
    console.log("ready");

    angular
      .module("paperking")
      .config(function (
        localStorageServiceProvider,
        $stateProvider,
        $urlRouterProvider,
        $mdDateLocaleProvider,
        $mdThemingProvider
      ) {
        localStorageServiceProvider
          .setPrefix("paperking")
          .setNotify(true, true);

        $mdThemingProvider.theme("altTheme").primaryPalette("blue-grey");
        $mdThemingProvider.setDefaultTheme("altTheme");
        // $mdDateLocaleProvider.formatDate = function(date) {
        //     return moment(date).format('DD-MM-YYYY');
        //  };
        // Example uses moment.js to parse and format dates.
        $mdDateLocaleProvider.parseDate = function (dateString) {
          var m = moment(dateString, "L", true);
          return m.isValid() ? m.toDate() : new Date(NaN);
        };

        $mdDateLocaleProvider.formatDate = function (date) {
          if (date == null) return "";
          var m = moment(date);
          return m.isValid() ? m.format("L") : "";
        };

        $urlRouterProvider.otherwise("/Home");
        // Now set up the states
        if (localStorage.getItem("paperking.User") != null) {
          firebase
            .database()
            .ref("Users")
            .orderByChild("Uid")
            .equalTo(JSON.parse(localStorage.getItem("paperking.User")).uid)
            .once("value")
            .then(function (snapshot) {
              snapshot.forEach((element) => {
                firebase
                  .database()
                  .ref("Users")
                  .child(element.key)
                  .update({ Status: 1 });
              });
            });
        }
        $stateProvider.state("Home", {
          url: "/Home",
          templateUrl: "Templates/Home.html",
        });
        // .state("Profile", {
        //   url: "/Profile",
        //   templateUrl: "Templates/Profile.html",
        //   controller: "ProfileController",
        // })
        // .state("Register", {
        //   url: "/Register",
        //   templateUrl: "Templates/Register.html",
        //   controller: "RegisterController",
        // })
        // .state("WordPool", {
        //   url: "/WordPool",
        //   templateUrl: "Templates/WordPool.html",
        //   controller: "WordPoolController",
        // })
        // .state("Game", {
        //   url: "/Game",
        //   templateUrl: "Templates/Game.html",
        //   controller: "GameController",
        // })
        // .state("LeaderBoard", {
        //   url: "/LeaderBoard",
        //   templateUrl: "Templates/LeaderBoard.html",
        //   controller: "LeaderBoardController",
        // })
        // .state("FavoriteWords", {
        //   url: "/FavoriteWords",
        //   templateUrl: "Templates/FavoriteWords.html",
        //   controller: "FavoriteWordsController",
        // })
        // .state("Settings", {
        //   url: "/Settings",
        //   templateUrl: "Templates/Settings.html",
        //   controller: "SettingsController",
        // })
        // .state("StartedGames", {
        //   url: "/StartedGames",
        //   templateUrl: "Templates/StartedGames.html",
        //   controller: "StartedGamesController",
        // })
        // .state("Invites", {
        //   url: "/Invites",
        //   templateUrl: "Templates/Invites.html",
        //   controller: "InvitesController",
        // })
        // .state("Definitions", {
        //   url: "/Definitions",
        //   templateUrl: "Templates/Definitions.html",
        //   controller: "DefinitionsController",
        // })
        // .state("Analysis", {
        //   url: "/Analysis",
        //   templateUrl: "Templates/Analysis.html",
        //   controller: "AnalysisController",
        //   params: {
        //     coctails: "",
        //     vitamins: "",
        //   },
        // });
      });
    console.clear();
    setTimeout(() => {
      console.clear();
      angular.bootstrap(document.body, ["paperking"]);
    }, 1000);
  },
  onDevicePaused: function () {
    console.log("paused");
    if (false && localStorage.getItem("paperking.User") != null) {
      firebase
        .database()
        .ref("Users")
        .orderByChild("Uid")
        .equalTo(JSON.parse(localStorage.getItem("paperking.User")).uid)
        .once("value")
        .then(function (snapshot) {
          snapshot.forEach((element) => {
            firebase
              .database()
              .ref("Users")
              .child(element.key)
              .update({ Status: 0 });
          });
        });
    }
  },
  onDeviceResumed: function () {
    return;
    if (localStorage.getItem("paperking.User") != null) {
      firebase
        .database()
        .ref("Users")
        .orderByChild("Uid")
        .equalTo(JSON.parse(localStorage.getItem("paperking.User")).uid)
        .once("value")
        .then(function (snapshot) {
          snapshot.forEach((element) => {
            firebase
              .database()
              .ref("Users")
              .child(element.key)
              .update({ Status: 1 });
          });
        });
    }
  },
  onMenuKeyDown: function () {
    return;
    if (localStorage.getItem("paperking.User") != null) {
      firebase
        .database()
        .ref("Users")
        .orderByChild("Uid")
        .equalTo(JSON.parse(localStorage.getItem("paperking.User")).uid)
        .once("value")
        .then(function (snapshot) {
          snapshot.forEach((element) => {
            firebase
              .database()
              .ref("Users")
              .child(element.key)
              .update({ Status: 0 });
          });
        });
    }
  },
};

app.initialize();
