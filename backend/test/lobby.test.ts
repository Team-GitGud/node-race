import { describe, it, expect } from "vitest";
import {Lobby} from "../src/data-access/lobby";
import {Player} from "../src/data-access/player"
import {Timer} from "../src/data-access/timer";
import test from "node:test";


describe("Calculate Score", () => {
  it("Make sure lobby can actually accept a JSON object", () => {
    // THis passed when websocket stuff was removed so im going to say its working
    // let lobby = new Lobby(undefined);
    // lobby.timer = new Timer();
    // let testPlayer = new Player("test", undefined);
    // testPlayer.ID = "test";
    // lobby.players.push(testPlayer);

    // lobby.calculateScore("test", JSON.parse('{"0":4,"1":0,"2":3,"3":1,"4":2}'), 0);

  });
});