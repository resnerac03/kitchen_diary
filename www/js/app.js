// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var dbKitchen = null;
var obj = null;

var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova'])

app.run(function($ionicPlatform,$state,$cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    dbKitchen = window.openDatabase("sqlite","1.0","sqlitedemo",2000);
    // dbKitchen = $cordovaSQLite.openDB({name:"kitchen.db",location:"default"});
    $cordovaSQLite.execute(dbKitchen,"CREATE TABLE IF NOT EXISTS category(id integer primary key, categoryName text)");
    $cordovaSQLite.execute(dbKitchen,"CREATE TABLE IF NOT EXISTS recipe2(id integer primary key,categoryName text,recipeName text, notes text, imagePath text)");
    $cordovaSQLite.execute(dbKitchen,"CREATE TABLE IF NOT EXISTS ingredients2(id integer primary key, recipeID integer, ingredientsName text, household text, weighted text)");
    $cordovaSQLite.execute(dbKitchen,"CREATE TABLE IF NOT EXISTS procedure(id integer primary key, recipeID integer, procedureDetail text)");
    
    
 
  });
})

app.controller("appCtrl",function($scope,$state, $ionicModal,$cordovaSQLite,$ionicPlatform,$cordovaImagePicker, $cordovaSocialSharing, $cordovaInstagram){
  //====================dbfunctions
  // $scope.$on('$ionicView.loaded', function(event) {
  //   $scope.loadCategory();
  // });
  
  $ionicPlatform.ready(function(){

                // ----SHARE------ //

  // Facebook
  $scope.shareFacebook = function (message,image) {
     $cordovaSocialSharing.shareViaFacebook(message, image,null).then(function(result) {
      console.log('Share Via Facebook');
    }, function(err) {
      console.log(err);
    });
  }

  // Twitter
  $scope.shareTwitter = function (message,image) {
     $cordovaSocialSharing.shareViaTwitter(message, image,null).then(function(result) {
      console.log('Share Via Twitter');
    }, function(err) {
      console.log(err);
    });
  }
  // Instagram
  document.addEventListener("deviceready", function () { 
  // your plugin call here 



  $scope.shareInstagram = function (image,message) {
     $cordovaInstagram.share(image, message).then(function(result) {
      console.log('Share Via Instagram');
    }, function(err) {
      console.log(err);
    });
  }
  });



    $scope.imagePathtemp = null;
    $scope.addImage = function(){
      var options = {
   maximumImagesCount: 1,
   width: 200,
   height: 200,
   quality: 80
  };

  $cordovaImagePicker.getPictures(options)
    .then(function (results) {
      for (var i = 0; i < results.length; i++) {
        $scope.imagePathtemp = results[i];
      }
    }, function(error) {
      // error getting photos
    });
    }


  $scope.addCategory = function(category){
    dbKitchen.transaction(function(transaction){
      var query = "INSERT INTO category(categoryName) VALUES(?)";
      $cordovaSQLite.execute(dbKitchen,query,[$("#categoryInputName").val()]);
      $("#categoryInputName").val("");
      $scope.modal.hide();
      $scope.loadCategory();
    })
    
  }

  $scope.loadCategory = function(){
     dbKitchen.transaction(function(transaction){
    $scope.categoryData = [];
    $cordovaSQLite.execute(dbKitchen,"SELECT * from category").then(function(result){

      if(result.rows.length){

        for(var i=0;i<result.rows.length;i++){
          $scope.categoryData.push(result.rows.item(i));

        }
      }else{
        console.log("No data found!");
      }
    },function(error){
      console.log("Error: "+error);
    }
    )
  });
  };

    $scope.loadRecipe = function(){
      dbKitchen.transaction(function(transaction){
        $scope.orderName = null;
    $scope.recipeData = [];
    $cordovaSQLite.execute(dbKitchen,"SELECT * from recipe2").then(function(result){

      if(result.rows.length){

        for(var i=0;i<result.rows.length;i++){
          $scope.recipeData.push(result.rows.item(i));

        }
      }else{
        console.log("No data found!");
      }
    },function(error){
      console.log("Error: "+error);
    }
    )
  });
  }

  $scope.sortbyName = function(){
    $scope.orderName = "recipeName";
  }

   $scope.sortbyName1 = function(){
    $scope.orderName = "categoryName";
  }

  

    $scope.deleteCategory = function(catID){
      dbKitchen.transaction(function(transaction){
      var query = "DELETE FROM category WHERE id = ?";
      $cordovaSQLite.execute(dbKitchen,query,[catID]).then(function(success){
        $scope.loadCategory();
      });
      //chats.splice(chats.indexOf(catID), 1);
      });
    }

    $scope.deleteRecipe = function(recID){
      dbKitchen.transaction(function(transaction){
      var query = "DELETE FROM recipe2 WHERE id = ?";
      $cordovaSQLite.execute(dbKitchen,query,[recID]).then(function(success){
        $scope.loadRecipe();
      });
      //chats.splice(chats.indexOf(catID), 1);
      });
    }

    $scope.loadCategory();
    $scope.loadRecipe();



    // ============================= UI functions =======================================


  $scope.addRecipe = function(){
    $state.go('tab.addRecipeForm',{redirect: true})
  }
  // Load the modal from the given template URL
  $ionicModal.fromTemplateUrl('templates/modal_category.html', function(modal) {
    $scope.modal = modal;
  }, {
    // Use our scope for the scope of the modal to keep it simple
    scope: $scope,
    // The animation we want to use for the modal entrance
    animation: 'slide-in-up'
  });
  $scope.openModal = function() {
    // alert("in modal");
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  //Be sure to cleanup the modal
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });  
  
  });  

//======================== Add/Remove Field Ingredient
$scope.fields = [{id:'1'}];
$scope.addFields = function(){
  var newItemNo = $scope.fields.length+1;
  $scope.fields.push({'id':newItemNo});
}

$scope.removeFields = function() {
    var lastItem = $scope.fields.length-1;
    $scope.fields.splice(lastItem);
  };

//======================= Add/Remove Field Procedure
$scope.procFields = [{id:'1'}];
$scope.addProcFields = function(){
  var newItemNo =  $scope.procFields.length+1;
  $scope.procFields.push({'id':newItemNo});
}
$scope.removeProcFields = function(){
  var lastItem = $scope.procFields.length-1;
  $scope.procFields.splice(lastItem);
} 

//===================================== Finish Recipe Saved! =============================
$scope.saveRecipe = function(){
  dbKitchen.transaction(function(transaction){
    var currentID = null;
    var query = "INSERT INTO recipe2(categoryName,recipeName,notes,imagePath) VALUES(?,?,?,?)";
    $cordovaSQLite.execute(dbKitchen,query,[$("#rCategoryInput").val(),$("#rNameInput").val(),$("#notes").val(),$scope.imagePathtemp])
    .then(function(success){
      $cordovaSQLite.execute(dbKitchen,"Select * from recipe2").then(function(result){
        if(result.rows.length){
          currentID = result.rows.length;
          for(var i=0; i<$scope.fields.length; i++){
            var queryIngredients = "INSERT INTO ingredients2(recipeID,ingredientsName,household,weighted) VALUES(?,?,?,?)";
            $cordovaSQLite.execute(dbKitchen,queryIngredients,[currentID,$scope.fields[i].name,$scope.fields[i].houseHold,$scope.fields[i].weighted])
          }

          for(var i= 0;i<$scope.procFields.length; i++){
            var queryProcedure = "INSERT INTO procedure(recipeID,procedureDetail) VALUES(?,?)"
            $cordovaSQLite.execute(dbKitchen,queryProcedure,[currentID,$scope.procFields[i].name]);
          }

        }
        else{
          console.log(error);
        }
      })
    })
    .then(function(success){
      $scope.loadRecipe();
      $state.go('tab.chats',{redirect: true})
    })
    ;
    });
}

//=======================Edit Recipe functions=================


})



