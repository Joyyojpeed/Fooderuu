import { cartProductPrice } from "../../AppContext";
import Trash from "../icons/Trash";
import Image from "next/image";

export default function CartProduct({product, onRemove, index}) { // Add index prop
  return (
    <div className="flex items-center gap-4 border-b py-4">
     <div className="w-24">
  {product?.image ? (
    <Image 
      width={240} 
      height={240} 
      src={product.image} 
      alt={product.name || 'Menu item'} 
    />
  ) : (
    <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
      <span className="text-gray-500 text-xs">No image</span>
    </div>
  )}
</div>
      <div className="grow">
        <h3 className="font-semibold">
          {product.name}
        </h3>
        {product.size && (
          <div className="text-sm">
            Size: <span>{product.size.name}</span>
          </div>
        )}
        {product.extras?.length > 0 && (
          <div className="text-sm text-gray-500">
            {product.extras.map(extra => (
              <div key={extra.name}>{extra.name} ${extra.price}</div>
            ))}
          </div>
        )}
      </div>
      <div className="text-lg font-semibold">
        ${cartProductPrice(product)}
      </div>
      {!!onRemove && (
        <div className="ml-2">
<button
  type="button"
  onClick={() => onRemove(index)}  // Ensure index is passed correctly
  className="p-2 hover:text-red-500 transition-colors"
>
  <Trash />
</button>
        </div>
      )}
    </div>
  );
}