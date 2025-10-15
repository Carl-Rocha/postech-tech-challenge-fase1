'use client'
import React, { JSX } from 'react'
import styles from './menu.module.css'
import Link from 'next/link'

export function MenuBar({ onClose }: { onClose: () => void }): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleMenuClick = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }

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
  )
}

export function MenuCard() {
  // Quando as variáveis públicas estiverem definidas, apontamos para as zonas externas
  const txBase = (process.env.NEXT_PUBLIC_ENABLE_TRANSACTIONS_ZONE === 'true' && process.env.NEXT_PUBLIC_TRANSACTIONS_ZONE_URL)
    ? String(process.env.NEXT_PUBLIC_TRANSACTIONS_ZONE_URL).replace(/\/$/, '')
    : ''
  const adminBase = (process.env.NEXT_PUBLIC_ENABLE_ADMIN_ZONE === 'true' && process.env.NEXT_PUBLIC_ADMIN_ZONE_URL)
    ? String(process.env.NEXT_PUBLIC_ADMIN_ZONE_URL).replace(/\/$/, '')
    : ''

  const transactionsHref = txBase ? `${txBase}/transactions` : '/transactions'
  const adminHref = adminBase ? `${adminBase}/admin` : '/admin'

  return (
    <div className={styles.menu}>
      <div className={styles.menuItem}>
        <Link href="/" className={styles.menuLink}>Início</Link>
      </div>
      <div className={styles.menuItem}>
        <Link href={transactionsHref} prefetch={false} className={styles.menuLink}>Transações</Link>
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
      <div className={styles.menuItem}>
        <Link href={adminHref} prefetch={false} className={styles.menuLink}>Administração</Link>
      </div>
    </div>
  )
}

