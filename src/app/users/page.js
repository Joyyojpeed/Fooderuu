'use client';
import UserTabs from "../components/layout/UserTabs";
import { useProfile } from "../components/UseProfile";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const { loading, data } = useProfile();

  useEffect(() => {
    fetch('/api/users')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
      })
      .then(users => {
        setUsers(users);
        setLoadingUsers(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingUsers(false);
      });
  }, []);

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
    <section className="max-w-2xl mx-auto mt-8 px-4">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        {loadingUsers ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : users?.length > 0 ? (
          users.map(user => (
            <div
              key={user._id}
              className="bg-gray-100 rounded-lg mb-2 p-4 flex items-center gap-4 hover:bg-gray-200 transition-colors"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 grow">
                <div className="text-gray-900 font-medium">
                  {user?.name || <span className="italic text-gray-500">No name</span>}
                </div>
                <span className="text-gray-600 truncate">{user.email}</span>
              </div>
              <div>
                <Link 
                  className="button bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                  href={'/users/' + user._id}
                >
                  Edit
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-8">
            No users found
          </div>
        )}
      </div>
    </section>
  );
}