.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'ChatsCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:recipeName',
      views: {
        'tab-chats': {
          templateUrl: 'templates/recipeView.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

    .state('tab.chat-detail2', {
      url: '/dash/viewRecipe/:recipeName',
      views: {
        'tab-dash': {
          templateUrl: 'templates/recipeViewCategory.html',
          controller: 'viewRecipeCategoryCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('tab.addRecipeForm',{
    url: '/chats/addRecipeForm',
    views:{
      'tab-chats':{
        templateUrl: 'templates/addRecipeForm.html',
      }
    }
  })

  .state('tab.loadRecipeInCategory',{
    url: '/dash/:categoryName',
    views:{
      'tab-dash':{
        templateUrl: 'templates/loadRecipeInCategory.html',
        controller: 'CategoryRecipeCtrl'
      }
    }
  })

  .state('tab.editRecipe',{
    url: '/chats/:obj',
    views:{
      'tab-chats':{
        templateUrl: 'templates/editRecipe.html',
        controller: 'EditRecipeCtrl'
      }
    }
  })

  .state('tab.editRecipeCategory',{
    url: '/dash/:obj',
    views:{
      'tab-dash':{
        templateUrl: 'templates/editRecipeCategory.html',
        controller: 'editRecipeCategoryCtrl'
      }
    }
  })
  // .state('tab.recipeView',{
  //   url: '/chat/:recipeid',
  //   views:{
  //     'tab-chats':{
  //       templateUrl: 'templates/recipeView.html',
  //       controller: 'RecipeViewCtrl'
  //     }
  //   }
  // })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/chats');

});
