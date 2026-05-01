import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  readonly products: Product[] = [
    { id: 1, name: 'Polo Naruto Hokage', cat: 'Anime', sub: 'Naruto', type: 'Polo', price: 45, emoji: '🎌', badge: 'Nuevo', colors: ['#111', '#f5f5f5', '#e63329'], desc: 'Polo premium 100% algodón con estampado de Naruto Hokage. Serigrafía de alta calidad, resistente al lavado.', stock: 24 },
    { id: 2, name: 'Hoodie Dragon Ball Super', cat: 'Anime', sub: 'Dragon Ball', type: 'Hoodie', price: 85, emoji: '🐉', badge: 'Top', colors: ['#111', '#f5f5f5', '#e8a000'], desc: 'Hoodie oversize con diseño de Dragon Ball Super. Tela fleece suave y abrigada, ideal para fans del anime.', stock: 18 },
    { id: 3, name: 'Polo Valorant Agent', cat: 'Videojuegos', sub: 'Valorant', type: 'Polo', price: 50, emoji: '🎮', badge: null, colors: ['#111', '#e63329'], desc: 'Polo gaming con diseño de agente de Valorant. Corte moderno, tela transpirable.', stock: 32 },
    { id: 4, name: 'Hoodie Attack on Titan', cat: 'Anime', sub: 'Attack on Titan', type: 'Hoodie', price: 80, emoji: '⚔️', badge: 'Trending', colors: ['#111', '#556b2f'], desc: 'Hoodie con el símbolo Survey Corps de AoT. Diseño minimalista y elegante.', stock: 14 },
    { id: 5, name: 'Polo Breaking Bad', cat: 'Películas', sub: 'Breaking Bad', type: 'Polo', price: 48, emoji: '🧪', badge: null, colors: ['#111', '#f5f5f5', '#1a6600'], desc: 'Polo con diseño inspirado en Breaking Bad. Para los fans de Walter White.', stock: 20 },
    { id: 6, name: 'Polo Marvel Avengers', cat: 'Películas', sub: 'Marvel', type: 'Polo', price: 52, emoji: '🦸', badge: 'Nuevo', colors: ['#111', '#e63329', '#1a4a9a'], desc: 'Polo con artwork oficial de los Avengers. Edición limitada.', stock: 28 },
    { id: 7, name: 'Hoodie Resident Evil', cat: 'Videojuegos', sub: 'Resident Evil', type: 'Hoodie', price: 78, emoji: '🧟', badge: null, colors: ['#111', '#e63329'], desc: 'Hoodie con diseño del logo clásico de Resident Evil. Perfecto para gamers.', stock: 10 },
    { id: 8, name: 'Polo Rock Classic', cat: 'Música', sub: 'Rock', type: 'Polo', price: 44, emoji: '🎸', badge: null, colors: ['#111', '#f5f5f5'], desc: 'Polo con diseño de bandas de rock clásico. Edición especial coleccionable.', stock: 35 },
    { id: 9, name: 'Polo One Piece Luffy', cat: 'Anime', sub: 'One Piece', type: 'Polo', price: 46, emoji: '🏴‍☠️', badge: 'Top', colors: ['#111', '#f5f5f5', '#e8a000'], desc: 'Polo con el sombrero de paja de Monkey D. Luffy. Para nakamas.', stock: 22 },
    { id: 10, name: 'Hoodie K-pop BTS', cat: 'Música', sub: 'K-pop', type: 'Hoodie', price: 82, emoji: '🎤', badge: 'Nuevo', colors: ['#111', '#f5f5f5', '#e63329'], desc: 'Hoodie oficial inspirado en BTS. Para ARMYs y fans del K-pop.', stock: 16 },
    { id: 11, name: 'Polo Dota 2', cat: 'Videojuegos', sub: 'Dota 2', type: 'Polo', price: 49, emoji: '🗡️', badge: null, colors: ['#111', '#e63329'], desc: 'Polo con diseño de Dota 2. Cómodo y con excelente impresión.', stock: 12 },
    { id: 12, name: 'Hoodie Star Wars', cat: 'Películas', sub: 'Star Wars', type: 'Hoodie', price: 88, emoji: '⚡', badge: 'Trending', colors: ['#111', '#333', '#f5f5f5'], desc: 'Hoodie May the Force be with you. Edición especial del universo Star Wars.', stock: 9 }
  ];

  byId(id: number): Product | undefined {
    return this.products.find((product) => product.id === id);
  }

  filter(term: string): Product[] {
    if (!term || term === 'Todos') return this.products;
    const normalized = term.toLowerCase();
    return this.products.filter((product) =>
      product.cat.toLowerCase().includes(normalized) ||
      product.sub.toLowerCase().includes(normalized) ||
      product.type.toLowerCase().includes(normalized) ||
      product.name.toLowerCase().includes(normalized)
    );
  }
}
