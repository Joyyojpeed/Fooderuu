'use client';
import SectionHeaders from "../components/layout/SectionHeaders";
import UserTabs from "../components/layout/UserTabs";
import { useProfile } from "../components/UseProfile";
import { dbTimeForHuman } from "src/libs/datetime";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { loading, data: profile } = useProfile();

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    setLoadingOrders(true);
    fetch('/api/orders').then(res => {
      res.json().then(orders => {
        setOrders(orders.reverse());
        setLoadingOrders(false);
      });
    });
  }

  return (
    <section className="mt-4 md:mt-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <UserTabs isAdmin={profile?.admin} />
      <div className="mt-6 md:mt-8">
        {loadingOrders && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading orders...</p>
          </div>
        )}
        {orders?.length === 0 && !loadingOrders && (
          <div className="text-center py-8">
            <p className="text-gray-600">No orders found</p>
          </div>
        )}
        <div className="space-y-2">
          {orders?.length > 0 && orders.map(order => (
            <Link
              key={order._id}
              href={"/orders/" + order._id}
              className="group flex items-center justify-between gap-4 p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Payment Status */}
                <div className={`flex-shrink-0 p-2 rounded-md text-white w-20 text-center text-sm font-medium ${
                  order.paid ? 'bg-green-500' : 'bg-red-400'
                }`}>
                  {order.paid ? 'Paid' : 'Not paid'}
                </div>

                {/* User Info - Stacked vertically */}
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 truncate">{order.userEmail}</div>
                  <div className="text-gray-500 text-sm truncate">
                    {order.cartProducts.map(p => p.name).join(', ')}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {dbTimeForHuman(order.createdAt)}
                  </div>
                </div>
              </div>

              {/* Arrow icon */}
              <FiChevronRight className="flex-shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}