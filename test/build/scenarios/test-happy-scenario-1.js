var assert = require('chai').assert;

describe('Happy, normal scenario', function() {
  var bandicoot;
  beforeEach(function() {
    bandicoot = require(process.cwd() + '/src/bandicoot-builder.js').build();
  });

  it('doesn\'t throw any errors when created', function() {
    bandicoot.Scenario({
      where: 'To-do list',
      action: 'create new item',
      when: 'domVariables.newItem.getValue().length > 1',
      what: 'add new row to bulleted list',
      how: function(domVariables, domExamples, services) {
        if(domVariables.newItem.getValue().length < 1) {
          Event('To-do list/Joel/new item name is blank')
        } else {
          var newItem = domExamples.thingToDo.create()
          newItem.checkbox.uncheck()
          newItem.label.setValue('A new thing to do')
          domVariables.todoList.add(newItem)
        }
      },

      domVariables: {
        todoList: {}
      },
      domExamples: {
        thingToDo: {
          checkbox: 'input',
          label: 'label'
        }
      },
      services: [],
    });
  });
});