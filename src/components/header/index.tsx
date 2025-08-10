'use client'
// import Link from "next/link";
import styles from './header.module.css'

import React, { useState } from "react";

import { MenuBar } from "../menu";


export function Header(){
    const [showMenu, setShowMenu] = useState(false);

    return(
        <nav className={`navbar mb-3 ${styles.navbar_custom}`}>
            <div className="container-fluid justify-content-between">
                <div>
                    {typeof window !== "undefined" && window.innerWidth <= 768 && (
                        <div
                            className={styles.navbar_menu}
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowMenu(true)}
                        >
                            <span className={`material-icons ${styles.navbar_menu_icon}`}>menu</span>
                            {showMenu && (
                                <MenuBar onClose={() => setShowMenu(false)} />
                            )}
                        </div>
                    )}
                </div>
                <div className={styles.navbar_user}>
                    <span className="me-2">Joana da Silva Oliveira</span>
                    <span className={`material-icons ${styles.navbar_user_icon}`}>person</span>
                </div>
            </div>
        </nav>
    )
}