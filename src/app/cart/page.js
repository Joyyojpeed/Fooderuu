"use client";
import { CartContext, cartProductPrice } from "../components/AppContext";
import AddressInputs from "../components/layout/AddressInputs";
import SectionHeaders from "../components/layout/SectionHeaders";
import CartProduct from "../components/layout/Menu/CartProduct";
import { useProfile } from "../components/UseProfile";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Script from "next/script";

export default function CartPage() {
  const { cartProducts, removeCartProduct } = useContext(CartContext);
  const [address, setAddress] = useState({});
  const [isClient, setIsClient] = useState(false);
  const { data: profileData } = useProfile();

  useEffect(() => {
    setIsClient(true);
    if (window.location.href.includes("canceled=1")) {
      toast.error("Payment failed");
      window.history.replaceState(null, '', '/cart');
    }
  }, []);

  useEffect(() => {
    if (profileData?.city) {
      setAddress({
        phone: profileData.phone || '',
        streetAddress: profileData.streetAddress || '',
        city: profileData.city || '',
        postalCode: profileData.postalCode || '',
        country: profileData.country || ''
      });
    }
  }, [profileData]);

  let subtotal = 0;
  for (const p of cartProducts) {
    subtotal += cartProductPrice(p);
  }
  const total = subtotal + 50; // ₹50 delivery fee

  function handleAddressChange(propName, value) {
    setAddress(prev => ({ ...prev, [propName]: value }));
  }

  async function verifyPayment(response) {
    const res = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response)
    });
    return res.ok;
  }

  async function proceedToCheckout(ev) {
    ev.preventDefault();

    if (!isClient) {
      toast.error("Please wait while we initialize payment");
      return;
    }

    const requiredFields = ['phone', 'streetAddress', 'city', 'postalCode', 'country'];
    if (requiredFields.some(field => !address[field])) {
      toast.error("Please fill all address fields");
      return;
    }

    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, cartProducts })
        });

        if (!response.ok) throw new Error('Checkout failed');
        const data = await response.json();

        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: "Your Food App",
          description: "Order Payment",
          order_id: data.orderId,
          handler: async (response) => {
            const verified = await verifyPayment(response);
            if (verified) {
              document.body.style.overflow = 'auto'; // Ensure scroll restored
              window.location.href = `/orders/${data.dbOrderId}?clear-cart=1`;
            } else {
              document.body.style.overflow = 'auto';
              window.location.href = '/cart?canceled=1';
            }
          },
          prefill: {
            name: profileData?.name || '',
            email: profileData?.email || '',
            contact: address.phone || ''
          },
          theme: { color: "#3399cc" }
        };

        // Disable background scroll
        document.body.style.overflow = 'hidden';

        const rzp = new window.Razorpay(options);

        // Restore scroll if user closes the modal manually
        rzp.on('modal.closed', () => {
          document.body.style.overflow = 'auto';
        });

        rzp.on('payment.failed', () => {
          document.body.style.overflow = 'auto';
          window.location.href = '/cart?canceled=1';
        });

        // Optional: scroll to top to ensure visibility of modal
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);

        rzp.open();
        resolve();

      } catch (err) {
        console.error('Checkout error:', err);
        document.body.style.overflow = 'auto';
        reject(err.message || 'Payment failed');
      }
    });

    await toast.promise(promise, {
      loading: "Preparing payment...",
      success: "Redirecting to payment...",
      error: err => err
    });
  }

  if (cartProducts?.length === 0) {
    return (
      <section className="mt-8 text-center">
        <SectionHeaders mainHeader="Cart" />
        <p className="mt-4">Your cart is empty</p>
      </section>
    );
  }

  return (
    <>
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js" 
        strategy="afterInteractive"
      />
      
      <section className="mt-8">
        <div className="text-center">
          <SectionHeaders mainHeader="Cart" />
        </div>
        <div className="mt-8 grid gap-8 grid-cols-2 max-md:grid-cols-1">
          <div>
            {cartProducts.map((product, index) => (
              <CartProduct
                key={index}
                product={product}
                onRemove={() => removeCartProduct(index)}
              />
            ))}
            <div className="py-2 pr-16 flex justify-end items-center">
              <div className="text-gray-500">
                Subtotal: <br />
                Delivery: <br />
                Total:
              </div>
              <div className="font-semibold pl-2 text-right">
                ₹{subtotal} <br />
                ₹50 <br />
                ₹{total}
              </div>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Checkout</h2>
            <form onSubmit={proceedToCheckout}>
              <AddressInputs
                addressProps={address}
                setAddressProp={handleAddressChange}
              />
              <button
                type="submit"
                className="mt-4 bg-primary text-white px-6 py-2 rounded-full w-full"
              >
                Pay ₹{total}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
