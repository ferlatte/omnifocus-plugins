/* global Alert, PlugIn, URL, Version */
(() => {
  let FerlatteLib = new PlugIn.Library(new Version("0.1"));

  FerlatteLib.checkForUpdate = async function(version) {
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
  return FerlatteLib;
})();
