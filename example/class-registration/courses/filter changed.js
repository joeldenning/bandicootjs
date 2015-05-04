coot.Event({
  location: 'courses',
  event: 'filter changed',
  owner: 'joel'
});

coot.Scenario({
  location: 'courses',
  event: 'filter changed',
  scenario: 'Show popular courses when there is no filter',
  inject: {
    services: ['Courses']
  },
  condition: function() {
    return /\s*/.test(this.dom.search.value);
  },
  outcome: function() {
    //clear out all visible courses (we only show the popular ones)
    this.dom.visibleCourses = [];

    var popularCourses = this.services.Courses.getPopularCourses();
    for (var i=0; i<popularCourses.length; i++) {
      var popularCourse = popularCourses[i];
      var course = this.buildingBlocks[0].cloneDeep();
      course.courseId.text = popularCourse.courseId;
      course.courseName.text = popularCourse.courseName;
      course.department.text = popularCourse.department;
      course.credits.text = popularCourse.credits;
      
      this.dom.visibleCourses.push(course);
    }
  }
});