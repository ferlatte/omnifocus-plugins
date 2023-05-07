/* global Calendar, DateComponents, PlugIn */
function dateForTomorrow() {
  let calendar = Calendar.current;
  let oneDay = new DateComponents();
  oneDay.day = 1;
  let now = new Date();
  let today = calendar.startOfDay(now);
  return calendar.dateByAddingDateComponents(today, oneDay);
}

(() => {
    var action = new PlugIn.Action(function(selection) {
        selection.tasks.forEach(function(task) {
          task.deferDate = dateForTomorrow();
        });
    });


    action.validate = function(selection){
        return (selection.tasks.length > 0);
    };

    return action;
})();
