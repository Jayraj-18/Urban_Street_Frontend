import { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case "SET_CART":
      return action.payload;

    case "ADD_TO_CART": {
      const payloadId = action.payload._id || action.payload.id;
      const size = action.payload.size;
      const cartKey = `${payloadId}-${size}`;

      const existing = state.find((item) => `${item._id || item.id}-${item.size}` === cartKey);

      if (existing) {
        // If already in cart with same size, just increase quantity
        return state.map((item) =>
          `${item._id || item.id}-${item.size}` === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Otherwise add fresh with quantity 1
      return [...state, { ...action.payload, id: payloadId, quantity: 1 }];
    }

    case "INCREASE_QTY":
      return state.map((item) => {
        const itemKey = `${item._id || item.id}-${item.size}`;
        return itemKey === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item;
      });

    case "DECREASE_QTY":
      return state
        .map((item) => {
          const itemKey = `${item._id || item.id}-${item.size}`;
          return itemKey === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item;
        })
        .filter((item) => item.quantity > 0); // auto-remove if qty hits 0

    case "REMOVE_ITEM":
      return state.filter((item) => `${item._id || item.id}-${item.size}` !== action.payload);

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth();

  const [cart, dispatch] = useReducer(cartReducer, []);

  // Load user-specific cart from localStorage when user changes
  useEffect(() => {
    if (user) {
      try {
        const userId = user.id || user._id;
        const stored = localStorage.getItem(`cart_${userId}`);
        dispatch({ type: "SET_CART", payload: stored ? JSON.parse(stored) : [] });
      } catch {
        dispatch({ type: "SET_CART", payload: [] });
      }
    } else {
      dispatch({ type: "SET_CART", payload: [] });
    }
  }, [user]);

  // Persist cart to user-specific localStorage whenever it changes
  useEffect(() => {
    if (user) {
      const userId = user.id || user._id;
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (product) =>
    dispatch({ type: "ADD_TO_CART", payload: product });

  const increaseQty = (id) =>
    dispatch({ type: "INCREASE_QTY", payload: id });

  const decreaseQty = (id) =>
    dispatch({ type: "DECREASE_QTY", payload: id });

  const removeItem = (id) =>
    dispatch({ type: "REMOVE_ITEM", payload: id });

  const clearCart = () =>
    dispatch({ type: "CLEAR_CART" });

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook for easy usage
export function useCart() {
  return useContext(CartContext);
}