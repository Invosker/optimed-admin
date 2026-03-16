import React, { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Button from "@/Components/Button";
import TextField from "@/Components/Input/Input";
import {
  FaSearch,
  FaShoppingCart,
  FaMinus,
  FaPlus,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import testshampoo from "@/assets/testshampoo.png";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  rating?: number;
};

type Cart = Record<number, number>; // productId -> qty

const DEFAULT_CATEGORIES = [
  "Todos",
  "Cuidado personal",
  "Bebidas",
  "Limpieza",
  "Salud visual",
  "Monturas",
  "Lentes de contacto",
  "Accesorios",
  "Soluciones",
  "Protección solar",
  "Estuches",
  "Herramientas",
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Kotex toallas sanitarias",
    category: "Cuidado personal",
    price: 200,
    stock: 8,
    image: testshampoo,
    rating: 5,
  },
  {
    id: 2,
    name: "Pasta dental Colgate",
    category: "Cuidado personal",
    price: 100,
    stock: 12,
    image: testshampoo,
    rating: 5,
  },
  {
    id: 3,
    name: "Gillette Desodorante",
    category: "Cuidado personal",
    price: 689,
    stock: 10,
    image: testshampoo,
    rating: 4,
  },
  {
    id: 4,
    name: "Palmolive Jabón",
    category: "Cuidado personal",
    price: 220,
    stock: 15,
    image: testshampoo,
    rating: 4,
  },
  {
    id: 5,
    name: "Lady Speed Stick Desodorante",
    category: "Cuidado personal",
    price: 200,
    stock: 9,
    image: testshampoo,
    rating: 5,
  },
  {
    id: 6,
    name: "Head & Shoulders Shampoo",
    category: "Cuidado personal",
    price: 720,
    stock: 7,
    image: testshampoo,
    rating: 4,
  },
  {
    id: 7,
    name: "Gatorade",
    category: "Bebidas",
    price: 150,
    stock: 20,
    image: testshampoo,
    rating: 4,
  },
  {
    id: 8,
    name: "Coca Cola",
    category: "Bebidas",
    price: 120,
    stock: 30,
    image: testshampoo,
    rating: 5,
  },
];

