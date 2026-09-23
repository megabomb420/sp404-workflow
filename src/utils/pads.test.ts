import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  PAD_LABEL_MAX,
  isPadBank,
  padKey,
  padLabel,
  sanitizePadMap,
  setPadLabel,
} from "./pads.ts";

describe("padKey", () => {
  it("builds a key from bank and pad number", () => {
    assert.equal(padKey("A", 1), "A1");
    assert.equal(padKey("J", 16), "J16");
  });

  it("refuses a bank or pad outside the hardware range", () => {
    assert.equal(padKey("K", 1), "");
    assert.equal(padKey("a", 1), "");
    assert.equal(padKey("A", 0), "");
    assert.equal(padKey("A", 17), "");
    assert.equal(padKey("A", 2.5), "");
  });
});

describe("isPadBank", () => {
  it("accepts exactly the ten banks A-J", () => {
    assert.equal(isPadBank("A"), true);
    assert.equal(isPadBank("J"), true);
    assert.equal(isPadBank("K"), false);
    assert.equal(isPadBank(""), false);
    assert.equal(isPadBank(7), false);
    assert.equal(isPadBank(null), false);
  });
});

describe("sanitizePadMap", () => {
  it("returns an empty map for data that is not an object", () => {
    assert.deepEqual(sanitizePadMap(null), {});
    assert.deepEqual(sanitizePadMap("nonsense"), {});
    assert.deepEqual(sanitizePadMap([]), {});
    assert.deepEqual(sanitizePadMap(undefined), {});
  });

  it("keeps only usable entries and normalises the text", () => {
    assert.deepEqual(
      sanitizePadMap({
        A1: "KICK",
        K1: "X",
        A17: "X",
        B0: "X",
        C2: 42,
        D3: "   ",
        E4: "   HAT    OTW.  ",
        F5: "x".repeat(PAD_LABEL_MAX + 6),
      }),
      { A1: "KICK", E4: "HAT OTW." },
    );
  });

  it("keeps an entry at the label limit", () => {
    const atLimit = "x".repeat(PAD_LABEL_MAX);
    assert.deepEqual(sanitizePadMap({ A1: atLimit }), { A1: atLimit });
  });
});

describe("setPadLabel", () => {
  it("adds a key without touching the input map", () => {
    const map = { A1: "KICK" };
    const next = setPadLabel(map, "B2", "SNARE");
    assert.deepEqual(next, { A1: "KICK", B2: "SNARE" });
    assert.deepEqual(map, { A1: "KICK" });
  });

  it("drops the key when the label is empty or whitespace", () => {
    assert.deepEqual(setPadLabel({ A1: "KICK", B2: "SNARE" }, "A1", "  "), { B2: "SNARE" });
  });

  it("ignores a key that is not a real pad", () => {
    const map = { A1: "KICK" };
    assert.equal(setPadLabel(map, "K1", "X"), map);
  });

  it("clamps a label that is too long", () => {
    assert.deepEqual(setPadLabel({}, "A1", "  kick  and  snare  together  "), { A1: "kick and snare" });
  });
});

describe("padLabel", () => {
  it("reads the note for a pad and returns null for an empty one", () => {
    assert.equal(padLabel({ A1: "KICK" }, "A", 1), "KICK");
    assert.equal(padLabel({ A1: "KICK" }, "A", 2), null);
    assert.equal(padLabel({ A1: "KICK" }, "K", 1), null);
  });
});
