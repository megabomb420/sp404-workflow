import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { estimateTapBpm, formatTapBpm } from "./loopFit.ts";

describe("estimateTapBpm", () => {
  it("needs at least two taps", () => {
    assert.equal(estimateTapBpm([]), null);
    assert.equal(estimateTapBpm([0]), null);
  });

  it("reads a steady 500 ms tap as 120 BPM", () => {
    assert.deepEqual(estimateTapBpm([0, 500, 1000, 1500, 2000]), {
      bpm: 120,
      intervals: 4,
      stable: true,
    });
  });

  it("reads a 90 BPM tap from non-integer intervals", () => {
    const estimate = estimateTapBpm([0, 2000 / 3, 4000 / 3, 2000, 8000 / 3]);
    assert.equal(estimate?.bpm, 90);
  });

  it("takes the median, not the mean, of uneven intervals", () => {
    assert.deepEqual(estimateTapBpm([0, 500, 1000, 1500, 2300]), {
      bpm: 120,
      intervals: 4,
      stable: true,
    });
  });

  it("drops a bounce shorter than the minimum interval", () => {
    assert.deepEqual(estimateTapBpm([0, 500, 550, 1050, 1550]), {
      bpm: 120,
      intervals: 3,
      stable: false,
    });
  });

  it("returns null when every interval is too fast to be a tap", () => {
    assert.equal(estimateTapBpm([0, 100, 200, 300]), null);
  });

  it("uses only the last eight valid intervals", () => {
    assert.deepEqual(
      estimateTapBpm([0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500]),
      { bpm: 120, intervals: 8, stable: true },
    );
  });
});

describe("formatTapBpm", () => {
  it("drops the decimal on whole BPM", () => {
    assert.equal(formatTapBpm(120), "120");
  });

  it("keeps one decimal on a fractional BPM", () => {
    assert.equal(formatTapBpm(90.46), "90.5");
  });
});
