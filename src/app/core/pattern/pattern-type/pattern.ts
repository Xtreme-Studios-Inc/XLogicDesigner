export enum PatternType {
  AND = "and",
  OR = "or",
  NOT = "not",
}

export type IOType = string | number | boolean;

export interface IODefinition {
  id: string;
  value?: IOType;
}

export interface PatternDefinition {
  id: string;
  inputs: IODefinition[];
  outputs: IODefinition[];
}
