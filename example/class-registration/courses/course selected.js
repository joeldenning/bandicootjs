coot.Event({
  location: 'courses',
  event: 'course selected',
  owner: 'joel',
  inject: {
    event: {
      source: 'element<tr>'
    } 
  }
});

coot.Scenario({
  location: 'courses',
  event: 'course selected',
  scenario: 'Make it look selected',
  inject: {
    services: ['Courses']
  },
  condition: function() {
    return true;
  },
  outcome: function() {
    //first clear the selected class from all courses
    for (var i=0; i<this.dom.visibleCourses.length; i++) {
      var course = this.dom.visibleCourses[i];
      var index = course.class.indexOf('selected-row');
      if (index >= 0)
        course.class.splice(index, 1);
    }

    //now add the selected class to the course that was clicked
    this.event.source.class.push('selected-row');

    //store which class is selected
    this.services.Courses.courseSelected(this.event.source.courseId);
  }
})