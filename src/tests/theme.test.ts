import { test,expect, beforeEach } from "vitest";
import { useTheme } from "../lib";

beforeEach(()=>{
    localStorage.clear();
});

test('useTheme initiliased local storage',()=>{
    useTheme();
    const theme = localStorage.getItem('theme');
    expect(theme).toBe('light');
});

test('useTheme stores value',()=>{
    const {setTheme} = useTheme();
    setTheme('dark');
    const theme = localStorage.getItem('theme');
    expect(theme).toBe('dark');
});

test('useTheme uses previous stored value',()=>{
    localStorage.setItem('theme','dark')
    const {theme} = useTheme();
    expect(theme).toBe('dark');
    
    localStorage.setItem('theme','light')
    const {theme:lightMode} = useTheme();
    expect(lightMode).toBe('light');
});
