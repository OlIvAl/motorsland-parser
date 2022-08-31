import { Writable } from "stream";
import { Table, Request, SmallInt, TinyInt, VarChar, IBulkResult } from "mssql";

export class InsertLinksWritable extends Writable {
  constructor(
    private table: Table,
    private request: Request,
    private uploadingId: string
  ) {
    super({ objectMode: true });
  }

  _construct(callback: (error?: Error | null) => void) {
    this.table.columns.add("uploading_id", SmallInt(), { primary: true });
    this.table.columns.add("url", VarChar(1000), {
      nullable: false,
      identity: true,
    });
  }

  _write(
    link: string,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ) {
    this.table.rows.add(this.uploadingId, link);

    if (this.table.rows.length < 100) {
      callback();
    } else {
      this.request.bulk(this.table, (err: Error, result: IBulkResult): void => {
        if (err) {
          callback(err);
        }

        callback();
      });
    }
  }
}
