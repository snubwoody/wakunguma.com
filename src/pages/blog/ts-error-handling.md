---
title: All the ways of handing errors in typescript
author: Wakunguma Kalimukwa
layout: ../../layouts/BlogLayout.astro
published: 
image: 
imageSize: 0
synopsis: 
preview: "true"
---
We're going to create a custom error class that betters helps us identify errors.

```ts
export type ErrorKind = "Auth" | "Network" | "Unkwown"

export class AppError extends Error{
    override message: string,
    kind: ErrorKind

    constructor(message:string,kind: ErrorKind = "Unkwown"){
    	super(message)
		this.message = message
		this.kind = kind
	}
}
```

## Object union

```ts
export type Result<T,E> = {data: T,error: null} | {data: null,error:E}
```

Since we're using a union and not just `data: T | null`, if we one of the values being null then we can safely use the other without worrying about null safety.

```ts
let result:Result<number,never> = {data: 5,error: never}
```

```ts
export async function signIn(){
	try{
		const response = await fetch("https://api.example.com/sign-in")
		
		if (!response.ok){
			const error = new AppError("Failed error","Auth")
			return{
				data: null,
				error
			}
		}
		
		const user:User = await response.json()
		return {data:user,null}
	}catch(e){
		const message = (e as any).message
		const error = new AppError(message,"Network")
		return {data:null,error}
	}
}
```

One problem with this is that you have to rename the data variable if you want to have a variable with a different name;

## Enum style errors

In some languages we have a [`Result`](https://en.wikipedia.org/wiki/Result_type) type which is a union of two values: a `Ok<T>` variant and an `Err<T>` variant. Since it's a union we're forced to handle the error if we want to access the value. 

```ts
type Result<T,E> = Ok<T> | Err<E>

class Ok<T>{
    readonly value: T
    constructor(value: T){
        this.value = value
    }
}

class Err<E>{
    readonly error: T

    constructor(error: T){
        this.error = error
    }
}

interface IResult<T,E>{
    isErr():boolean,
    isOk():boolean,
    fold():boolean,
    try():boolean,
}

// Helper functions
function ok<T>(value: T): Result<T,never>{
    return new Ok(value)
}

function err<E>(error: E): Result<never,E>{
    return new Err(error)
}
```
