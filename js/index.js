const DEFAULT_STEP_MOVE = 13;
const TOTAL_STEP = 8;
const STEP_INFO = [
  "talent is given true skill is earned",
  "be flexible to change and sturdy in conviction",
  "use many skills yet work as one",
  "to master anything find interest in anything",
  "individuals flourish if culture and wisdom are shared",
  "train for perfection but aim for more",
  "take pride in your work but do not seek praise",
  "temporary sacrifice brings lasting results",
];
const LEFT_INFO = [1, 2, 6, 7, 8];
const RIGHT_INFO = [3, 4, 5];
const INFO_MARGIN = "100px";
const UNSET = "unset";

let position = 0;
let intervalVar = null;

// Get all the elements
const slide = document.querySelector(".slide");
const prevButton = document.getElementById("slide-arrow-prev");
const nextButton = document.getElementById("slide-arrow-next");
const bg = document.getElementsByClassName("bg")[0];
const liItems = document.getElementsByTagName("li");
const infoDiv = document.getElementById("information");
const stepDetails = document.getElementById("step-details");
const loadingScreen = document.getElementsByClassName("loading-screen")[0];
const contentToShow = document.getElementsByClassName("content-to-show")[0];

// IIFE to call tiemout to hide loading screen
(function init() {
  const timeoutVar = setTimeout(() => {
    (loadingScreen.style.visibility = "hidden"),
      (contentToShow.style.visibility = "visible");
  }, 3000);
})();

function animateToStep(pos, previousPos, currentPos) {
  bg.style.backgroundPosition = pos + "% 0%";

  infoDiv.innerHTML = position >= 1 ? STEP_INFO[position - 1] : "";
  const isRight = RIGHT_INFO.includes(position);

  // Show step info to the right or left
  infoDiv.style.right = isRight ? INFO_MARGIN : UNSET;
  infoDiv.style.left = isRight ? UNSET : INFO_MARGIN;

  // Show step position info
  stepDetails.innerHTML =
    position >= 1
      ? `Step ${position} out of ${TOTAL_STEP} on the path to digital enlightenment`
      : "";

  liItems[currentPos].style.backgroundColor = "white";
  liItems[previousPos].style.backgroundColor = "transparent";
}

// Register listener for next button
nextButton.addEventListener("click", () => {
  if (position < TOTAL_STEP) {
    position += 1;
    let count = 0;
    intervalVar = setInterval(() => {
      if (count === DEFAULT_STEP_MOVE) {
        clearInterval(intervalVar);
      } else {
        animateToStep(
          position * DEFAULT_STEP_MOVE + count,
          position - 1,
          position
        );
        count++;
      }
    }, 50);
  }
});

// Register listener for prev button
prevButton.addEventListener("click", () => {
  if (position > 0) {
    position -= 1;
    let count = 0;
    intervalVar = setInterval(async () => {
      if (count === DEFAULT_STEP_MOVE) {
        clearInterval(intervalVar);
      } else {
        animateToStep(
          DEFAULT_STEP_MOVE * (position + 1) - count,
          position + 1,
          position
        );
        count++;
      }
    }, 50);
  }
});

// Clear interval on leaving the page
window.addEventListener("beforeunload", function (e) {
  if (intervalVar) {
    clearInterval(intervalVar);
  }
});
