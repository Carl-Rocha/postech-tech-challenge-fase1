'use client'
import React, { JSX } from "react";
import styles from './menu.module.css'
import Link from "next/link";

export function MenuBar({ onClose }: { onClose: () => void }): JSX.Element {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleMenuClick = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        onClose();
    };

    return (
        <div>
            <button onClick={handleMenuClick}>Open Menu</button>
            {isOpen && (
                <div>
                    <MenuCard />
                    <button onClick={handleClose}>Close Menu</button>
                </div>
            )}
        </div>
    );
}

export function MenuCard() {
    return (
        <div className={styles.menu}>
            <div className={styles.menuItem}>
                <Link href="/" className={styles.menuLink}>Início</Link>
            </div>
            <div className={styles.menuItem}>
                <Link href="/transactions" className={styles.menuLink}>Transações</Link>
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