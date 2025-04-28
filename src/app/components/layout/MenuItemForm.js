import Plus from "./icons/Plus";
import Trash from "./icons/Trash";
import EditableImage from "./EditableImage";
import MenuItemPriceProps from "./MenuItemPriceProps";
import { useEffect, useState } from "react";

export default function MenuItemForm({ onSubmit, menuItem }) {
  const [image, setImage] = useState(menuItem?.image || '');
  const [name, setName] = useState(menuItem?.name || '');
  const [description, setDescription] = useState(menuItem?.description || '');
  const [basePrice, setBasePrice] = useState(menuItem?.basePrice || '');
  const [sizes, setSizes] = useState(menuItem?.sizes || []);
  const [category, setCategory] = useState(menuItem?.category || ''); 
  const [categories, setCategories] = useState([]);
  const [extraIngredientPrices, setExtraIngredientPrices] = useState(menuItem?.extraIngredientPrices || []);

  useEffect(() => {
    fetch('/api/categories').then(res => {
      res.json().then(categories => {
        setCategories(categories);
      });
    });
  }, []);

  return (
    <form
      onSubmit={ev =>
        onSubmit(ev, {
          image, name, description, basePrice, sizes, extraIngredientPrices, category,
        })
      }
      className="mt-8 max-w-xl mx-auto"
    >
      <div
        className="md:grid items-start gap-4"
        style={{ gridTemplateColumns: '.3fr .7fr' }}
      >
        <div className="relative">
          {/* Fixed-size container for images */}
          <div className="aspect-square w-full overflow-hidden rounded-lg mt-5">
            <EditableImage 
              link={image} 
              setLink={setImage} 
              className="object-cover w-full h-full" 
            />
          </div>
        </div>
        <div className="grow space-y-2"> {/* Added space-y-2 for consistent spacing */}
          <label>Item name</label>
          <input
            type="text"
            value={name}
            onChange={ev => setName(ev.target.value)}
          />
          
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={ev => setDescription(ev.target.value)}
          />
          
          <div className="space-y-2"> {/* Category in its own section */}
            <label>Category</label>
            <select
              value={category}
              onChange={ev => setCategory(ev.target.value)}
              required
              className="w-full"
            >
              <option value="">Select a category</option>
              {categories?.length > 0 && categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <label>Base price</label>
          <input
            type="text"
            value={basePrice}
            onChange={ev => setBasePrice(ev.target.value)}
          />
          
          <MenuItemPriceProps 
            name={'Sizes'}
            addLabel={'Add item size'}
            props={sizes}
            setProps={setSizes}
          />
          <MenuItemPriceProps 
            name={'Extra ingredients'}
            addLabel={'Add ingredients prices'}
            props={extraIngredientPrices}
            setProps={setExtraIngredientPrices}
          />
          
          <button type="submit" className="w-full">Save</button>
        </div>
      </div>
    </form>
  );
}