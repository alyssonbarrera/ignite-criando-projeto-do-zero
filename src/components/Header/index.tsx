import styles from "./header.module.scss";
import Link from "next/link";

export default function Header() {
  return (
    <div className={styles.container}>
      <Link href={"/"}>
        <a>
          <img src="/logo.png" alt="logo" />
        </a>
      </Link>
    </div>
  )
}
