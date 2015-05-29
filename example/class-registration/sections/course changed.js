coot.Event({
  location: 'sections',
  event: 'course changed',
  owner: 'benjamin'
});

coot.Scenario({
  location: 'sections',
  event: 'course changed',
  scenario: 'valid course is selected',
  services: ['Courses'],
  condition: function() {
    return typeof this.services.Courses.getSelectedCourseId() === 'string';
  },
  outcome: function() {
    
  }
});