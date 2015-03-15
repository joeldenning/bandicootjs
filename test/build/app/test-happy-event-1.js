var assert = require('chai').assert;

describe('Happy, normal event', function() {
  var bandicoot;
  beforeEach(function() {
    bandicoot = require(process.cwd() + '/src/bandicoot-builder.js').build();
  });

  it('doesn\'t throw any errors when created', function() {
    bandicoot.Event({
      where: 'To-do list',
      what: 'create new item',
      this: {
        dom: {
          $scope: 'to-do list',
          todoList: 'list<thingToDo>',
          newItemUserInput: 'element<input>',
        },
        buildingBlocks: {
          $scope: 'to-do list',
          thingToDo: 'thingToDo'
        }
      },
      types: {
        thingToDo: {
          checkbox: 'element<input>',
          label: 'element<label>'
        }
      },
      services: []
    });
  });
});