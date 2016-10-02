angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('viewRecipeCategoryCtrl', function($state,$scope, $stateParams, Chats, $cordovaSQLite) {
  var dbKitchen1 = window.openDatabase("sqlite","1.0","sqlitedemo",2000);
   // dbKitchen = $cordovaSQLite.openDB({name:"kitchen.db",location:"default"});
  $cordovaSQLite.execute(dbKitchen1,"CREATE TABLE IF NOT EXISTS recipe2(id integer primary key,categoryName text,recipeName text,notes text,imagePath text)");
  $cordovaSQLite.execute(dbKitchen1,"CREATE TABLE IF NOT EXISTS category(id integer primary key, categoryName text)");
  $cordovaSQLite.execute(dbKitchen1,"CREATE TABLE IF NOT EXISTS ingredients2(id integer primary key, recipeID integer, ingredientsName text, household text, weighted text)");
  $cordovaSQLite.execute(dbKitchen1,"CREATE TABLE IF NOT EXISTS procedure(id integer primary key, recipeID integer, procedureDetail text)");

  $scope.recipeNameView = $stateParams.recipeName;
  $scope.recID = null;
  $scope.recipeDetail = [];
  $scope.recipeIngredient = [];
  $scope.recipeProcedure = [];

  

  $scope.getRecipeDetails = function(){
    dbKitchen1.transaction(function(transaction){
    var queryViewRecipe = "select * from recipe2 where recipeName = ?";
    $cordovaSQLite.execute(dbKitchen1,queryViewRecipe,[$scope.recipeNameView]).then(function(result){
      if(result.rows.length){
          for(var i=0;i<result.rows.length;i++){
            $scope.recipeDetail.push(result.rows.item(i));
          }
      }else{
          console.log("No data found!");
      }
    }, function(error){
        console.log("Error: "+error);
      }
    )

    .then(function(){
      $scope.recID = $scope.recipeDetail[0].id;
      $scope.categoryName = $scope.recipeDetail[0].categoryName;
      $scope.getrecipeIngredients($scope.recipeDetail[0].id);
      $scope.getrecipeProcedure($scope.recipeDetail[0].id);
      $scope.editRecipe = function(){
        obj = $scope.recID;
        $state.go('tab.editRecipeCategory',{obj})
      }
    })
    ;
  });
  }

  $scope.getrecipeIngredients = function(recipeID){
    dbKitchen1.transaction(function(transaction){
    var queryIngredientRecipe = "select * from ingredients2 where recipeID = ?";
    $cordovaSQLite.execute(dbKitchen1,queryIngredientRecipe,[recipeID]).then(function(result){
      if(result.rows.length){
          for(var i=0;i<result.rows.length;i++){
            $scope.recipeIngredient.push(result.rows.item(i));
          }
      }else{
          console.log("No data found!");
      }
    }, function(error){
        console.log("Error: "+error);
      }
    );
  });
  }

  $scope.removeFields = function(removedID,deleteIdForDb) {
    alert(deleteIdForDb);
    $scope.recipeIngredient.splice(removedID-1,1);
    $cordovaSQLite.execute(dbKitchen1,"DELETE FROM ingredients2 where id = ?",[deleteIdForDb]);
  }
  $scope.removeProcFields = function(removedID,deleteIdForDb){
    $scope.recipeProcedure.splice(removedID-1,1);
    $cordovaSQLite.execute(dbKitchen1,"DELETE FROM procedure where id = ?",[deleteIdForDb]);
  }


  $scope.getrecipeProcedure = function(recipeID){
    dbKitchen1.transaction(function(transaction){
    var queryProcedureRecipe = "select * from procedure where recipeID = ?";
    $cordovaSQLite.execute(dbKitchen1,queryProcedureRecipe,[recipeID]).then(function(result){
      if(result.rows.length){
          for(var i=0;i<result.rows.length;i++){
            $scope.recipeProcedure.push(result.rows.item(i));
          }
      }else{
          console.log("No data found!");
      }
    }, function(error){
        console.log("Error: "+error);
      }
    );
  });
  }
    
  $scope.getRecipeDetails();
    

})

