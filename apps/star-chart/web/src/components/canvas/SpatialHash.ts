export interface SpatialRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class SpatialHash<T extends string = string> {
  cellSize: number;
  cells: Map<string, Set<T>>;
  rects: Map<string, SpatialRect>;

  constructor(cellSize: number) {
    this.cellSize = cellSize;
    this.cells = new Map<string, Set<T>>();
    this.rects = new Map<string, SpatialRect>();
  }

  private key(x: number, y: number) {
    return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)}`;
  }

  private getCell(x: number, y: number) {
    const key = this.key(x, y);
    let cell = this.cells.get(key);
    if (!cell) {
      cell = new Set<T>();
      this.cells.set(key, cell);
    }
    return cell;
  }

  insert(obj: T, rect: SpatialRect) {
    const x0 = Math.floor(rect.x / this.cellSize);
    const y0 = Math.floor(rect.y / this.cellSize);
    const x1 = Math.floor((rect.x + rect.width) / this.cellSize);
    const y1 = Math.floor((rect.y + rect.height) / this.cellSize);

    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        this.getCell(x, y).add(obj);
      }
    }

    this.rects.set(obj, rect);
  }

  remove(obj: T) {
    const rect = this.rects.get(obj);
    if (!rect) {
      return;
    }

    const x0 = Math.floor(rect.x / this.cellSize);
    const y0 = Math.floor(rect.y / this.cellSize);
    const x1 = Math.floor((rect.x + rect.width) / this.cellSize);
    const y1 = Math.floor((rect.y + rect.height) / this.cellSize);

    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        this.getCell(x, y).delete(obj);
      }
    }

    this.rects.delete(obj);
  }

  replace(obj: T, newRect: SpatialRect) {
    this.remove(obj);
    this.insert(obj, newRect);
  }

  queryByObject(obj: T) {
    const rect = this.rects.get(obj);
    if (!rect) {
      return new Set<T>();
    }
    return this.queryByRect(rect);
  }

  queryByRect(rect: SpatialRect) {
    const result = new Set<T>();
    const x0 = Math.floor(rect.x / this.cellSize);
    const y0 = Math.floor(rect.y / this.cellSize);
    const x1 = Math.floor((rect.x + rect.width) / this.cellSize);
    const y1 = Math.floor((rect.y + rect.height) / this.cellSize);

    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const cell = this.cells.get(this.key(x, y));
        if (cell) {
          for (const obj of cell) {
            result.add(obj);
          }
        }
      }
    }
    return result;
  }
}
