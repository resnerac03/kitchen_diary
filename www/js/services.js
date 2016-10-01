var dbKitchen1 = null;

angular.module('starter.services', ['ionic', 'starter.controllers', 'starter.services','ngCordova'])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Adobo',
    lastText: 'You on your way?',
    face: 'img/adobo.jpg'
  }, {
    id: 1,
    name: 'Sinigang',
    lastText: 'Hey, it\'s me',
    face: 'img/sinigang.png'
  }, {
    id: 2,
    name: 'Pinakuluang Slut',
    lastText: 'I should buy a boat',
    face: 'img/adobo.jpg'
  }, {
    id: 3,
    name: 'Pritong Famewhore',
    lastText: 'Look at my mukluks!',
    face: 'img/sinigang.png'
  }, {
    id: 4,
    name: 'Nilagang kabet',
    lastText: 'This is wicked good ice cream.',
    face: 'img/adobo.jpg'
  },{
    id: 5,
    name: 'Lechon Bitch',
    lastText: 'This is wicked good ice cream.',
    face: 'img/sinigang.png'
  },{
    id: 6,
    name: 'Mongoloid na GF',
    lastText: 'This is wicked good ice cream.',
    face: 'img/adobo.jpg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

