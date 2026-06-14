import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import styles from "../styles/pages.module.css";

const AdminLoginPage = () => {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/admin", { replace: true });
    }
  }, [navigate, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(formState);
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className={styles.loginShell}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className={styles.loginCard}>
        <div className="section-heading">
          <p className="eyebrow">Admin login</p>
          <h1>Control the luxury storefront.</h1>
          <p>Sign in to manage products, uploads, search visibility, and featured edits.</p>
        </div>

        <form className="section-stack" onSubmit={handleSubmit}>
          <p className="muted-text">
            Use the admin credentials defined in your backend `.env` file.
          </p>

          <label className="field-label">
            Email
            <input
              className="soft-input"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field-label">
            Password
            <input
              className="soft-input"
              name="password"
              type="password"
              value={formState.password}
              onChange={handleChange}
              required
            />
          </label>

          {error ? <p className="error-text">{error}</p> : null}

          <button className="button" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <Link className="button button--ghost" to="/">
          Return to storefront
        </Link>
      </div>
    </motion.div>
  );
};

export default AdminLoginPage;
