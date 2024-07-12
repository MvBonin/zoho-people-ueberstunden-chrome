(function () {
  "use strict";

  // Funktion zum Konvertieren von Zeit im Format "HH:MM" in Minuten
  function timeToMinutes(timeStr) {
    let [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }

  // Funktion zum Konvertieren von Minuten in das Format "HH:MM"
  function minutesToTime(minutes) {
    const sign = minutes < 0 ? "-" : "";
    minutes = Math.abs(minutes);
    let hours = Math.floor(minutes / 60);
    let mins = minutes % 60;
    return `${sign}${hours}:${mins < 10 ? "0" : ""}${mins}`;
  }

  // Funktion zum Berechnen der tatsächlichen Überstunden
  function calculateActualOvertime(overtime, deviation) {
    let overtimeMinutes = timeToMinutes(overtime);
    let deviationMinutes = timeToMinutes(deviation);
    let actualOvertimeMinutes = overtimeMinutes - deviationMinutes;
    return actualOvertimeMinutes;
  }

  // Funktion zum Hinzufügen des tatsächlichen Überstunden-Elements
  function addActualOvertimeElement() {
    console.log("addActualOvertimeElement triggered");
    let overtimeElement = document.getElementById("ZPAtt_URep_OTHrs");
    let deviationElement = document.getElementById("ZPAtt_URep_DTHrs");

    if (overtimeElement && deviationElement) {
      console.log("Overtime and Deviation elements found");
      let overtime = overtimeElement.innerText.replace(" Std", "");
      let deviation = deviationElement.innerText.replace(" Std", "");

      let actualOvertimeMinutes = calculateActualOvertime(overtime, deviation);
      let actualOvertime = minutesToTime(actualOvertimeMinutes);
      let label =
        actualOvertimeMinutes < 0 ? "Unterstunden" : "Tatsächliche Überstunden";
      let borderColor = actualOvertimeMinutes < 0 ? "#96000a" : "#00960d";

      // Überprüfe, ob das tatsächliche Überstunden-Element bereits existiert
      let existingElement = document.getElementById("ZPAtt_URep_ActualOTHrs");
      if (existingElement) {
        existingElement.innerText = `${actualOvertime} Std`;
        existingElement.parentNode.style.borderColor = borderColor;
      } else {
        // Erstelle ein neues Element für die tatsächlichen Überstunden
        let actualOvertimeElement = document.createElement("div");
        actualOvertimeElement.className = "Dtyps actual-overtime-border";
        actualOvertimeElement.style.borderColor = borderColor;
        actualOvertimeElement.innerHTML = `<span>${label}</span> <div class="Avadat" id="ZPAtt_URep_ActualOTHrs">${actualOvertime} Std</div>`;

        // Füge das neue Element unter den bestehenden ein
        deviationElement.parentNode.insertAdjacentElement(
          "afterend",
          actualOvertimeElement
        );
      }
    } else {
      console.log("Overtime or Deviation elements not found");
    }
  }

  // Funktion zum Beobachten von Klassenänderungen
  function observeClassChange(targetNode, className, callback) {
    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          if (targetNode.classList.contains(className)) {
            console.log(`Class "${className}" added to target node`);
            callback();
          }
        }
      }
    });

    observer.observe(targetNode, { attributes: true });
  }

  // Warte, bis die Seite vollständig geladen ist
  window.addEventListener("load", function () {
    console.log("Page loaded");
    // Beobachte Änderungen an der Klasse des Body-Elements
    observeClassChange(document.body, "modal-open", function () {
      console.log("Modal opened");
      setTimeout(addActualOvertimeElement, 1000);
    });
  });
})();
