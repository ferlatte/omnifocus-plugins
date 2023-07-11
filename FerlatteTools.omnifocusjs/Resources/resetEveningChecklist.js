/* global PlugIn, Calendar, console, flattenedProjects, */
(() => {
  var action = new PlugIn.Action(function() {
    const eveningRitualName = "Evening Ritual";
    let eveningRituals = flattenedProjects.filter(project => {
      return (project.name === eveningRitualName) &&
        (project.completed === false);
    });
    // There should only be one.
    if (eveningRituals.length !== 1) {
      console.log("Wrong number of active Evening Rituals: ", eveningRituals.length);
      return;
    }
    // Evening Ritual is set to repeat on completion, so complete it first.
    eveningRituals[0].markComplete();
    // Find the repeated task.
    eveningRituals = flattenedProjects.filter(project => {
      return (project.name === eveningRitualName) &&
        (project.completed === false);
    });
    // There should only be one.
    if (eveningRituals.length !== 1) {
      console.log("Wrong number of active Evening Rituals: ", eveningRituals.length);
      return;
    }
    let eveningRitual = eveningRituals[0];
    let eveningRitualDeferDate = eveningRitual.deferDate;
    // set to today
    let today = Calendar.current.startOfDay(new Date());
    let dcToday = Calendar.current.dateComponentsFromDate(today);
    let dcDeferDate = Calendar.current.dateComponentsFromDate(eveningRitualDeferDate);
    dcToday.hour = dcDeferDate.hour;
    dcToday.minute = dcDeferDate.minute;
    today = Calendar.current.dateFromDateComponents(dcToday);
    eveningRitual.deferDate = today;
  });

  return action;
})();
