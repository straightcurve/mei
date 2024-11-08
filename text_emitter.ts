export class TextEmitter {
  private _output: string = "";

  public addLine(line: string) {
    this._output += line;
    this._output += "\n";

    return this;
  }

  public get text() {
    return this._output;
  }
}
