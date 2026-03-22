export interface ReadingOrderData {
  selector: string;
  domIndex: number;
  visualIndex: number;
  tag: string;
  text: string;
  cssOrder: string | null;
  position: string;
  displaced: boolean;
}

export interface ReadingOrderResult {
  items: ReadingOrderData[];
  kendallTau: number;
  totalElements: number;
}
