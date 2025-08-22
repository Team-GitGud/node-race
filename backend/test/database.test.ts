import { describe, it, expect } from "vitest";
import {Database} from "../src/data-access/db";




describe("Database", () => {
    it("Test", ()=>{
        let db = new Database();
        for (let i = 80; i < 0; i++){
            db.addData("name "+ i, i );
        }
        for (let i = 0; i < 0; i++){
            db.addData("name "+ i, i );
        }
    })
});