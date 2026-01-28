"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { MenuItem } from "./types";
import { usePathname } from "next/navigation";

interface DesktopMenuProps {
  menuData: MenuItem[];
  stickyMenu: boolean;
}

const DesktopMenu = ({ menuData, stickyMenu }: DesktopMenuProps) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: number; title: string; slug: string }[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch('/api/menu/categories'),
          fetch('/api/brands')
        ]);
        const catJson = await catRes.json();
        const brandJson = await brandRes.json();
        setCategories(catJson?.data || []);
        setBrands(brandJson?.data || []);
      } catch (err) {
        console.error('Error loading menu data', err);
      }
    };
    fetchData();
  }, []);

  const handleMouseEnter = (index: number) => {
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <nav>
      <ul className="flex items-center gap-6">
        {menuData.map((menuItem, i) => (
          <li
            key={i}
            className="relative group"
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
          >
            {menuItem.submenu || menuItem.title === 'Shop by Product' || menuItem.title === 'Shop By Brand' ? (
              <>
                <button
                  className={`flex items-center gap-1 hover:text-blue font-medium ${stickyMenu ? "py-4" : "py-6"} relative text-sm font-medium ${menuItem.submenu?.some(subItem => pathname === subItem.path) ? "text-blue" : "text-dark"}`}
                  onClick={() => {
                    // top-level click should navigate to the shop page so sidebar/filters are available
                    if (menuItem.title === 'Shop by Product' || menuItem.title === 'Shop By Brand') {
                      router.push('/shop');
                    }
                  }}
                >
                  {menuItem.title}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 ${activeDropdown === i ? "rotate-180" : ""
                      }`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute left-0 border border-gray-2 top-full bg-white shadow-lg rounded-lg p-4 min-w-[320px] z-50 transform transition-all duration-200 ${activeDropdown === i
                      ? "opacity-100 translate-y-0 visible"
                      : "opacity-0 translate-y-2 invisible"
                    }`}
                >
                  {menuItem.title === 'Shop by Product' ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold mb-2">Men</p>
                        {categories.map((c) => (
                          <Link key={c.id} href={`/categories/${c.slug}?gender=men`} className="block px-2 py-1 text-sm hover:text-blue hover:bg-gray-2 rounded">
                            {c.title}
                          </Link>
                        ))}
                      </div>
                      <div>
                        <p className="font-semibold mb-2">Women</p>
                        {categories.map((c) => (
                          <Link key={c.id} href={`/categories/${c.slug}?gender=women`} className="block px-2 py-1 text-sm hover:text-blue hover:bg-gray-2 rounded">
                            {c.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : menuItem.title === 'Shop By Brand' ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold mb-2">Men</p>
                        {brands.map((b, idx) => (
                          <Link key={idx} href={`/shop?brand=${encodeURIComponent(b)}&gender=men`} className="block px-2 py-1 text-sm hover:text-blue hover:bg-gray-2 rounded">
                            {b}
                          </Link>
                        ))}
                      </div>
                      <div>
                        <p className="font-semibold mb-2">Women</p>
                        {brands.map((b, idx) => (
                          <Link key={idx} href={`/shop?brand=${encodeURIComponent(b)}&gender=women`} className="block px-2 py-1 text-sm hover:text-blue hover:bg-gray-2 rounded">
                            {b}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    menuItem.submenu?.map((subItem, j) => (
                      <Link
                        key={j}
                        href={subItem.path || "#"}
                        className={`block px-4 py-2 text-sm font-medium rounded-lg hover:text-blue hover:bg-gray-2 ${subItem.path && pathname.split('?')[0] === subItem.path.split('?')[0] ? "text-blue" : "text-dark"}`}
                      >
                        {subItem.title}
                      </Link>
                    ))
                  )}
                </div>
              </>
            ) : (
              <Link
                href={menuItem.path || "#"}
                className={`hover:text-blue font-medium ${stickyMenu ? "py-4" : "py-6"} block relative text-sm ${menuItem.path && pathname.split('?')[0] === menuItem.path.split('?')[0] ? "text-blue" : "text-dark"}`}
              >
                {menuItem.title}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DesktopMenu;
