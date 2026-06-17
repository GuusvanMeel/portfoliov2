'use client'
 
import { useRouter } from 'next/navigation'
import { useTheme } from './Features/Theme/ThemeProvider';
import { windowThemes } from './Features/Window/windowThemes';
import styles from "./window/WindowFrame.module.css"
 
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