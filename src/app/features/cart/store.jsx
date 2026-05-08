import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getEquipmentSnapshot, calculateRentalDays } from '../rentals/store';

const CartContext = createContext(null);

const STORAGE_KEY = 'equipment-platform.cart';
const SERVICE_FEE_RATE = 0.05;

function readStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function buildCartItem(input) {
  const equipmentId = Number(input.product.id);
  const equipment = getEquipmentSnapshot(equipmentId);
  const days = calculateRentalDays(input.startDate, input.endDate);
  if (!days) return null;

  const rentalAmount = days * equipment.dailyRate;
  const serviceFee = Math.round(rentalAmount * SERVICE_FEE_RATE);

  return {
    id: equipmentId,
    equipmentId,
    ownerId: equipment.ownerId,
    name: equipment.name,
    image: equipment.image,
    owner: equipment.ownerName,
    location: equipment.location,
    category: equipment.category,
    startDate: input.startDate,
    endDate: input.endDate,
    days,
    dailyRate: equipment.dailyRate,
    deposit: equipment.insuranceAmount,
    serviceFee,
    rentalAmount,
    totalAmount: rentalAmount + equipment.insuranceAmount + serviceFee,
    notes: input.notes,
  };
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => readStorage(STORAGE_KEY, []));

  useEffect(() => {
    writeStorage(STORAGE_KEY, cartItems);
  }, [cartItems]);

  useEffect(() => {
    const handler = (event) => {
      if (event.key === STORAGE_KEY) {
        setCartItems(readStorage(STORAGE_KEY, []));
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const addToCartFromProduct = (input) => {
    const item = buildCartItem(input);
    if (!item) return null;
    setCartItems([item]);
    return item;
  };

  const removeCartItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = useMemo(() => ({
    cartItems,
    addToCartFromProduct,
    removeCartItem,
    clearCart,
  }), [cartItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}

export function useCartTotal() {
  const { cartItems } = useCart();
  return useMemo(() => {
    return cartItems.reduce((total, item) => total + item.totalAmount, 0);
  }, [cartItems]);
}
