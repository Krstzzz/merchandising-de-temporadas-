export interface BackendCategoria {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface BackendProductoTalla {
  id: number;
  talla: string;
}

export interface BackendProductoColor {
  id: number;
  color: string;
}

export interface BackendProduct {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  estado: "DISPONIBLE" | "POCAS_UNIDADES" | "NO_DISPONIBLE";
  subcategoria: string;
  imagenUrl: string | null;
  categoria: BackendCategoria;
  tallas: BackendProductoTalla[];
  colores: BackendProductoColor[];
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CreateProductRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  subcategoria: string;
  imagenUrl: string | null;
  categoriaId: number;
  tallas: string[];
  colores: string[];
}

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
  sizes: string[];
  desc: string;
  stock: number;
  imageUrl: string | null;
  estado: string;
  categoriaId: number;
}

export interface CartItem extends Product {
  size: string;
  color: string;
  qty: number;
}

export function mapBackendProduct(product: BackendProduct): Product {
  return {
    id: product.id,
    name: product.nombre,
    cat: product.categoria?.nombre ?? "Sin categoría",
    sub: product.subcategoria,
    type: inferType(product.nombre),
    price: Number(product.precio),
    emoji: inferEmoji(product.categoria?.nombre),
    badge: product.estado === "POCAS_UNIDADES" ? "Pocas unidades" : null,
    colors: product.colores?.map((item) => item.color) ?? [],
    sizes: product.tallas?.map((item) => item.talla) ?? [],
    desc: product.descripcion,
    stock: product.stock,
    imageUrl: product.imagenUrl,
    estado: product.estado,
    categoriaId: product.categoria?.id,
  };
}

function inferType(nombre: string): string {
  return nombre.toLowerCase().includes("hoodie") ? "Hoodie" : "Polo";
}

function inferEmoji(categoria?: string): string {
  if (!categoria) return "👕";
  const normalized = categoria.toLowerCase();

  if (normalized.includes("anime")) return "🎌";
  if (normalized.includes("videojuego")) return "🎮";
  if (normalized.includes("película") || normalized.includes("serie"))
    return "🎬";
  if (normalized.includes("música")) return "🎵";

  return "👕";
}

export interface BackendSubcategoria {
  id: number;
  nombre: string;
  categoria: BackendCategoria;
}

export interface CreateSubcategoriaRequest {
  nombre: string;
  categoriaId: number;
}

export interface BackendProductoVariante {
  id: number;
  colorHex: string;
  talla: string;
  stock: number;
  precio: number | null;
  sku: string | null;
}

export interface CreateProductoVarianteRequest {
  productoId: number;
  colorHex: string;
  talla: string;
  stock: number;
  precio: number | null;
  sku: string | null;
}

export interface BackendProductoImagen {
  id: number;
  imagenUrl: string;
  colorHex: string | null;
  principal: boolean;
  orden: number;
}

export interface BackendSubcategoria {
  id: number;
  nombre: string;
  categoria: BackendCategoria;
}

export interface CreateSubcategoriaRequest {
  nombre: string;
  categoriaId: number;
}

export interface BackendProductoVariante {
  id: number;
  colorHex: string;
  talla: string;
  stock: number;
  precio: number | null;
  sku: string | null;
}

export interface CreateProductoVarianteRequest {
  productoId: number;
  colorHex: string;
  talla: string;
  stock: number;
  precio: number | null;
  sku: string | null;
}

export interface BackendProductoImagen {
  id: number;
  imagenUrl: string;
  colorHex: string | null;
  principal: boolean;
  orden: number;
}

export interface CreateCategoriaRequest {
  nombre: string;
  descripcion: string;
}
