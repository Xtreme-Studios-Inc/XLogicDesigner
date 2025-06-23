import { PatternType } from "./pattern";

export interface AND {
  id: "and";
  inputs: [{ id: "A"; value: false }, { id: "B"; value: false }];
  outputs: [{ id: "Out"; value: false }];
}

export interface OR {
  id: "or";
  inputs: [{ id: "A"; value: false }, { id: "B"; value: false }];
  outputs: [{ id: "Out"; value: false }];
}

export interface NOT {
  id: "not";
  inputs: [{ id: "A"; value: false }];
  outputs: [{ id: "Out"; value: true }];
}
