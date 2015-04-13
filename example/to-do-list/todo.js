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
  event: 'create new item',
  condition: function() {
    if (this.event.keyboard) {
      return coot.framework.keycode(this.event.keyboard.keyCode) === 'enter'
    } else {
      return true;
    }
  }
});

coot.Scenario({
  location: 'To-do list',
  event: 'create new item',
  scenario: 'add new row to bulleted list',
  condition: function() {
    return this.dom.newItemUserInput.value.trim().length > 0;
  },
  outcome: function() {
    var newThingToDo = this.buildingBlocks.thingToDo.cloneDeep();
    delete newThingToDo.item.checkbox.checked;
    newThingToDo.item.checkbox.value = this.dom.newItemUserInput.value;
    newThingToDo.item.label.text = this.dom.newItemUserInput.value;
    this.dom.todoList.push(newThingToDo);
    this.dom.newItemUserInput.value = '';
  }
});

coot.Scenario({
  location: 'To-do list',
  event: 'create new item',
  scenario: 'warn the user that the item will not be added to the list',
  condition: function() {
    return this.dom.newItemUserInput.value.length === 0;
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

coot.Event({
  location: 'To-do list',
  event: 'toggle item checked',
  this: {
    event: {
      source: 'element<input>'
    } 
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

coot.Event({
  location: 'To-do list',
  event: 'clear selected'
});

coot.Scenario({
  location: 'To-do list',
  event: 'clear selected',
  scenario: 'remove checked items from to do list',
  condition: function() {
    return true;
  },
  outcome: function() {
    this.dom.todoList = this.dom.todoList.filter(function(thingToDo) {
      return !thingToDo.item.checkbox.checked;
    });
  }
});

coot.Event({
  location: 'To-do list',
  event: 'clear all'
});

coot.Scenario({
  location: 'To-do list',
  event: 'clear all',
  scenario: 'remove all items from list',
  condition: function() {
    return this.dom.todoList.length > 0;
  },
  outcome: function() {
    this.dom.todoList = [];
  }
});

coot.Event({
  location: 'To-do list',
  event: 'filter changed',
  this: {
    event: {
      source: 'element<select>'
    }
  }
});

coot.Scenario({
  location: 'To-do list',
  event: 'filter changed',
  scenario: 'select all items',
  condition: function() {
    return this.event.source.value === 'all';
  },
  outcome: function() {
    for (var i=0; i<this.dom.todoList.length; i++) {
      delete this.dom.todoList[i].item.style.display;
    }
  }
});

coot.Scenario({
  location: 'To-do list',
  event: 'filter changed',
  scenario: 'select completed items',
  condition: function() {
    return this.event.source.value === 'completed';
  },
  outcome: function() {
    for (var i=0; i<this.dom.todoList.length; i++) {
      var item = this.dom.todoList[i].item;
      if (item.checkbox.checked) {
        delete item.style.display;
      } else {
        item.style.display = 'none';
      }
    }
  }
});

coot.Scenario({
  location: 'To-do list',
  event: 'filter changed',
  scenario: 'select remaining items',
  condition: function() {
    return this.event.source.value === 'remaining';
  },
  outcome: function() {
    for (var i=0; i<this.dom.todoList.length; i++) {
      var item = this.dom.todoList[i].item;
      if (item.checkbox.checked) {
        item.style.display = 'none';
      } else {
        delete item.style.display;
      }
    }
  }
});