.controller('ChatDetailCtrl', function($state,$scope, $stateParams, Chats, $cordovaSQLite) {
  var dbKitchen1 = window.openDatabase("sqlite","1.0","sqlitedemo",2000);
   // dbKitchen = $cordovaSQLite.openDB({name:"kitchen.db",location:"default"});
  $cordovaSQLite.execute(dbKitchen1,"CREATE TABLE IF NOT EXISTS recipe2(id integer primary key,categoryName text,recipeName text,notes text, imagePath text)");
  $cordovaSQLite.execute(dbKitchen1,"CREATE TABLE IF NOT EXISTS category(id integer primary key, categoryName text)");
  $cordovaSQLite.execute(dbKitchen1,"CREATE TABLE IF NOT EXISTS ingredients2(id integer primary key, recipeID integer, ingredientsName text, household text, weighted text)");
  $cordovaSQLite.execute(dbKitchen1,"CREATE TABLE IF NOT EXISTS procedure(id integer primary key, recipeID integer, procedureDetail text)");

  $scope.recipeNameView = $stateParams.recipeName;
  $scope.recID = null;
  $scope.recipeDetail = [];
  $scope.recipeIngredient = [];
  $scope.recipeProcedure = [];

  

  $scope.getRecipeDetails = function(){
    dbKitchen1.transaction(function(transaction){
    var queryViewRecipe = "select * from recipe2 where recipeName = ?";
    $cordovaSQLite.execute(dbKitchen1,queryViewRecipe,[$scope.recipeNameView]).then(function(result){
      if(result.rows.length){
          for(var i=0;i<result.rows.length;i++){
            $scope.recipeDetail.push(result.rows.item(i));
          }
      }else{
          console.log("No data found!");
      }
    }, function(error){
        console.log("Error: "+error);
      }
    )

    .then(function(){
      $scope.recID = $scope.recipeDetail[0].id;
      $scope.categoryName = $scope.recipeDetail[0].categoryName;
      $scope.getrecipeIngredients($scope.recipeDetail[0].id);
      $scope.getrecipeProcedure($scope.recipeDetail[0].id);
      $scope.editRecipe = function(){
        obj = $scope.recID;
        $state.go('tab.editRecipe',{obj})
      }
    })
    ;
  });
  }

  $scope.getrecipeIngredients = function(recipeID){
    dbKitchen1.transaction(function(transaction){
    var queryIngredientRecipe = "select * from ingredients2 where recipeID = ?";
    $cordovaSQLite.execute(dbKitchen1,queryIngredientRecipe,[recipeID]).then(function(result){
      if(result.rows.length){
          for(var i=0;i<result.rows.length;i++){
            $scope.recipeIngredient.push(result.rows.item(i));
          }
      }else{
          console.log("No data found!");
      }
    }, function(error){
        console.log("Error: "+error);
      }
    );
  });
  }

  $scope.removeFields = function(removedID,deleteIdForDb) {
    alert(deleteIdForDb)
    $scope.recipeIngredient.splice(removedID,1);
    $cordovaSQLite.execute(dbKitchen1,"DELETE FROM ingredients2 where id = ?",[deleteIdForDb]);
  }
  $scope.removeProcFields = function(removedID,deleteIdForDb){
    $scope.recipeProcedure.splice(removedID,1);
    $cordovaSQLite.execute(dbKitchen1,"DELETE FROM procedure where id = ?",[deleteIdForDb]);
  }


  $scope.getrecipeProcedure = function(recipeID){
    dbKitchen1.transaction(function(transaction){
    var queryProcedureRecipe = "select * from procedure where recipeID = ?";
    $cordovaSQLite.execute(dbKitchen1,queryProcedureRecipe,[recipeID]).then(function(result){
      if(result.rows.length){
          for(var i=0;i<result.rows.length;i++){
            $scope.recipeProcedure.push(result.rows.item(i));
          }
      }else{
          console.log("No data found!");
      }
    }, function(error){
        console.log("Error: "+error);
      }
    );
  });
  }
    
  $scope.getRecipeDetails();
    

})

