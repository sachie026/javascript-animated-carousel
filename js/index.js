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
const INFO_MARGIN = "175px";
const UNSET = "unset";

let position = 0;
let intervalVar = null;

const slide = document.querySelector(".slide");
const prevButton = document.getElementById("slide-arrow-prev");
const nextButton = document.getElementById("slide-arrow-next");
const bg = document.getElementsByClassName("bg")[0];
const infoDiv = document.getElementById("information");

function animateToStep(pos) {
  bg.style.backgroundPosition = pos + "% 0%";

  infoDiv.innerHTML = position >= 0 ? STEP_INFO[position - 1] : "";
  const isRight = RIGHT_INFO.includes(position);

  infoDiv.style.right = isRight ? INFO_MARGIN : UNSET;
  infoDiv.style.left = isRight ? UNSET : INFO_MARGIN;
}

nextButton.addEventListener("click", () => {
  if (position < TOTAL_STEP) {
    position += 1;
    let count = 0;

    intervalVar = setInterval(() => {
      if (count === DEFAULT_STEP_MOVE) {
        clearInterval(intervalVar);
      } else {
        animateToStep(position * DEFAULT_STEP_MOVE + count);
        count++;
      }
    }, 50);
  }
});

prevButton.addEventListener("click", () => {
  if (position > 0) {
    let count = 0;
    intervalVar = setInterval(async () => {
      if (count === DEFAULT_STEP_MOVE) {
        clearInterval(intervalVar);
      } else {
        animateToStep(DEFAULT_STEP_MOVE * (position + 1) - count);
        count++;
      }
    }, 50);
    position -= 1;
  }
});

window.addEventListener("beforeunload", function (e) {
  if (intervalVar) {
    clearInterval(intervalVar);
  }
});
