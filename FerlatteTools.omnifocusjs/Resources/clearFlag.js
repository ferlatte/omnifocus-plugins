/* global PlugIn, flattenedTasks, Tag, Task */
(() => {
  var action = new PlugIn.Action(function() {
    let tasks = flattenedTasks.filter(task => {
      return task.taskStatus !== Task.Status.Completed;
    }).filter(task => {
      return task.taskStatus !== Task.Status.Dropped;
    });
    tasks.forEach(task => {
      task.flagged = false;
      if (Tag.forecastTag) {
        task.removeTag(Tag.forecastTag);
      }
    });
  });

  action.validate = function() {
    return true;
  };

  return action;
})();
