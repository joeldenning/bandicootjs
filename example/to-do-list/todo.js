DomEvent({
	application: 'To-do list',
	owner: 'Joel',
	description: 'add new item',
	domVariables: {
		todoList: {}
	},
	domExamples: {
		thingToDo: {
			checkbox: 'input',
			label: 'label'
		}
	},
	businessLogic: function(domVariables, domExamples) {
		if(domVariables.newItem.getValue().length < 1) {
			Event('To-do list/Joel/new item name is blank')
		} else {
			var newItem = domExamples.thingToDo.create()
			newItem.checkbox.uncheck()
			newItem.label.setValue('A new thing to do')
			domVariables.todoList.add(newItem)
		}
	}
})

Event({
	application: 'To-do list',
	owner: 'Joel',
	description: 'new item name is blank'

})
