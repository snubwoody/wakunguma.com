
export type Theme = 'light' | 'dark';

export const useTheme = () => {
    let theme = localStorage.getItem('theme') as Theme | null;
    if(!theme){
        localStorage.setItem('theme','light');
        theme = 'light';
    }

    return{
        theme,
        setTheme: (theme: Theme) =>{
            localStorage.setItem('theme',theme)
        }
    }
}
