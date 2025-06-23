import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
} from "@angular/core";
import { IODefinition } from "./pattern";
import { PatternService } from "./pattern.service";
import { IoPinComponent } from "../pattern-parts/io-pin/io-pin.component";

@Component({
  selector: "x-pattern-type",
  imports: [IoPinComponent],
  templateUrl: "./pattern-type.component.html",
  styleUrl: "./pattern-type.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatternTypeComponent implements OnInit {
  patternType = input.required<string>();

  inputs: IODefinition[] = [];
  outputs: IODefinition[] = [];

  constructor(private patternService: PatternService) {}

  ngOnInit(): void {
    const patternDefinition = this.patternService.createPattern(
      this.patternType()
    );

    this.inputs = patternDefinition.inputs;
    this.outputs = patternDefinition.outputs;
  }

  public evaluatePattern(inputs: string[]): any {
    switch (this.patternType()) {
      case "AND":
        return this.ANDgate(inputs);
      case "OR":
        return this.ORgate(inputs);
      case "NOT":
        return this.NOTgate(inputs);
      default:
        throw new Error("Unknown pattern type");
    }
  }

  private ANDgate(inputs: string[]) {
    // Implement AND logic here
    return inputs.every(Boolean);
  }

  private ORgate(inputs: string[]) {
    // Implement OR logic here
    return inputs.some(Boolean);
  }

  private NOTgate(inputs: string[]) {
    // Implement NOT logic here (usually single input)
    return !inputs[0];
  }
}
