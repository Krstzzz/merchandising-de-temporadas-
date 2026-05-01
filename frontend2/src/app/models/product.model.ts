export interface Product {
  id: number;
  name: string;
  cat: string;
  sub: string;
  type: string;
  price: number;
  emoji: string;
  badge: string | null;
  colors: string[];
  desc: string;
  stock: number;
}

export interface CartItem extends Product {
  size: string;
  color: string;
  qty: number;
}
