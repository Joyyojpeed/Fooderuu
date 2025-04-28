'use client';
import UserForm from "@/app/components/layout/UserForm";
import UserTabs from "@/app/components/layout/UserTabs";
import { useProfile } from "@/app/components/UseProfile";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function EditUserPage() {
  const {loading, data} = useProfile();
  const [user, setUser] = useState(null);
  const {id} = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    
    fetch('/api/users?_id='+id).then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch user');
      }
      return res.json().then(user => {
        setUser(user);
      });
    }).catch(err => {
      console.error(err);
      toast.error('Failed to load user data');
      router.push('/users');
    });
  }, [id, router]);

  async function handleSaveButtonClick(ev, data) {
    ev.preventDefault();
    const promise = new Promise(async (resolve, reject) => {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...data, _id: id}),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        resolve();
      } else {
        reject();
      }
    });

    await toast.promise(promise, {
      loading: 'Saving user...',
      success: 'User saved',
      error: 'An error has occurred while saving the user',
    });
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data?.admin) {
    return (
      <div className="text-center mt-8 text-red-500 font-medium">
        Not an admin
      </div>
    );
  }

  return (
    <section className="mt-8 mx-auto max-w-2xl">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        {user ? (
          <UserForm user={user} onSave={handleSaveButtonClick} />
        ) : (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </section>
  );
}