.controller('CategoryRecipeCtrl', function($ionicModal,$state,$scope,$stateParams,$ionicPlatform,$cordovaSQLite){
  $ionicPlatform.ready(function(){
    var dbKitchen1 = window.openDatabase("sqlite","1.0","sqlitedemo",2000);
    // $scope.category = Recipe.get($stateParams.categoryId);
    dbKitchen1.transaction(function(transaction){
   
   // dbKitchen = $cordovaSQLite.openDB({name:"kitchen.db",location:"default"});
   $cordovaSQLite.execute(dbKitchen1,"CREATE TABLE IF NOT EXISTS recipe2(id integer primary key,categoryName text,recipeName text,notes text, imagePath text)");
   $scope.cats = $stateParams.categoryName;
   $scope.recipeInCategory = [];
 });
   $scope.addRecipewithCategory = function(){
     dbKitchen1.transaction(function(transaction){
    var InsertQuery = "INSERT INTO recipe2(categoryName,recipeName,notes) VALUES(?,?,?)";
    $cordovaSQLite.execute(dbKitchen1,InsertQuery,["Sweets","Ice Cream","Palamagin hanggang sa lumamig"]);
  });
   }
   
    dbKitchen1.transaction(function(transaction){
   var query = "SELECT * FROM recipe2 WHERE categoryName = ?";
   $cordovaSQLite.execute(dbKitchen1,query,[$stateParams.categoryName]).then(function(result){
      if(result.rows.length){
        for(var i=0; i<result.rows.length; i++){
          $scope.recipeInCategory.push(result.rows.item(i))
        }
      }else{
        console.log("No data found!");
      }
   },function(error){
      console.log("Error: "+error);
    });
 });
   var passCatName = $("#categoryNameHidden").val();
   $ionicModal.fromTemplateUrl('templates/modal_editCategory.html', function(modal) {
    $scope.modal = modal;
    }, {
      // Use our scope for the scope of the modal to keep it simple
      scope: $scope,
      // The animation we want to use for the modal entrance
      animation: 'slide-in-up'
    });
    dbKitchen1.transaction(function(transaction){
   $scope.selectedcategoryid = null;
   var queryCategory = "Select * from category where categoryName = ?";
   $cordovaSQLite.execute(dbKitchen1,queryCategory,[$stateParams.categoryName]).then(function(result){
    if(result.rows.length){
      for(i=0;i<result.rows.length;i++){
        $scope.selectedcategoryid = result.rows.item(i).id;
      }
    }
   })
 });
    $scope.openModal = function(name) {
      $scope.selectedName = name;
      $scope.selectedID = $scope.selectedcategoryid;
      // alert("in modal");
      $scope.modal.show();
      
      // $scope.passtoEdit = passCatName;
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    //Be sure to cleanup the modal
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });  

    $scope.editCategory = function(){
       dbKitchen1.transaction(function(transaction){
      var EditCategoryQuery = "UPDATE category SET categoryName = ? WHERE id = "+$scope.selectedID;
      $cordovaSQLite.execute(dbKitchen1,EditCategoryQuery,[$("#categoryInputEditName").val()]).then(function(result){
        $state.go('tab.dash',{redirect: true});
      });
    });
    }
    //
  });
})
.controller('RecipeViewCtrl',function($stateParams,$scope$,cordovaSQLite,$ionicPlatform){
  // alert();
  // $ionicPlatform.ready(function(){
  //   $scope.recipeNameView = $stateParams.recipeid;
  //   alert($scope.recipeNameView);
  // });
})


