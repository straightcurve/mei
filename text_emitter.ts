export class TextEmitter {
  private _output: string = "";

  public addLine(line: string) {
    this._output += line;
    this._output += "\n";

    return this;
  }

  public addText(text: string) {
    this._output += text;

    return this;
  }

  public newLine() {
    this._output += "\n";

    return this;
  }

  public get text() {
    return this._output;
  }
}
