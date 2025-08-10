'use client'
import React from "react";
import styles from './menu.module.css'
import Link from "next/link";

export function MenuBar({ onClose }: { onClose: () => void }) {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleMenuClick = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        onClose();
    };
}

export function MenuCard() {
    return (
        <div className={styles.menu}>
            <div className={styles.menuItem}>
                <Link href="/home" className={styles.menuLink}>Home</Link>
            </div>
            <div className={styles.menuItem}>
                <Link href="/transfer" className={styles.menuLink}>Transferência</Link>
            </div>
            <div className={styles.menuItem}>
                <Link href="/investiment" className={styles.menuLink}>Investimento</Link>
            </div>
            <div className={styles.menuItem}>
                <Link href="/services" className={styles.menuLink}>Outros Serviços</Link>
            </div>
        </div>
    );
}