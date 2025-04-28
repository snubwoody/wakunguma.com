import { browser } from "$app/environment";


export type ActiveTheme = 'light' | 'dark';

export function useTheme(){
	let theme: ActiveTheme = $state('light');

	if(browser){
		let themeVar = localStorage.getItem('theme');
		if (!themeVar){
			localStorage.setItem('theme',JSON.stringify('light'));
			theme = 'light';
		}
		else{
			let activeTheme = JSON.parse(themeVar);
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