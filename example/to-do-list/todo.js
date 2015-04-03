coot.Location({
  location: 'To-do list',
  this: {
    dom: {
      todoList: 'list<thingToDo>',
      newItemUserInput: 'element<input>',
    },
    buildingBlocks: {
      thingToDo: 'thingToDo'
    }
  },
  types: {
    thingToDo: {
      item: {
        checkbox: 'element<input>',
        label: 'element<span>'
      }
    }
  }
});

coot.Event({
  location: 'To-do list',
  event: 'create new item'
});

coot.Event({
  location: 'To-do list',
  event: 'toggle item checked',
  this: {
    event: {
      source: 'element<input>'
    } 
  }
})

coot.Scenario({
  location: 'To-do list',
  event: 'create new item',
  scenario: 'add new row to bulleted list',
  condition: function() {
    return this.dom.newItemUserInput.value.length > 0;
  },
  outcome: function() {
    var newThingToDo = this.buildingBlocks.thingToDo.cloneDeep();
    delete newThingToDo.item.checkbox.checked;
    newThingToDo.item.checkbox.value = this.dom.newItemUserInput.value;
    newThingToDo.item.label.innerHTML = this.dom.newItemUserInput.value;
    this.dom.todoList.push(newThingToDo);
  }
});

coot.Scenario({
  location: 'To-do list',
  event: 'create new item',
  scenario: 'warn the user that the item will not be added to the list',
  condition: function() {
    this.dom.newItemUserInput.value.length === 0
  },
  outcome: function() {
    alert('I am sorry but you can\'t add an item full of whitespace characters');
  }
});

coot.Scenario({
  location: 'To-do list',
  event: 'toggle item checked',
  scenario: 'strike out the corresponding item',
  condition: function() {
    return this.event.source.checkbox.checked;
  },
  outcome: function() {
    this.event.source.class.push('completed-item');
  }
});

coot.Scenario({
  location: 'To-do list',
  event: 'toggle item checked',
  scenario: 'remove strike style from item',
  condition: function() {
    return !this.event.source.checkbox.checked && this.event.source.class.indexOf('completed-item') >= 0;
  },
  outcome: function() {
    this.event.source.class.splice(this.event.source.class.indexOf('completed-item'), 1);
  }
});

coot.Event('To-do list/create new item');
