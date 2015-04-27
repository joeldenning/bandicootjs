coot.Location({
  location: 'To-do list',
  owner: 'Joel',
  inject: {
    dom: {
      todoList: 'list<thingToDo>',
      newItemUserInput: 'element<input>',
      showRemaining: 'element<input>',
      showCompleted: 'element<input>'
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