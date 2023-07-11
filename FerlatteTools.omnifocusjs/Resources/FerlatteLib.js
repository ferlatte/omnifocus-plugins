/* global Alert, Calendar, console, DateComponents, Form, PlugIn, URL, Version */
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

  lib.dateOccursToday = function(dateToCheck) {
    let cal = Calendar.current;
    let now = new Date();
    let midnightToday = cal.startOfDay(now);
    let dc = cal.dateComponentsFromDate(midnightToday);
    dc.day = dc.day + 1;
    let midnightTomorrow = cal.dateFromDateComponents(dc);
    return (dateToCheck >= midnightToday) && (dateToCheck < midnightTomorrow);
  };

  lib.openAIServiceIdentifier = "OpenAI";

  lib.openAIAPIKey = function(credentials) {
    let credsObj = credentials.read(lib.openAIServiceIdentifier);
    if (credsObj) {
      return credsObj.password;
    }
    return undefined;
  };

  lib.requestOpenAIApiKey = async function(credentials) {
    const API_KEY_FIELD_KEY = "apiKey";
    let inputForm = new Form();
    let apiKeyField = new Form.Field.String(
      API_KEY_FIELD_KEY,
      "OpenAI API Key"
    );
    inputForm.addField(apiKeyField);

    inputForm.validate = formObject => {
      let apiKey = formObject.values[API_KEY_FIELD_KEY];
      return !! (apiKey && apiKey.length > 0);
    };
    let formPrompt = `API key for ${lib.openAIServiceIdentifier}`;
    try {
      let formObject = await inputForm.show(formPrompt, "Continue");
      let apiKey = formObject.values[API_KEY_FIELD_KEY];
      // The Credentials API requires a username; it will let you write
      // just a password, but then reads will fail.
      credentials.write(lib.openAIServiceIdentifier, "BearerToken", apiKey);
    } catch(e) {
      console.log(e);
    }
  };

  lib.requestOpenAIApiKeyRemoval = async function(credentials) {
    let alert = new Alert("Confirmation Required",
                          "Remove stored OpenAI API Key?");
    alert.addOption("Remove");
    alert.addOption("Cancel");
    let buttonIndex = await alert.show();
    if (buttonIndex === 0) {
      credentials.remove(lib.openAIServiceIdentifier);
    }
  };

  lib.openAIChatCompletion = async function(apiKey, requestBody) {
    const openAICompletionURL = "https://api.openai.com/v1/chat/completions";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    };
    let r = undefined;
    let request = URL.FetchRequest.fromString(openAICompletionURL);
    request.method = "POST";
    request.headers = headers;
    request.bodyString = JSON.stringify(requestBody);
    let response = await request.fetch();
    if (response.statusCode >= 200 && response.statusCode < 300) {
      r = JSON.parse(response.bodyString);
    } else {
      if (response.mimeType === "application/json") {
        let errorMessage = JSON.parse(response.bodyString).message;
        throw new Error(errorMessage);
      }
    }
    return r;
  };


  return lib;
})();
