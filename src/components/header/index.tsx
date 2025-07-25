import Link from "next/link";
import styles from './header.module.css'

export function Header(){
    return(
        <nav  className={`navbar mb-3 ${styles.navbar_custom}`}>
            <div className="container-fluid justify-content-end">
                <div className={styles.navbar_user}>
                    <span className="me-2">Joana da Silva Oliveira</span>
                    <span className={`material-icons ${styles.navbar_user_icon}`}>person</span>
                </div>
            </div>
        </nav>
    )
}