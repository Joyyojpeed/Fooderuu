"use client";
import Right from "../components/layout/icons/Right";
import UserTabs from "../components/layout/UserTabs";
import { useProfile } from "../components/UseProfile";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState([]);
  const { loading, data } = useProfile();

  useEffect(() => {
    fetch("/api/menu-items").then((res) => {
      res.json().then((menuItems) => {
        setMenuItems(menuItems);
      });
    });
  }, []);

  if (loading) {
    return "Loading user info...";
  }

  if (!data.admin) {
    return "Not an admin.";
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={true} />
      <div className="mt-8 flex justify-center mb-8">
        <Link
          className="button flex items-center gap-2"
          href={"/menu-items/new"}
        >
          <span>Create new menu item</span>
          <Right />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
    {menuItems?.length > 0 && menuItems.map((item) => (
      <Link
        key={item._id}
        href={"/menu-items/edit/" + item._id}
        className="bg-gray-200 rounded-lg p-4 hover:bg-gray-300 transition"
      >
        <div className="aspect-square w-full overflow-hidden rounded-lg"> {/* Fixed aspect ratio */}
          <Image
            className="object-cover w-full h-full" // Ensures image fills container
            src={item.image}
            alt={item.name}
            width={300}
            height={300}
          />
        </div>
        <div className="text-center mt-2 font-medium">{item.name}</div>
      </Link>
    ))}
  </div>
    </section>
  );
}
