'use client'
 
import { useRouter } from 'next/navigation'

import styles from "../windows/WindowFrame.module.css";
import { useTheme } from '@/app/Features/Theme/ThemeProvider';
import { windowThemes } from '@/app/Features/Window/windowThemes';
 
export default function Page() {
  const router = useRouter()
  const { theme, } = useTheme();
      const selectedTheme = windowThemes[theme];
 
  return (
    <button className={`${styles.genericButton} ${selectedTheme.button}  h-10!`} onClick={() => router.push('/admin')}>
      Admin panel
    </button>
  )
}