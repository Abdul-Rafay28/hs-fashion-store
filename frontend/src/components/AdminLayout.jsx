import { NavLink, Outlet } from "react-router-dom";

import { brandName } from "../assets/brandData";
import { useAuth } from "../hooks/useAuth";
import styles from "../styles/admin-layout.module.css";

const navItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Products", path: "/admin/products" },
  { label: "Add Product", path: "/admin/products/new" },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brandBlock}>
          <p className="eyebrow">Admin Panel</p>
          <h2>{brandName}</h2>
          <p>Manage luxury collections, uploads, and the storefront catalog from one place.</p>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) => (isActive ? styles.activeLink : "")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.footerCard}>
          <strong>{user?.name}</strong>
          <span>{user?.email}</span>
          <button className="button button--secondary" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
