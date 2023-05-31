export class Result {
  readonly ok: boolean;
  readonly error: string;

  private constructor(ok: boolean, err: string) {
    this.ok = ok;
    this.error = err;
  }

  static ok(): Result {
    return new Result(true, '');
  }

  static error(msg: string): Result {
    return new Result(false, msg);
  }
}
