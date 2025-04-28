'use client';
import AddressInputs from "./AddressInputs";
import EditableImage from "./EditableImage";
import { useProfile } from "../UseProfile";
import {useState} from "react";

export default function UserForm({user,onSave}) {
  const [userName, setUserName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [streetAddress, setStreetAddress] = useState(user?.streetAddress || '');
  const [postalCode, setPostalCode] = useState(user?.postalCode || '');
  const [city, setCity] = useState(user?.city || '');
  const [country, setCountry] = useState(user?.country || '');
  const [admin, setAdmin] = useState(user?.admin || false);
  const {data:loggedInUserData} = useProfile();

  function handleAddressChange(propName, value) {
    if (propName === 'phone') setPhone(value);
    if (propName === 'streetAddress') setStreetAddress(value);
    if (propName === 'postalCode') setPostalCode(value);
    if (propName === 'city') setCity(value);
    if (propName === 'country') setCountry(value);
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8">
      <div className="flex justify-center md:block">
        <div className="p-2 rounded-lg relative w-full max-w-[120px] md:max-w-[150px]">
          <EditableImage link={image} setLink={setImage} />
        </div>
      </div>
      <form
        className="grow"
        onSubmit={ev =>
          onSave(ev, {
            name:userName, image, phone, admin,
            streetAddress, city, country, postalCode,
          })
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First and last name
            </label>
            <input
              type="text" 
              placeholder="First and last name"
              value={userName} 
              onChange={ev => setUserName(ev.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              disabled={true}
              value={user?.email || ''}
              placeholder={'email'}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          
          <AddressInputs
            addressProps={{phone, streetAddress, postalCode, city, country}}
            setAddressProp={handleAddressChange}
          />
          
          {loggedInUserData.admin && (
            <div className="mt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  value={'1'}
                  checked={admin}
                  onChange={ev => setAdmin(ev.target.checked)}
                />
                <span className="text-gray-700">Admin</span>
              </label>
            </div>
          )}
          
          <button 
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}