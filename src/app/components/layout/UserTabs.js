"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UserTabs({ isAdmin }) {
  const path = usePathname();

  return (
    <div className="flex mx-auto gap-2 sm:gap-4 tabs justify-center flex-wrap px-4 py-2">
      <Link 
        className={
          `px-3 py-2 text-sm sm:text-base rounded-md transition-all 
          ${path === "/profile" 
            ? "bg-blue-100 text-blue-700 font-medium" 
            : "text-gray-600 hover:bg-gray-100"}`
        } 
        href={"/profile"}
      >
        Profile
      </Link>
      {isAdmin && (
        <>
          <Link
            href={"/categories"}
            className={
              `px-3 py-2 text-sm sm:text-base rounded-md transition-all 
              ${path === "/categories" 
                ? "bg-blue-100 text-blue-700 font-medium" 
                : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            Categories
          </Link>
          <Link
            href={"/menu-items"}
            className={
              `px-3 py-2 text-sm sm:text-base rounded-md transition-all 
              ${path === "/menu-items" 
                ? "bg-blue-100 text-blue-700 font-medium" 
                : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            Menu Items
          </Link>
          <Link 
            href={"/users"}
            className={
              `px-3 py-2 text-sm sm:text-base rounded-md transition-all 
              ${path === "/users" 
                ? "bg-blue-100 text-blue-700 font-medium" 
                : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            Users
          </Link>
          <Link 
            href={"/orders"}
            className={
              `px-3 py-2 text-sm sm:text-base rounded-md transition-all 
              ${path === "/orders" 
                ? "bg-blue-100 text-blue-700 font-medium" 
                : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            Orders
          </Link>
        </>
      )}
    </div>
  );
}