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