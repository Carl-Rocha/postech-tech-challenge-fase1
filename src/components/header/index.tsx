"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import ElevateAppBar from '../AppBar/ElevateAppBar';

export default function Header() {
  const pathname = usePathname();
  
  // Páginas onde o AppBar não deve aparecer
  const hiddenPages = ['/login', '/register'];
  const hasAppBar = !hiddenPages.includes(pathname);
  
  // Ajustar margin-top do main baseado na presença do AppBar
  useEffect(() => {
    const main = document.querySelector('main');
    if (main) {
      main.style.marginTop = hasAppBar ? '64px' : '0';
    }
  }, [hasAppBar]);
  
  // Se estiver em uma página que deve ocultar o AppBar, não renderiza nada
  if (!hasAppBar) {
    return null;
  }
  
  // Caso contrário, renderiza o AppBar normalmente
  return <ElevateAppBar />;
}

// Hook para verificar se o AppBar deve aparecer
export function useAppBarVisibility() {
  const pathname = usePathname();
  const hiddenPages = ['/login', '/register'];
  return !hiddenPages.includes(pathname);
}
