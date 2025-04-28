import { CartContext } from "../../AppContext";
import MenuItemTile from "./MenuItemTile";
import Image from "next/image";
import { useContext, useState, useEffect } from "react";
import FlyingButton from "react-flying-item";
import toast from "react-hot-toast";

export default function MenuItem(menuItem) {
  const { image, name, description, basePrice, sizes, extraIngredientPrices } = menuItem;
  const [selectedSize, setSelectedSize] = useState(sizes?.[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const popup = document.getElementById('menu-item-popup');
        if (popup) {
          popup.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }
      }, 50);
      return () => document.body.style.overflow = '';
    }
  }, [showPopup]);

  function handleAddToCartButtonClick() {
    const hasOptions = sizes?.length > 0 || extraIngredientPrices?.length > 0;
    if (hasOptions && !showPopup) {
      setShowPopup(true);
      return;
    }
    addToCart(menuItem, selectedSize, selectedExtras);
    toast.success('Added to cart!');
    setShowPopup(false);
  }

  function handleExtraThingClick(ev, extraThing) {
    if (ev.target.checked) {
      setSelectedExtras(prev => [...prev, extraThing]);
    } else {
      setSelectedExtras(prev => prev.filter(e => e.name !== extraThing.name));
    }
  }

  let selectedPrice = basePrice;
  if (selectedSize) {
    selectedPrice += selectedSize.price;
  }
  if (selectedExtras?.length > 0) {
    for (const extra of selectedExtras) {
      selectedPrice += extra.price;
    }
  }

  return (
    <>
      <MenuItemTile
        onAddToCart={handleAddToCartButtonClick}
        {...menuItem}
      />
      
      {showPopup && (
        <div 
          id="menu-item-popup"
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPopup(false)}
        >
          <div 
            className="bg-white rounded-lg w-full max-w-2xl flex flex-col"
            style={{ 
              maxHeight: '90vh',
              '@media (max-height: 600px)': {
                maxHeight: '95vh'
              }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Horizontal Split Section */}
            <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
              {/* Left Column - Image & Name (40%) */}
              <div className="md:w-2/5 p-4 flex flex-col border-b md:border-b-0 md:border-r border-gray-200">
                <div className="relative aspect-square">
                  <Image
                    src={image}
                    fill
                    alt={name}
                    className="object-cover rounded-lg"
                  />
                </div>
                <h2 className="text-xl font-bold mt-4 text-center">{name}</h2>
                <p className="text-gray-500 text-sm mt-2 text-center">{description}</p>
              </div>

              {/* Right Column - Options (60%) */}
              <div className="md:w-3/5 p-4 overflow-y-auto">
                {sizes?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Select Size</h3>
                    {sizes.map(size => (
                      <label key={size._id} className="flex items-center gap-3 p-3 border rounded-lg mb-2">
                        <input
                          type="radio"
                          onChange={() => setSelectedSize(size)}
                          checked={selectedSize?.name === size.name}
                          className="h-5 w-5"
                        />
                        <span className="flex-1">{size.name}</span>
                        <span>+${size.price}</span>
                      </label>
                    ))}
                  </div>
                )}

                {extraIngredientPrices?.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Extra Ingredients</h3>
                    {extraIngredientPrices.map(extra => (
                      <label key={extra._id} className="flex items-center gap-3 p-3 border rounded-lg mb-2">
                        <input
                          type="checkbox"
                          onChange={ev => handleExtraThingClick(ev, extra)}
                          checked={selectedExtras.some(e => e._id === extra._id)}
                          className="h-5 w-5"
                        />
                        <span className="flex-1">{extra.name}</span>
                        <span>+${extra.price}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Full-width Button Section */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPopup(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <FlyingButton
  targetTop={'5%'}
  targetLeft={'95%'}
  src={image}
  flyingItemStyling={{
    width: '50px',
    height: 'auto',
    borderRadius: '50%',
  }}
>
  <div
    onClick={handleAddToCartButtonClick}
    className="flex-1 py-3 bg-primary text-white rounded-lg font-medium w-full text-center cursor-pointer"
  >
    Add to Cart ${selectedPrice}
  </div>
</FlyingButton>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}