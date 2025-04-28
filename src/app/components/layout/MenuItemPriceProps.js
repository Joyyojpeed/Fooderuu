import ChevronDown from "./icons/ChevronDown";
import ChevronUp from "./icons/ChevronUp";
import Plus from "./icons/Plus";
import Trash from "./icons/Trash";
import {useState} from "react";

export default function MenuItemPriceProps({name,addLabel,props,setProps}) {

  const [isOpen, setIsOpen] = useState(false);

  function addProp() {
    setProps(oldProps => {
      return [...oldProps, {name:'', price:0}];
    });
  }

  function editProp(ev, index, prop) {
    const newValue = ev.target.value;
    setProps(prevSizes => {
      const newSizes = [...prevSizes];
      newSizes[index][prop] = newValue;
      return newSizes;
    });
  }

  function removeProp(indexToRemove) {
    setProps(prev => prev.filter((v,index) => index !== indexToRemove));
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between text-left font-medium text-gray-700 hover:text-gray-900"
        type="button"
      >
        <span>
          {name} <span className="text-gray-500">({props?.length})</span>
        </span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      
      <div className={`mt-3 space-y-3 ${isOpen ? 'block' : 'hidden'}`}>
{props?.length > 0 && props.map((size, index) => (
  <div key={index} className="flex gap-3 items-center"> {/* Changed to items-center */}
    {/* Name Field - Reduced width */}
    <div className="w-2/5 min-w-0"> {/* Reduced from flex-1 to w-2/5 */}
      <label className="block text-sm text-gray-600 mb-1">Name</label>
      <input
        type="text"
        placeholder="Size name"
        value={size.name}
        onChange={ev => editProp(ev, index, 'name')}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />
    </div>
    
    {/* Price Field - Reduced width */}
    <div className="w-2/5 min-w-0"> {/* Reduced from flex-1 to w-2/5 */}
      <label className="block text-sm text-gray-600 mb-1">Price</label>
      <input
        type="text"
        placeholder="0.00"
        value={size.price}
        onChange={ev => editProp(ev, index, 'price')}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />
    </div>
    
    {/* Delete Button - Wider and perfectly aligned */}
    <div className="w-1/5 flex justify-center pt-5 "> {/* Increased width and added pt-5 */}
      <button
        type="button"
        onClick={() => removeProp(index)}
        className="h-10 mb-2 w-full max-w-[80px] flex items-center justify-center text-red-500 hover:text-red-700 transition-colors bg-red-50 rounded-md hover:bg-red-100 border border-red-100"
      >
        <Trash className="w-5 h-5" />
      </button>
    </div>
  </div>
))}
        <button
          type="button"
          onClick={addProp}
          className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark mt-2"
        >
          <Plus className="w-4 h-4" />
          {addLabel}
        </button>
      </div>
    </div>
  );
}