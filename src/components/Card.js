import styles from "./Card.module.css";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export function Card({ title, badge, badgeType = "primary", children, actionText, actionLink, outlineAction }) {
  return (
    <div className={styles.card}>
      {(title || badge) && (
        <div className={styles.cardHeader}>
          {title && <h3 className={styles.cardTitle}>{title}</h3>}
          {badge && (
            <span className={`${styles.badge} ${badgeType === 'success' ? styles.badgeSuccess : styles.badgePrimary}`}>
              {badge}
            </span>
          )}
        </div>
      )}
      <div className={styles.cardBody}>
        {children}
      </div>
      {actionText && actionLink && (
        <div className={styles.cardFooter}>
          <Link href={actionLink} className={`${styles.button} ${outlineAction ? styles.btnOutline : styles.btnPrimary}`}>
            {actionText} <FiArrowRight />
          </Link>
        </div>
      )}
    </div>
  );
}

export function Button({ children, variant = "primary", onClick, type = "button", className = "" }) {
  const variantClass = variant === "outline" ? styles.btnOutline : styles.btnPrimary;
  return (
    <button type={type} onClick={onClick} className={`${styles.button} ${variantClass} ${className}`}>
      {children}
    </button>
  );
}
