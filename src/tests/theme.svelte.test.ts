import {test,expect, beforeEach} from 'vitest';
import { useTheme} from '$lib/theme.svelte';

beforeEach(()=>{
	localStorage.clear()
})

test('useTheme initialises local storage',()=>{
	useTheme()
	let themeVar = localStorage.getItem('theme');
	
	if (!themeVar){
		throw "Theme not initialised in local storage"
	}

	let theme = JSON.parse(themeVar);
	expect(theme).toBe('light');
})

test('Switch theme',()=>{
	let {theme, switchTheme} = useTheme();
	expect(theme()).toBe('light');
	switchTheme('dark');
	expect(theme()).toBe('dark');
	
	const activeTheme = JSON.parse(localStorage.getItem('theme') ?? '');
	expect(activeTheme).toBe('dark')
})

test('Dark mode persists',()=>{
	localStorage.setItem('theme',JSON.stringify('dark'));
	let {theme} = useTheme();
	expect(theme()).toBe('dark')
})