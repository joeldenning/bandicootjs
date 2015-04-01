coot.Event({
  where: 'To-do list',
  what: 'create new item',
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
      checkbox: 'element<input>',
      label: 'element<label>'
    }
  },
  services: []
});

coot.Scenario({
	outcome: 'add new row to bulleted list',
	where: 'To-do list',
	what: 'create new item',
	when: function() {
    return this.dom.newItemUserInput.value.length > 0;
  },
	how: function() {
		var newItem = this.buildingBlocks.thingToDo.cloneDeep();
		delete newItem.checkbox.checked;
		newItem.checkbox.value = this.dom.newItemUserInput.value;
		newItem.label.innerHTML = this.dom.newItemUserInput.value;
		this.dom.todoList.push(newItem);
	}
});

coot.Scenario({
  outcome: 'warn the user that the item will not be added to the list',
  where: 'To-do list',
  what: 'create new item',
  when: function() {
    this.dom.newItemUserInput.value.length === 0
  },
  how: function() {
    alert('I am sorry but you can\'t add an item full of whitespace characters');
  }
});
