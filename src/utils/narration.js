import { say, ask, cheer, celebrate, instruct } from './audio.js';

export function landingNarration() {
  return [
    say("Ready for a shape-tastic adventure?")
  ];
}

export function wonderNarration() {
  return [
    ask("Hey there! Ready to explore the world of shapes?"),
    instruct("Look closely at this image of a city."),
    ask("What shapes do you see?"),
    cheer("Let's count together!")
  ];
}

export function getStoryNarration(pageIndex) {
  const pages = [
    [say("Meet Zara and Leo, the shape explorers!")],
    [say("Zara loves squares and rectangles because they're so stable.")],
    [say("Leo adores triangles—they're the strongest shapes!")],
    [cheer("And circles? Well, they roll perfectly!")]
  ];
  return pages[pageIndex] || [];
}

export function simulateStationAIntro() {
  return [
    celebrate("Welcome to Shape Builder Station!"),
    instruct("Choose a shape to build:"),
    instruct("Drag the pieces to make your shape!")
  ];
}

export function simulateStationBIntro() {
  return [
    say("Now, let's count sides and corners!"),
    instruct("Tap the buttons to count sides or corners of the shape.")
  ];
}

export function simulateStationCIntro() {
  return [
    cheer("Time to sort shapes!"),
    instruct("Drag each shape to the correct bin!")
  ];
}

export function simulateStationDIntro() {
  return [
    ask("Guess the mystery shape!"),
    instruct("Use the hints to figure it out!")
  ];
}

export function playNarration() {
  return [
    celebrate("Let's play!"),
    instruct("Choose a world to play!")
  ];
}

export function reflectNarration() {
  return [
    celebrate("Great job, shape explorer!"),
    instruct("Let's look at what you learned!")
  ];
}
