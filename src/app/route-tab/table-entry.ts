//
// table-entry.ts
//

import { Naptan, MakeTubeNaptans } from "../naptans/naptans";

const stations = MakeTubeNaptans();

export interface ITableEntry {
  readonly entryIndex: number;
  readonly fromStationId: string;
  readonly fromTime: string;
  readonly toStationId: string;
  readonly toTime: string;
  readonly lineId: string;
  readonly naptansVisited: Array<string>;
  readonly naptansRemain: Array<string>;
};

export interface ITableEntryEx extends ITableEntry {
  readonly fromStationName: string;
  readonly toStationName: string;
  readonly naptansRemainCount: number;
  readonly stationsRemain: Array<string>;
  serialize(): object;
};

class TableEntry implements ITableEntryEx {
  private impl: ITableEntry = null;

  constructor(
    entryIndex: number = null,
    fromStationId: string = null,
    fromTime: string = null,
    toStationId: string = null,
    toTime: string = null,
    lineId: string = null,
    naptansVisited: Array<string> = null,
    naptansRemain: Array<string> = null
  ) {
    this.impl = {
      entryIndex: entryIndex, fromStationId: fromStationId,
      fromTime: fromTime, toStationId: toStationId,
      toTime: toTime, lineId: lineId,
      naptansVisited: naptansVisited, naptansRemain: naptansRemain
    };
  }

  setImpl(impl: ITableEntry) { this.impl = impl; }

  static fromImpl(serialized: object): TableEntry {
    let x = new TableEntry();
    x.setImpl(<ITableEntry>serialized);
    return x;
  }

  serialize(): object { return JSON.parse(JSON.stringify(this.impl)); }

  get entryIndex() { return this.impl.entryIndex; }

  get fromStationId() { return this.impl.fromStationId; }

  get fromTime() { return this.impl.fromTime; }

  get toStationId() { return this.impl.toStationId; }

  get toTime() { return this.impl.toTime; }

  get lineId() { return this.impl.lineId; }

  get naptansVisited() { return this.impl.naptansVisited; }

  get naptansRemain() { return this.impl.naptansRemain; }

  public stationsRemainHidden: boolean = true;

  get fromStationName() {
    const found = stations.find(
      (n: Naptan) => n.id == this.fromStationId
    );
    return found ? found.name : "???";
  }

  get toStationName() {
    const found = stations.find(
      (n: Naptan) => n.id == this.toStationId
    );
    return found ? found.name : "???";
  }

  get naptansRemainCount() { return this.naptansRemain.length; }

  get stationsRemain() {
    return MakeTubeNaptans().filter((value: Naptan) => {
      return this.naptansRemain.includes(value.id);
    }).map((value: Naptan) => value.name);
  }
}

export function MakeTableEntry(entryIndex: number,
  fromStationId: string,
  fromTime: string,
  toStationId: string,
  toTime: string,
  lineId: string,
  naptansVisited: Array<string>,
  naptansRemain: Array<string>): ITableEntryEx {
  return new TableEntry(entryIndex, fromStationId, fromTime, toStationId, toTime, lineId, naptansVisited, naptansRemain);
}

export function MakeTableEntryFromObject(serialized: object) {
  return TableEntry.fromImpl(serialized);
}
