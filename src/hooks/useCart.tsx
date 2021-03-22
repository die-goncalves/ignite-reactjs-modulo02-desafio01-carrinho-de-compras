import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    // Inicializar o estado cart com o valor da key @RocketShoes:cart do localStorage caso ele exista.
    const storagedCart = localStorage.getItem('@RocketShoes:cart');
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }
    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const responseStock = await api.get(`stock/${productId}`);
          
      const specificProduct = cart.find((specificProduct) => specificProduct.id === productId);
      let addProductInCart: Product[] = [];

      if (specificProduct) {
        // Verificar se existe no estoque a quantidade desejada do produto
        if(specificProduct.amount >= responseStock.data.amount || responseStock.data.amount <= 1) {
          toast.error("Quantidade solicitada fora de estoque");
          return
        }

        addProductInCart = cart.map((product: Product) => {
          if (product.id === productId) {
              product.amount += 1;
          }
          return product;
        })
        setCart(addProductInCart);
        localStorage.setItem(`@RocketShoes:cart`, JSON.stringify(addProductInCart));
      
      } else {
        // Verificar se existe no estoque a quantidade desejada do produto
        if(responseStock.data.amount < 1) {
          toast.error("Quantidade solicitada fora de estoque");
          return
        }
        const responseProduct = await api.get(`products/${productId}`);
        const productWithAmount = {...responseProduct.data, amount: 1};

        addProductInCart = [...cart, productWithAmount];
        setCart(addProductInCart);
        localStorage.setItem(`@RocketShoes:cart`, JSON.stringify(addProductInCart));
      }
    } catch {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
