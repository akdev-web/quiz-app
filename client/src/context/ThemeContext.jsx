import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export default function ThemeProvider({children}){
    const [theme,setTheme] = useState(localStorage.getItem('theme') || 'system')
    const themes = ['light','dark'];


    useEffect(()=>{
        const mediaQuery = matchMedia('(prefers-color-scheme : dark)');

        const applyTheme = () =>{
            const isSystemDark = mediaQuery.matches;
            if(themes.includes(theme)){
                localStorage.setItem('theme',theme);
                document.documentElement.classList.toggle('dark',theme === 'dark');
            }else{
                if(theme === 'system' ){ 
                    localStorage.removeItem('theme');
                    document.documentElement.classList.toggle('dark',isSystemDark)
                } 
            }
        }

        applyTheme();

        mediaQuery.addEventListener('change',applyTheme);

        return () => {
            mediaQuery.removeEventListener('change',applyTheme);
        }
    },[theme])

    return(
        <ThemeContext.Provider value={{theme,setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () =>useContext(ThemeContext);