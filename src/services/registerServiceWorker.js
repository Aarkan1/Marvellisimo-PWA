import { eventBus } from "../main.js";

const deployed = false

if (deployed) {
  if ("serviceWorker" in navigator) {
    if (!navigator.serviceWorker.controller) {
      navigator.serviceWorker.register("./serviceWorker.js", {
        scope: "./"
      });
    }
  }

  // window.addEventListener("beforeinstallprompt", function (event) {
  //   event.preventDefault();
  //   window.installPrompt = event;
  //   eventBus.$emit("installPromptFired");
  //   return false;
  // });

} else {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then(registrations => {
        for (let sw of registrations) {
          sw.unregister();
        }
      });
  }
}
