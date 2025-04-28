'use client';
import { CartContext, cartProductPrice } from "@/app/components/AppContext";
import AddressInputs from "@/app/components/layout/AddressInputs";
import SectionHeaders from "@/app/components/layout/SectionHeaders";
import CartProduct from "@/app/components/layout/Menu/CartProduct";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function OrderPage() {
  const { clearCart } = useContext(CartContext);
  const [order, setOrder] = useState();
  const [loadingOrder, setLoadingOrder] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.href.includes('clear-cart=1')) {
        clearCart();
      }
    }
    if (id) {
      setLoadingOrder(true);
      fetch('/api/orders?_id=' + id).then(res => {
        res.json().then(orderData => {
          setOrder(orderData);
          setLoadingOrder(false);
        });
      });
    }
  }, []);

  let subtotal = 0;
  if (order?.cartProducts) {
    for (const product of order.cartProducts) {
      subtotal += cartProductPrice(product);
    }
  }

  return (
    <section className="max-w-6xl mx-auto mt-4 md:mt-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <SectionHeaders mainHeader="Your order" />
        <div className="mt-4 mb-6 md:mb-8">
          <p className="text-gray-600">Thanks for your order.</p>
          <p className="text-gray-600">We will call you when your order will be on the way.</p>
        </div>
      </div>

      {loadingOrder && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading order details...</p>
        </div>
      )}

      {order && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-4">
            {order.cartProducts.map((product, index) => (
              <CartProduct 
                key={`${product._id}-${index}`} 
                product={product} 
                className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
              />
            ))}
            <div className="text-right py-4 space-y-2">
              <div className="flex justify-end items-center gap-4">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-black font-bold w-20 text-left">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-end items-center gap-4">
                <span className="text-gray-600">Delivery:</span>
                <span className="text-black font-bold w-20 text-left">$5.00</span>
              </div>
              <div className="flex justify-end items-center gap-4 pt-2 border-t border-gray-200">
                <span className="text-gray-600 font-medium">Total:</span>
                <span className="text-black font-bold w-20 text-left">
                  ${(subtotal + 5).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-4">Delivery Information</h3>
              <AddressInputs
                disabled={true}
                addressProps={order}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}