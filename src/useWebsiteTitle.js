import { useEffect } from 'react';

export function useWebsiteTitle(title) {
	useEffect(() => {
		if (!title) return;
		document.title = `Movie | ${title}`;
		// funkcja czyszcząca effect
		return function () {
			document.title = 'usePopcorn';
			// console.log(`Czyszczenie ${title}`);
		};
	}, [title]);

	return title;
}