.controller('editRecipeCategoryCtrl', function($scope,$stateParams,$cordovaSQLite,$ionicPlatform,$state){
  $ionicPlatform.ready(function(){
  var editRecipeId = $stateParams.obj;

  var dbKitchen1 = window.openDatabase("sqlite","1.0","sqlitedemo",2000);
   // dbKitchen1 = $cordovaSQLite.openDB({name:"kitchen.db",location:"default"});
  $cordovaSQLite.execute(dbKitchen1,"CREATE TABLE IF NOT EXISTS recipe2(id integer primary key,categoryName text,recipeName text,notes text, imagePath text)");
  $cordovaSQLite.execute(dbKitchen1,"CREATE TABLE IF NOT EXISTS category(id integer primary key, categoryName text)");
  $cordovaSQLite.execute(dbKitchen1,"CREATE TABLE IF NOT EXISTS ingredients2(id integer primary key, recipeID integer, ingredientsName text, household text, weighted text)");
  $cordovaSQLite.execute(dbKitchen1,"CREATE TABLE IF NOT EXISTS procedure(id integer primary key, recipeID integer, procedureDetail text)");

  $scope.recipeDetail = [];
  $scope.recipeIngredient = [];
  $scope.recipeProcedure = [];
  var recipeName = null;

  $scope.getRecipeDetails = function(){
     dbKitchen1.transaction(function(transaction){
    var queryViewRecipe = "select * from recipe2 where id = ?";
    $cordovaSQLite.execute(dbKitchen1,queryViewRecipe,[editRecipeId]).then(function(result){
      if(result.rows.length){
          for(var i=0;i<result.rows.length;i++){
            $scope.recipeDetail.push(result.rows.item(i));
          }
      }else{
          console.log("No data found!");
      }
    }, function(error){
        console.log("Error: "+error);
      }
    )

    .then(function(){
      $scope.editCategoryName = $scope.recipeDetail[0].categoryName;
      $scope.editRecipeName = $scope.recipeDetail[0].recipeName;
      $scope.editNote = $scope.recipeDetail[0].notes;

      recipeName = $scope.recipeDetail[0].recipeName;

      $scope.getrecipeIngredients($scope.recipeDetail[0].id);
      $scope.getrecipeProcedure($scope.recipeDetail[0].id);
      
    })
    ;
  });
  }

  $scope.getrecipeIngredients = function(recipeID){
     dbKitchen1.transaction(function(transaction){
    var queryIngredientRecipe = "select * from ingredients2 where recipeID = ?";
    $cordovaSQLite.execute(dbKitchen1,queryIngredientRecipe,[editRecipeId]).then(function(result){
      if(result.rows.length){
          for(var i=0;i<result.rows.length;i++){
            $scope.recipeIngredient.push(result.rows.item(i));
          }
      }else{
          console.log("No data found!");
      }
    }, function(error){
        console.log("Error: "+error);
      }
    );
  });
  }

  $scope.getrecipeProcedure = function(recipeID){
     dbKitchen1.transaction(function(transaction){
    var queryProcedureRecipe = "select * from procedure where recipeID = ?";
    $cordovaSQLite.execute(dbKitchen1,queryProcedureRecipe,[editRecipeId]).then(function(result){
      if(result.rows.length){
          for(var i=0;i<result.rows.length;i++){
            $scope.recipeProcedure.push(result.rows.item(i));
          }
      }else{
          console.log("No data found!");
      }
    }, function(error){
        console.log("Error: "+error);
      }
    );
  });
  }

  $scope.getRecipeDetails();
  
  

$scope.addFields = function(){
   dbKitchen1.transaction(function(transaction){
  $cordovaSQLite.execute(dbKitchen1,"Select * from ingredients2").then(function(result){
      $scope.recipeIngredient.push({'id':result.rows.length+1});
    });
});
}


  //======================= Add/Remove Field Procedure

$scope.addProcFields = function(){
   dbKitchen1.transaction(function(transaction){
  $cordovaSQLite.execute(dbKitchen1,"Select * from procedure").then(function(result){
      $scope.recipeProcedure.push({'id':result.rows.length+1});
    });
});
}


$scope.saveEditRecipe = function(){
   dbKitchen1.transaction(function(transaction){
  var currentID = null;
    var query = "UPDATE recipe2 SET categoryName = ?,recipeName = ?,notes = ? WHERE id = "+editRecipeId;
    $cordovaSQLite.execute(dbKitchen1,query,[$("#rCategoryInput2").val(),$("#rNameInput2").val(),$("#notes2").val()])
    .then(function(success){
      $cordovaSQLite.execute(dbKitchen1,"Select * from ingredients2 WHERE recipeID = "+editRecipeId).then(function(result){
        if(result.rows.length || $scope.recipeIngredient.length){
          for(var i=0; i<$scope.recipeIngredient.length; i++){
            if(i<=result.rows.length-1){
              if($scope.recipeIngredient[i].id==result.rows.item(i).id){
                var queryUpdateItem = "UPDATE ingredients2 SET  ingredientsName = ?, household = ?, weighted = ? WHERE id = "+$scope.recipeIngredient[i].id;
                $cordovaSQLite.execute(dbKitchen1,queryUpdateItem,[$scope.recipeIngredient[i].ingredientsName,$scope.recipeIngredient[i].household,$scope.recipeIngredient[i].weighted]);
               
              }
            }
            else{
              var queryInsertNewItem = "INSERT INTO ingredients2(recipeID,ingredientsName,household,weighted) VALUES(?,?,?,?)";
                $cordovaSQLite.execute(dbKitchen1,queryInsertNewItem,[editRecipeId,$scope.recipeIngredient[i].ingredientsName,$scope.recipeIngredient[i].household,$scope.recipeIngredient[i].weighted]);
            }
          }
        }
        else{
          console.log("error");
        }
      })

      $cordovaSQLite.execute(dbKitchen1,"Select * from procedure WHERE recipeID = "+editRecipeId).then(function(result){
        if(result.rows.length || $scope.recipeid.length){
          for(var i=0; i<$scope.recipeProcedure.length; i++){
            if(i<=result.rows.length-1){
              if($scope.recipeProcedure[i].id==result.rows.item(i).id){
               var queryUpdateItem = "UPDATE procedure SET procedureDetail = ? WHERE id = "+$scope.recipeProcedure[i].id;
                $cordovaSQLite.execute(dbKitchen1,queryUpdateItem,[$scope.recipeProcedure[i].procedureDetail]);
              }
          }else{
             var queryInsertNewItem = "INSERT INTO procedure(recipeID,procedureDetail) VALUES(?,?)";
              $cordovaSQLite.execute(dbKitchen1,queryInsertNewItem,[editRecipeId,$scope.recipeProcedure[i].procedureDetail]);
          }
          }
        }
      })

    })
    .then(function(success){
      $scope.loadRecipe();
      $state.go('tab.chat-detail2',{recipeName})
    })
    ;
  });
} 

});
})

