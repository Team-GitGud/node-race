import { describe, it, expect } from "vitest";
import {GameLogic} from "../src/session-logic/gameLogic";
describe("Generates questions", () => {
  it("should be able to make a JSON", () => {
    let logic = new GameLogic();
    logic.generateQuestions;
    console.log(logic.getQuestionJSON);
  });
});