coot.Service({
  location: 'sections',
  service: 'Sections',
  owner: 'benjamin',
  inject: {
    db: 'loki'
  },
  initialize: function() {
    this.courses = this.db.addCollection('sections');
    this.addSection = function(courseId, sectionId, professor, schedule, takenSeats, totalSeats) {
      this.courses.insert({
        courseId: courseId,
        sectionId: sectionId,
        professor: professor,
        schedule: schedule,
        takenSeats: takenSeats,
        totalSeats: totalSeats
      });
    }
    this.addSection('CS 101', 'Jeff Denning', 'MWF 2-3', 2, 37);
    this.addSection('CS 101', 'Jeff Denning', 'MWF 3-4', 0, 37);
    this.addSection('CS 101', 'Jeff Denning', 'TTh 9-10:30', 37, 37);
  },

  courseSelectionChanged: function() {
    coot.Event('sections/course changed');
  }
});