.controller('EditRecipeCtrl', function($scope,$stateParams,$cordovaSQLite,$ionicPlatform,$state){
  $ionicPlatform.ready(function(){
  var editRecipeId = $stateParams.obj;

  var dbKitchen1 = window.openDatabase("sqlite","1.0","sqlitedemo",2000);
   // dbKitchen1 = $cordovaSQLite.openDB({name:"kitchen.db",location:"default"});
  $cordovaSQLite.execute(dbKitchen1,"CREATE TABLE IF NOT EXISTS recipe2(id integer primary key,categoryName text,recipeName text,notes text, imagePath text)");
  $cordovaSQLite.execute(dbKitchen1,"CREATE TABLE IF NOT EXISTS category(id integer primary key, categoryName text)");
  $cordovaSQLite.execute(dbKitchen1,"CREATE TABLE IF NOT EXISTS ingredients2(id integer primary key, recipeID integer, ingredientsName text, household text, weighted text)");
  $cordovaSQLite.execute(dbKitchen1,"CREATE TABLE IF NOT EXISTS procedure(id integer primary key, recipeID integer, procedureDetail text)");

  $scope.recipeDetail = [];
  $scope.recipeIngredient = [];
  $scope.recipeProcedure = [];
  var recipeName = null;

  $scope.getRecipeDetails = function(){
     dbKitchen1.transaction(function(transaction){
    var queryViewRecipe = "select * from recipe2 where id = ?";
    $cordovaSQLite.execute(dbKitchen1,queryViewRecipe,[editRecipeId]).then(function(result){
      if(result.rows.length){
          for(var i=0;i<result.rows.length;i++){
            $scope.recipeDetail.push(result.rows.item(i));
          }
      }else{
          console.log("No data found!");
      }
    }, function(error){
        console.log("Error: "+error);
      }
    )

    .then(function(){
      $scope.editCategoryName = $scope.recipeDetail[0].categoryName;
      $scope.editRecipeName = $scope.recipeDetail[0].recipeName;
      $scope.editNote = $scope.recipeDetail[0].notes;

      recipeName = $scope.recipeDetail[0].recipeName;

      $scope.getrecipeIngredients($scope.recipeDetail[0].id);
      $scope.getrecipeProcedure($scope.recipeDetail[0].id);
      
    })
    ;
  });
  }

  $scope.getrecipeIngredients = function(recipeID){
     dbKitchen1.transaction(function(transaction){
    var queryIngredientRecipe = "select * from ingredients2 where recipeID = ?";
    $cordovaSQLite.execute(dbKitchen1,queryIngredientRecipe,[editRecipeId]).then(function(result){
      if(result.rows.length){
          for(var i=0;i<result.rows.length;i++){
            $scope.recipeIngredient.push(result.rows.item(i));
          }
      }else{
          console.log("No data found!");
      }
    }, function(error){
        console.log("Error: "+error);
      }
    );
  });
  }

  $scope.getrecipeProcedure = function(recipeID){
     dbKitchen1.transaction(function(transaction){
    var queryProcedureRecipe = "select * from procedure where recipeID = ?";
    $cordovaSQLite.execute(dbKitchen1,queryProcedureRecipe,[editRecipeId]).then(function(result){
      if(result.rows.length){
          for(var i=0;i<result.rows.length;i++){
            $scope.recipeProcedure.push(result.rows.item(i));
          }
      }else{
          console.log("No data found!");
      }
    }, function(error){
        console.log("Error: "+error);
      }
    );
  });
  }

  $scope.getRecipeDetails();
  
  

$scope.addFields = function(){
   dbKitchen1.transaction(function(transaction){
  $cordovaSQLite.execute(dbKitchen1,"Select * from ingredients2").then(function(result){
      $scope.recipeIngredient.push({'id':result.rows.length+1});
    });
});
}


  //======================= Add/Remove Field Procedure

$scope.addProcFields = function(){
   dbKitchen1.transaction(function(transaction){
  $cordovaSQLite.execute(dbKitchen1,"Select * from procedure").then(function(result){
      $scope.recipeProcedure.push({'id':result.rows.length+1});
    });
});
}


$scope.saveEditRecipe = function(){
   dbKitchen1.transaction(function(transaction){
  var currentID = null;
    var query = "UPDATE recipe2 SET categoryName = ?,recipeName = ?,notes = ? WHERE id = "+editRecipeId;
    $cordovaSQLite.execute(dbKitchen1,query,[$("#rCategoryInput2").val(),$("#rNameInput2").val(),$("#notes2").val()])
    .then(function(success){
      $cordovaSQLite.execute(dbKitchen1,"Select * from ingredients2 WHERE recipeID = "+editRecipeId).then(function(result){
        if(result.rows.length || $scope.recipeIngredient.length){
          for(var i=0; i<$scope.recipeIngredient.length; i++){
            if(i<=result.rows.length-1){
              if($scope.recipeIngredient[i].id==result.rows.item(i).id){
                var queryUpdateItem = "UPDATE ingredients2 SET  ingredientsName = ?, household = ?, weighted = ? WHERE id = "+$scope.recipeIngredient[i].id;
                $cordovaSQLite.execute(dbKitchen1,queryUpdateItem,[$scope.recipeIngredient[i].ingredientsName,$scope.recipeIngredient[i].household,$scope.recipeIngredient[i].weighted]);
               
              }
          }else{
            var queryInsertNewItem = "INSERT INTO ingredients2(recipeID,ingredientsName,household,weighted) VALUES(?,?,?,?)";
              $cordovaSQLite.execute(dbKitchen1,queryInsertNewItem,[editRecipeId,$scope.recipeIngredient[i].ingredientsName,$scope.recipeIngredient[i].household,$scope.recipeIngredient[i].weighted]);
          }
          }
        }
        else{
          console.log(error);
        }
      })

      $cordovaSQLite.execute(dbKitchen1,"Select * from procedure WHERE recipeID = "+editRecipeId).then(function(result){
        if(result.rows.length || $scope.recipeid.length){
          for(var i=0; i<$scope.recipeProcedure.length; i++){
            if(i<=result.rows.length-1){
            if($scope.recipeProcedure[i].id==result.rows.item(i).id){
             var queryUpdateItem = "UPDATE procedure SET procedureDetail = ? WHERE id = "+$scope.recipeProcedure[i].id;
              $cordovaSQLite.execute(dbKitchen1,queryUpdateItem,[$scope.recipeProcedure[i].procedureDetail]);
            }
          }else{
            var queryInsertNewItem = "INSERT INTO procedure(recipeID,procedureDetail) VALUES(?,?)";
              $cordovaSQLite.execute(dbKitchen1,queryInsertNewItem,[editRecipeId,$scope.recipeProcedure[i].procedureDetail]);
          }
          }
        }
      })

    })
    .then(function(success){
      $scope.loadRecipe();
      $state.go('tab.chat-detail',{recipeName})
    })
    ;
  });
} 

});
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})


;
