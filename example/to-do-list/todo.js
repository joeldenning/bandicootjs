coot.Event({
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

coot.Scenario({
	outcome: 'add new row to bulleted list',
	where: 'To-do list',
	what: 'create new item',
	when: 'this.dom.newItemUserInput.value.length > 0',
	how: function() {
		var newItem = this.buildingBlocks.thingToDo.create();
		newItem.checkbox.checked = false;
		newItem.label.innerHTML = this.dom.newItemUserInput.value;
		this.dom.todoList.insert(newItemUserInput);
	}
});

coot.Scenario({
	outcome: 'warn the user that the item will not be added to the list',
	where: 'To-do list',
	what: 'create new item',
	when: 'this.dom.newItemUserInput.value.length === 0',
	how: function() {
		alert('I am sorry but you can\'t add an item full of whitespace characters');
	}
});
