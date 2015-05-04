coot.Service({
  location: 'courses',
  service: 'Courses',
  owner: 'joel',
  inject: {
    db: 'loki'
  },
  initialize: function() {
    this.courses = this.db.addCollection('courses');
    this.addCourse = function(id, dept, name, credits, popularity) {
      this.courses.insert( {
        courseId: id,
        department: dept,
        courseName: name,
        credits: credits,
        popularity: popularity
      });
    }
    this.addCourse('ENGL 100', 'English', 'hookt on fonix', 3, 80);
    this.addCourse('ENGL 200', 'English', 'fonix workt for me', 3, 25);
    this.addCourse('CS 101', 'Computer Science', 'Foo!', 3, 80);
    this.addCourse('CS 200', 'Computer Science', 'Bar!', 4, 22);
  },
  getPopularCourses: function() {
    return this.courses.find({ popularity: { '$gt': 75 } });
  }
});