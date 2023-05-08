/* global Alert, Calendar, DateComponents, PlugIn, URL, Version */
(() => {
  const lib = new PlugIn.Library(new Version("0.1"));

  lib.checkForUpdate = async function(version) {
    const githubReleaseURL = "https://api.github.com/repos/ferlatte/omnifocus-plugins/releases/latest";
    const headers = {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    };
    let request = URL.FetchRequest.fromString(githubReleaseURL);
    request.headers = headers;
    let response = await request.fetch();
    let alertMessage = "";
    if (response.statusCode >= 200 && response.statusCode < 300) {
      let r = JSON.parse(response.bodyString);
      let latestVersion = new Version(r.name);
      if (latestVersion > version) {
        alertMessage = `Update needed. Download from ${r.html_url}`;
      } else {
        alertMessage = "No update needed.";
      }
    } else {
      alertMessage = response.bodyString;
    }
    let alert = new Alert("Update status", alertMessage);
    return alert.show();
  };

  lib.dateForTomorrow = function() {
    let calendar = Calendar.current;
    let oneDay = new DateComponents();
    oneDay.day = 1;
    let now = new Date();
    let today = calendar.startOfDay(now);
    return calendar.dateByAddingDateComponents(today, oneDay);
  };

  lib.openAIServiceIdentifier = "OpenAI";

  lib.openAIAPIKey = function(credentials) {
    let credsObj = credentials.read(lib.openAIServiceIdentifier);
    if (credsObj) {
      return credsObj.password;
    }
    return undefined;
  };

  return lib;
})();
