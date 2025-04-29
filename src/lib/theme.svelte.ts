import { browser } from "$app/environment";


export type ActiveTheme = 'light' | 'dark';

export function useTheme(){
    let theme: ActiveTheme = $state('light');
    
	if(browser){
		const themeVar = localStorage.getItem('theme');
		if (!themeVar){
			localStorage.setItem('theme',JSON.stringify('light'));
			theme = 'light';
		}
		else{
			const activeTheme = JSON.parse(themeVar);
			theme = activeTheme;
		}
	}

	return{
		theme() {
			return theme;
		},
		switchTheme(newTheme: ActiveTheme){
			localStorage.setItem('theme',JSON.stringify(newTheme));
			theme = newTheme;
		}
	};
}

export const themeStore = useTheme();
