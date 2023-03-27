const DEFAULT_STEP_MOVE = 12;
const TOTAL_STEP = 8;
const STEP_POSITIONS = [0, 14, 28, 42, 56, 70, 84, 98, 112]; // background position points
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
const INFO_MARGIN = "75px";
const UNSET = "unset";

let position = 0;
let prevButtonInterval = null;
let nextButtonInterval = null;
let loadingScreenTimeout = null;
let patienceTextTimeout = null;

// Get all the elements
const slide = document.querySelector(".slide");
const prevButton = document.getElementById("slide-arrow-prev");
const nextButton = document.getElementById("slide-arrow-next");
const bg = document.getElementsByClassName("page-background")[0];
const liItems = document.getElementsByTagName("li");
const infoDiv = document.getElementById("information");
const stepDetails = document.getElementById("step-details");
const loadingScreen = document.getElementsByClassName("loading-screen")[0];
const contentToShow = document.getElementsByClassName("content-to-show")[0];
const patienceText = document.getElementById("patienceText");
const summaryDiv = document.getElementById("summary");
const introTextDiv = document.getElementById("intro-text");

function updateIntroTextVisibility() {
  introTextDiv.style.visibility = position === 0 ? "visible" : "hidden";
}

// IIFE to call tiemout to hide loading screen
(function init() {
  loadingScreenTimeout = setTimeout(() => {
    (loadingScreen.style.visibility = "hidden"),
      (contentToShow.style.visibility = "visible");
    updateIntroTextVisibility();
  }, 3000);

  patienceTextTimeout = setTimeout(() => {
    patienceText.innerHTML = "Patience, young padawan...";
  }, 1000);
})();

function alignInfoDiv() {
  infoDiv.innerHTML = position >= 1 ? STEP_INFO[position - 1] : "";
  const isRight = RIGHT_INFO.includes(position);

  // Show step info to the right or left
  infoDiv.style.right = isRight ? INFO_MARGIN : UNSET;
  infoDiv.style.left = isRight ? UNSET : INFO_MARGIN;

  infoDiv.style.textAlign = isRight ? "right" : "left";
}

function updateStepDetails() {
  // Show step position info
  stepDetails.innerHTML =
    position >= 1
      ? `Step ${position} out of ${TOTAL_STEP} on the path to digital enlightenment`
      : "";
}

function checkAndShowSummary() {
  summaryDiv.style.visibility = position >= 8 ? "visible" : "hidden";
}

function highlightStep(currentPos) {
  for (let i = 0; i < liItems.length; i++) {
    liItems[i].style.backgroundColor =
      i === currentPos ? "white" : "transparent";
  }
}

function animateToStep(posLocation, currentPos) {
  bg.style.backgroundPosition = posLocation + "% 0%";
  highlightStep(currentPos);
}

function updateRenderElements() {
  alignInfoDiv();
  updateStepDetails();
  checkAndShowSummary();
  updateIntroTextVisibility();
}

function startAnimation(moveFroward, howManySteps, callback) {
  // howManySteps is used to make step transition scalable

  const oldPos = STEP_POSITIONS[position];
  const newPos = moveFroward
    ? STEP_POSITIONS[position + howManySteps]
    : STEP_POSITIONS[position - howManySteps];
  const newIndex = moveFroward
    ? position + howManySteps
    : position - howManySteps;
  let movePos = oldPos;

  nextButtonInterval = setInterval(() => {
    if (movePos === newPos) {
      clearInterval(nextButtonInterval);
      callback && callback();
    } else {
      animateToStep(movePos, newIndex);
      if (moveFroward) {
        movePos++;
      } else {
        movePos--;
      }
    }
  }, 50);
}

async function onStepClick(stepPosition) {
  if (stepPosition !== position) {
    const moveFroward = stepPosition > position;
    await startAnimation(
      moveFroward,
      Math.abs(stepPosition - position),
      function () {
        position = stepPosition;
        updateRenderElements();
        highlightStep(stepPosition);
      }
    );
  }
}

// Register listener for next button
nextButton.addEventListener("click", async () => {
  if (position < TOTAL_STEP + 1) {
    await startAnimation(true, 1, function () {
      position++;
      updateRenderElements();
    });
  }
});

// Register listener for prev button
prevButton.addEventListener("click", async () => {
  if (position > 0) {
    await startAnimation(false, 1, function () {
      position--;
      updateRenderElements();
    });
  }
});

// Clear intervals and timeouts on leaving the page
window.addEventListener("beforeunload", function () {
  nextButtonInterval && clearInterval(prevButtonInterval);
  prevButtonInterval && clearInterval(prevButtonInterval);
  loadingScreenTimeout && clearTimeout(loadingScreenTimeout);
  patienceTextTimeout && clearTimeout(patienceTextTimeout);
});
