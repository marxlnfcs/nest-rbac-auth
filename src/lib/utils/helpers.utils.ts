import * as minimatch from 'minimatch';

/** @internal */
export function extractString(...items: any[]): string|null {
	for(let item of items){
		if(typeof item === 'string'){
			return item;
		}
	}
	return null;
}

/** @internal */
export function extractObject<T = any>(...items: any[]): T|null {
	for(let item of items){
		if(item !== undefined && item !== null && typeof item === 'object'){
			return item;
		}
	}
	return null;
}

/** @internal */
export function joinPath(...data: (string|string[])[]): string {
	const paths: string[] = [];
	data.filter(p => !!p).map(path => {
		if(Array.isArray(path)){
			paths.push(joinPath(...path));
			return;
		}
		if(path.split('.').length > 1){
			paths.push(joinPath(...path.split('.').map(p => p.trim()).filter(p => !!p)));
			return;
		}
		if(!!path.trim()){
			paths.push(path);
		}
	});
	return paths.join('.').trim().toLowerCase();
}

/** @internal */
export function getMinimatch(pattern: string): minimatch.Minimatch {
	return new minimatch.Minimatch(pattern, {
		nobrace: true,
		noglobstar: true,
		dot: false,
		nocase: true,
		nocomment: true,
		nonegate: false,
		flipNegate: true,
	});
}

/** @internal */
export function matchGlob(target: string, pattern: string): boolean {
	return getMinimatch(pattern).match(target);
}

/** @internal */
export function negateString(text: string): string {
	text = text.trim();
	return text.startsWith('!') ? text : `!${text}`;
}

/** @internal */
export function isNegated(pattern: string): boolean {
	return getMinimatch(pattern).negate;
}