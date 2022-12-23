/*{
  "author": "Mark Ferlatte",
  "targets": ["omnifocus"],
  "type": "action",
  "identifier": "net.cryptio.clear-flag-from-tasks",
  "version": "0.2",
  "description": "Clear flag and forecast tag from uncompleted tasks.",
  "label": "Clear flag and forecast tag from uncompleted tasks",
  "mediumLabel": "Clear flag and forecast tag from uncompleted tasks",
  "paletteLabel": "Clear flag and forecast tag from uncompleted tasks",
  }*/

/* Clear flags AND clear the forecast tag */

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