function CategoryChips({
  categories,
  selected,
  onSelect,
}: {
  categories: string[];
  selected: string;
  onSelect: (c: string) => void;
}) {
  return (
    <div className="flex gap-2 my-3 overflow-x-auto scrollbar-hide px-1 -mx-1">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`px-3 py-1.5 rounded-full border text-sm whitespace-nowrap transition
            ${
              selected === cat
                ? "bg-optimed-tiber text-white border-optimed-tiber"
                : "bg-gray-100 text-optimed-tiber border-gray-200"
            }`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

function ProductCard({
  product,
  qty,
  onAdd,
  onRemove,
  onAddOne,
}: {
  product: Product;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
  onAddOne: () => void;
}) {
  return (
    <div className="flex flex-col items-center bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
      <img
        src={product.image}
        alt={product.name}
        className="w-24 h-24 object-contain rounded-lg mb-2"
      />
      <div className="font-semibold text-optimed-tiber text-center mb-1">
        {product.name}
      </div>
      <div className="text-xs text-gray-500 mb-1">{product.category}</div>
      <div className="text-lg font-bold text-optimed-tiber mb-2">
        Bs. {product.price.toFixed(2)}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <Button size="sm" color="secondary" onClick={onRemove} disabled={!qty}>
          -
        </Button>
        <span className="font-bold text-optimed-tiber">{qty || 0}</span>
        <Button
          size="sm"
          color="primary"
          onClick={onAddOne}
          disabled={qty >= product.stock}
        >
          +
        </Button>
      </div>
      <div className="text-xs text-gray-400 mb-2">Stock: {product.stock}</div>
      <Button
        color="primary"
        className="w-full"
        onClick={onAdd}
        disabled={qty >= product.stock}
      >
        Agregar
      </Button>
    </div>
  );
}

function CartSummary({
  products,
  cart,
  onInc,
  onDec,
  onRemove,
  onClear,
}: {
  products: Product[];
  cart: Cart;
  onInc: (id: number) => void;
  onDec: (id: number) => void;
  onRemove: (id: number) => void;
  onClear: () => void;
}) {
  const cartList = products.filter((p) => cart[p.id]);
  const subtotal = cartList.reduce(
    (acc, p) => acc + p.price * (cart[p.id] || 0),
    0
  );
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  return (
    <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-xl p-4 md:p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-optimed-tiber">Tu orden</h3>
        <button
          className="text-sm text-red-500 hover:text-red-600"
          onClick={onClear}
        >
          Limpiar
        </button>
      </div>

      {cartList.length === 0 ? (
        <div className="text-sm text-gray-400 text-center py-6">
          Tu carrito está vacío
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
          {cartList.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-[56px_1fr_auto] gap-3 items-center"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-14 h-14 rounded-lg object-contain bg-gray-50 p-1"
              />
              <div>
                <div className="text-sm font-semibold text-optimed-tiber">
                  {p.name}
                </div>
                <div className="text-xs text-gray-500">
                  Bs. {p.price.toFixed(2)}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <button
                    className="px-2 py-1 rounded bg-gray-100"
                    onClick={() => onDec(p.id)}
                  >
                    <FaMinus />
                  </button>
                  <span className="text-sm font-semibold text-optimed-tiber">
                    {cart[p.id]}
                  </span>
                  <button
                    className="px-2 py-1 rounded bg-gray-100"
                    onClick={() => onInc(p.id)}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-optimed-tiber">
                  Bs. {(p.price * (cart[p.id] || 0)).toFixed(2)}
                </div>
                <button
                  className="mt-2 text-xs text-red-500 hover:text-red-600 inline-flex items-center gap-1"
                  onClick={() => onRemove(p.id)}
                >
                  <FaTrash /> Quitar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="h-px bg-gray-200 my-4" />
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-semibold text-gray-700">
          Bs. {subtotal.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-600">IVA (16%)</span>
        <span className="font-semibold text-gray-700">
          Bs. {iva.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between text-base">
        <span className="font-bold text-gray-800">Total</span>
        <span className="font-extrabold text-optimed-tiber">
          Bs. {total.toFixed(2)}
        </span>
      </div>

      <Button color="primary" className="w-full mt-4">
        Continuar
      </Button>
    </div>
  );
}

export default function PublicSearchPOS() {
  const methods = useForm();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [cart, setCart] = useState<Cart>({});
  const [showCartMobile, setShowCartMobile] = useState(false);

  const products = MOCK_PRODUCTS;

  // Unimos categorías por defecto + categorías existentes en productos (sin duplicados)
  const categories = useMemo(() => {
    const fromProducts = Array.from(new Set(products.map((p) => p.category)));
    const union = Array.from(
      new Set([...DEFAULT_CATEGORIES, ...fromProducts])
    );
    return union;
  }, [products]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return products.filter((p) => {
      const byCat =
        selectedCategory === "Todos" || p.category === selectedCategory;
      const bySearch = !s || p.name.toLowerCase().includes(s);
      return byCat && bySearch;
    });
  }, [products, search, selectedCategory]);

  const inc = (id: number) =>
    setCart((c) => {
      const prod = products.find((p) => p.id === id);
      const next = (c[id] || 0) + 1;
      return prod && next <= prod.stock ? { ...c, [id]: next } : c;
    });

  const dec = (id: number) =>
    setCart((c) => {
      const next = Math.max((c[id] || 0) - 1, 0);
      const { [id]: _, ...rest } = c;
      return next === 0 ? rest : { ...c, [id]: next };
    });

  const removeLine = (id: number) =>
    setCart((c) => {
      const { [id]: _, ...rest } = c;
      return rest;
    });

  const clear = () => setCart({});

  const subtotal = useMemo(
    () => products.reduce((acc, p) => acc + (cart[p.id] ? p.price * cart[p.id] : 0), 0),
    [products, cart]
  );

  return (
    <FormProvider {...methods}>
      <main className="h-[100dvh] w-full overflow-x-hidden bg-gradient-to-br from-blue-50 via-white to-optimed-tiber/60 flex flex-col">
        <header className="px-4 py-4 md:px-8 bg-optimed-tiber text-white shrink-0">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-extrabold tracking-wide">Optimed</h1>
            <div className="hidden md:flex items-center gap-2 opacity-90">
              <FaShoppingCart />
              <span className="text-sm">Total: Bs. {subtotal.toFixed(2)}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <section className="max-w-7xl mx-auto w-full px-3 md:px-6 py-4 md:py-8 grid grid-cols-1 md:grid-cols-[1fr_380px] gap-4 pb-40 md:pb-8">
            {/* Buscador + productos */}
            <div>
              <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-end">
                  <div className="flex-1">
                    <TextField
                      name="search"
                      label="Buscar productos"
                      placeholder="Buscar por nombre..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      iconLeft={<FaSearch className="text-gray-400" />}
                    />
                  </div>
                  <div className="md:w-auto">
                    <Button className="md:hidden self-end" onClick={() => setShowCartMobile(true)}>
                      <div className="flex items-center gap-2">
                        <FaShoppingCart />
                        <span>Carrito</span>
                      </div>
                    </Button>
                  </div>
                </div>

                <CategoryChips
                  categories={categories}
                  selected={selectedCategory}
                  onSelect={setSelectedCategory}
                />

                {/* Grid de productos */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {filtered.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      qty={cart[p.id] || 0}
                      onAdd={() => inc(p.id)}
                      onRemove={() => dec(p.id)}
                      onAddOne={() => inc(p.id)}
                    />
                  ))}
                  {filtered.length === 0 && (
                    <div className="col-span-full text-center text-gray-400 py-8">
                      No hay productos para mostrar.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar md+ */}
            <aside className="hidden md:block sticky top-6 h-max">
              <CartSummary
                products={products}
                cart={cart}
                onInc={inc}
                onDec={dec}
                onRemove={removeLine}
                onClear={clear}
              />
            </aside>
          </section>
        </div>

        {/* Bottom sheet carrito */}
        <div
          className={`fixed inset-x-0 bottom-0 z-50 md:hidden transition-transform duration-300
            ${showCartMobile ? "translate-y-0 pointer-events-auto" : "translate-y-full pointer-events-none"}`}
        >
          <div className="bg-white rounded-t-2xl shadow-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-bold text-optimed-tiber">Tu orden</h4>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowCartMobile(false)}
                aria-label="Cerrar"
              >
                <FaTimes size={18} />
              </button>
            </div>
            <CartSummary
              products={products}
              cart={cart}
              onInc={inc}
              onDec={dec}
              onRemove={removeLine}
              onClear={clear}
            />
          </div>
        </div>

        {/* Barra fija inferior móvil  */}
        <div className="fixed bottom-3 inset-x-3 md:hidden">
          <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-full shadow-lg px-4 py-2 flex items-center justify-between">
            <span className="text-sm text-gray-700">
              Total: <span className="font-bold text-optimed-tiber">Bs. {subtotal.toFixed(2)}</span>
            </span>
            <Button onClick={() => setShowCartMobile(true)}>
              <div className="flex items-center gap-2">
                <FaShoppingCart />
                Ver carrito
              </div>
            </Button>
          </div>
        </div>
      </main>
    </FormProvider>
  );
}
