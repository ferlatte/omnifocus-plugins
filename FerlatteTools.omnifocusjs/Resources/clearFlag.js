/* global PlugIn, flattenedTasks, Tag, Task */
(() => {
  var action = new PlugIn.Action(function() {

    let tasks = flattenedTasks.filter(task => {
      return task.taskStatus === Task.Status.Blocked;
    });
    tasks.forEach(task => {
      task.flagged = false;
      if (Tag.forecastTag) {
        task.removeTag(Tag.forecastTag);
      }
    });
  });

  return action;
})();
