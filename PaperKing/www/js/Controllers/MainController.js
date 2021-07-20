angular
  .module("paperking")
  .controller(
    "MainController",
    function (
      $scope,
      $q,
      $mdSidenav,
      $mdDialog,
      $state,
      localStorageService,
      $log,
      $timeout,
      $transitions
    ) {
      $scope.Hello = "Hello";
      /*
  SideNav 
  */
      $scope.toggleLeft = buildToggler("left");
      $scope.toggleRight = buildToggler("right");
      $scope.isOpenRight = function () {
        return $mdSidenav("right").isOpen();
      };
      function buildToggler(navID) {
        return function () {
          // Component lookup should always be available since we are not using `ng-if`
          $mdSidenav(navID)
            .toggle()
            .then(function () {
              $log.debug("toggle " + navID + " is done");
            });
        };
      }
      $scope.close = function () {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav("right")
          .close()
          .then(function () {
            //$log.debug("close RIGHT is done");
          });
      };
      /*
   SideNavEnd 
   */
      $scope.state = $state;
      //   $scope.fib = firebase;
      //   $scope.fib.db = firebase.database();
      $scope.los = localStorageService;

      $scope.Logout = function () {
        $scope.fib
          .auth()
          .signOut()
          .then(
            function () {
              console.log("Signed Out");
              // $scope.los.set("User", null);
              localStorage.clear();
              $scope.$apply();
            },
            function (error) {
              console.error("Sign Out Error", error);
            }
          );
        $state.go("Home");
      };

      //   $scope.fib.db
      //     .ref("Users")
      //     .orderByChild("Status")
      //     .equalTo(1)
      //     .on("value", function (snapshot) {
      //       $scope.los.set("OnlineCount", snapshot.numChildren());
      //       setTimeout(() => {
      //         $scope.$apply();
      //       }, 100);
      //     });

      $scope.onSwipeLeft = function (ev, target) {
        console.log(ev);
        console.log(target);
      };

      // $.getJSON("http://localhost:3000/browser/www/scripts/bolumler.json", function (json) {
      //     $scope.Departments = json; // this will show the info it in firebug console
      // });

      //   const itemsRef = $scope.fib.db.ref("Items");
      //   itemsRef.on("value", function (snapshot) {
      //     $scope.Items = [];
      //     snapshot.forEach((element) => {
      //       $scope.Items.push(element.val());
      //     });
      //     setTimeout(() => {
      //       $scope.$apply();
      //     }, 100);
      //   });

      $scope.PleaseLogin = function (ev) {
        console.log(ev);
        $mdDialog.show(
          $mdDialog
            .alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .title("LÃ¼tfen GiriÅŸ YapÄ±nÄ±z.")
            .textContent(
              "ÃœzgÃ¼nÃ¼z ancak hesabÄ±nÄ±zla giriÅŸ yapmanÄ±z gerekli."
            )
            .ariaLabel("Alert Dialog Demo")
            .ok("OK")
            .targetEvent(ev)
        );
      };

      $transitions.onSuccess({}, function (transition) {
        console.log(
          "Successful Transition from " +
            transition.from().name +
            " to " +
            transition.to().name
        );

        if (transition.to().name == "Home" && $scope.los.get("User") != null) {
        }

        if (transition.from().name == "" && transition.to().name == "Home") {
          $scope.showAdvanced = function (ev) {
            $mdDialog
              .show({
                controller: function ($scope, $mdDialog) {
                  $scope.hide = function () {
                    $mdDialog.hide();
                  };
                },
                templateUrl: "./Templates/WelcomeDialog.tmpl.html",
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application to prevent interaction outside of dialog
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
              })
              .then(
                function (answer) {
                  $scope.status =
                    'You said the information was "' + answer + '".';
                },
                function () {
                  $scope.status = "You cancelled the dialog.";
                }
              );
          };
          // $scope.showAdvanced();
        }
      });

      $scope.Remove = function (item) {
        console.log(item);
        $scope.fib.db
          .ref("Items")
          .orderByChild("Created")
          .equalTo(item.Created)
          .once("value")
          .then((result) => {
            result.forEach((val) => {
              $scope.fib.db
                .ref("Items")
                .child(val.key)
                .set(null)
                .then((done) => {
                  console.log("deleted");
                });
            });
          });
      };

      $scope.ShowResults = function () {
        $scope.app.loading = true;
        setTimeout(() => {
          var selectedItems = [];
          $scope.Items.forEach((item) => {
            if (item.Selected) {
              console.log(item);
              selectedItems.push(item);
            }
          });
          if ($scope.app.VitaminFirst == "true") {
            $scope.app.loading = false;
            $scope.state.go("Analysis", {
              vitamins: JSON.stringify(selectedItems),
            });
          } else if ($scope.app.VitaminFirst == "false") {
            $scope.app.loading = false;
            $scope.state.go("Analysis", {
              coctails: JSON.stringify(selectedItems),
            });
          }
        }, 5000);
      };

      $scope.TotalSquareCount = (window.innerHeight * window.innerWidth) / 400;
      var playersCount = 3;
      var Teams = [
        { Name: "A", Id: 1, Color: "#eee", Count: 0 },
        { Name: "B", Id: 2, Color: "#ff0000", Count: 0 },
        { Name: "C", Id: 3, Color: "#5522ff", Count: 0 },
      ];
      $scope.Game = { PlayersCount: playersCount, Teams: Teams };
      $scope.Game.Squares = [];
      //total width (640)/ one piece width of the square 20X20
      var columns = window.innerWidth / 20;
      var rows = window.innerHeight / 20;
      rows = rows - 2;

      $scope.logPosition = function (item) {
        console.log(item.Position.x, item.Position.y);

        var isAttackPointValid = false;
        var positionXplus1 = $scope.Game.Squares.find((x) => {
          return (
            x.Position.X == item.Position.X + 1 &&
            x.Position.Y == item.Position.Y
          );
        });
        var positionXminus1 = $scope.Game.Squares.find((x) => {
          return (
            x.Position.X == item.Position.X - 1 &&
            x.Position.Y == item.Position.Y
          );
        });

        var positionYplus1 = $scope.Game.Squares.find((x) => {
          return (
            x.Position.X == item.Position.X &&
            x.Position.Y == item.Position.Y + 1
          );
        });
        var positionYminus1 = $scope.Game.Squares.find((x) => {
          return (
            x.Position.X == item.Position.X &&
            x.Position.Y == item.Position.Y - 1
          );
        });
        if (
          $scope.Game.Teams[$scope.Game.Turn].Name ==
            positionXminus1.Owner.Name ||
          $scope.Game.Teams[$scope.Game.Turn].Name ==
            positionYminus1.Owner.Name ||
          $scope.Game.Teams[$scope.Game.Turn].Name ==
            positionXplus1.Owner.Name ||
          $scope.Game.Teams[$scope.Game.Turn].Name == positionYplus1.Owner.Name
        ) {
          console.log("Position is Valid");
          if ($scope.Game.AttackPositions == null) {
            $scope.Game.AttackPositions = [];
          }
          $scope.Game.AttackPositions.push(item);
          var positionSelected = $scope.Game.Squares.find((x) => {
            return (
              x.Position.X == item.Position.X && x.Position.Y == item.Position.Y
            );
          });
          positionSelected.isAttackPoint = true;
        } else {
          console.log("Position is NOT Valid...");
        }
        console.log(item);
        if (
          $scope.Game.Turn ==
          $scope.Game.Teams.findIndex((x) => {
            return x.Name == item.Owner.Name;
          })
        ) {
          console.log(1);
        }
        console.log($scope.Game);
      };

      $scope.initGame = function () {
        // var AllSquaresOwned = false;
        $scope.Game.Squares = [];
        console.log(rows, "rows");
        console.log(columns, "columns");
        for (let indexX = 1; indexX <= rows; indexX++) {
          for (let indexY = 1; indexY <= columns; indexY++) {
            var teamIndex = Math.floor(Math.random() * 3);
            var owner = Teams[teamIndex];
            $scope.Game.Teams[teamIndex].Count += 1;
            $scope.Game.Squares.push({
              Id: indexX * indexY,
              Position: { X: indexY, Y: indexX },
              Owner: owner,
            });
          }
        }
        var turn = Math.floor(Math.random() * 3);
        $scope.Game.Turn = turn;

        console.log($scope.Game);
        console.log(22);
      };

      $scope.initGame();

      //   setInterval(() => {
      //     $scope.initGame();
      //     $scope.$apply();
      //   }, 1000);
    }
  );
