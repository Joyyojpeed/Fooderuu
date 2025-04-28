'use client';
import DeleteButton from "@/app/components/DeleteButton";
import Left from "@/app/components/layout/icons/Left";
import MenuItemForm from "@/app/components/layout/MenuItemForm";
import UserTabs from "@/app/components/layout/UserTabs";
import { useProfile } from "@/app/components/UseProfile";
import Link from "next/link";
import {redirect, useParams} from "next/navigation";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";

export default function EditMenuItemPage() {
  const {id} = useParams();
  const [menuItem, setMenuItem] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [redirectToItems, setRedirectToItems] = useState(false);
  const {loading: profileLoading, data: profileData} = useProfile();

  useEffect(() => {
    if (!id) return;
    
    setIsFetching(true);
    fetch(`/api/menu-items?id=${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(item => {
        setMenuItem(item);
      })
      .catch(err => {
        toast.error(err.message);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [id]);

  async function handleFormSubmit(ev, formData) {
    ev.preventDefault();
    const savingPromise = fetch('/api/menu-items', {
      method: 'PUT',
      body: JSON.stringify({...formData, _id: id}),
      headers: { 'Content-Type': 'application/json' },
    }).then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    });

    await toast.promise(savingPromise, {
      loading: 'Saving this tasty item...',
      success: 'Changes saved successfully!',
      error: 'Failed to save changes',
    });

    setRedirectToItems(true);
  }

  async function handleDeleteClick() {
    const deletionPromise = fetch(`/api/menu-items?id=${id}`, {
      method: 'DELETE',
    }).then(res => {
      if (!res.ok) throw new Error();
    });

    await toast.promise(deletionPromise, {
      loading: 'Deleting menu item...',
      success: 'Menu item deleted!',
      error: 'Failed to delete',
    });

    setRedirectToItems(true);
  }

  if (redirectToItems) {
    return redirect('/menu-items');
  }

  if (profileLoading || isFetching) {
    return (
      <div className="py-8 text-center">
        <span className="loading">Loading...</span>
      </div>
    );
  }

  if (!profileData?.admin) {
    return redirect('/profile');
  }

  if (!menuItem) {
    return (
      <div className="py-8 text-center text-gray-500">
        Menu item not found
      </div>
    );
  }

return (
  
<section className="mt-8 max-w-4xl mx-auto px-4">
  <UserTabs isAdmin={true} />
  <div className="mb-6 mt-6 ">
    <Link 
      href="/menu-items" 
      className="inline-flex  gap-2 text-primary hover:text-primary-dark font-medium"
    >
      <Left className="w-5 h-5 " />
      <span>Back to all menu items</span>
    </Link>
  </div>
  
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <MenuItemForm menuItem={menuItem} onSubmit={handleFormSubmit} />
    
    <div className="mt-8 border-t border-gray-100 pt-6">
      <DeleteButton 
        label="Delete this menu item"
        onDelete={handleDeleteClick}
        className="max-w-xs mx-auto"
      />
    </div>
  </div>
</section>
);
}
