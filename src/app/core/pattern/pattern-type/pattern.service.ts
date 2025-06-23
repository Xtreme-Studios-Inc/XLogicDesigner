import { Injectable } from "@angular/core";
import { PatternDefinition, PatternType } from "./pattern";

@Injectable({
  providedIn: "root",
})
export class PatternService {
  constructor() {}

  // Factory function to create default patterns:
  createPattern(type: PatternType | string): PatternDefinition {
    switch (type) {
      case PatternType.AND:
        return {
          id: "and",
          inputs: [
            { id: "A", value: false },
            { id: "B", value: false },
          ],
          outputs: [{ id: "Out", value: false }],
        };
      case PatternType.OR:
        return {
          id: "or",
          inputs: [
            { id: "A", value: false },
            { id: "B", value: false },
          ],
          outputs: [{ id: "Out", value: false }],
        };
      case PatternType.NOT:
        return {
          id: "not",
          inputs: [{ id: "A", value: false }],
          outputs: [{ id: "Out", value: false }],
        };
      default:
        throw new Error("Unknown pattern type");
    }
  }
}
