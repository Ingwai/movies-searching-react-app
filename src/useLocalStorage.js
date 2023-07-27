import { useState, useEffect } from 'react';

export function useLocalStorage(initialState, key) {
	// const [watched, setWatched] = useState([]);
	// ustawienie stanu początkowego przez callbacka przekazanego w useState
	// nie powinniśmy wywoływać funkcji w useState np tak useState(localStorage.getItem('watched'))
	// tylko tak
	const [value, setValue] = useState(() => {
		const storedValue = JSON.parse(localStorage.getItem(key));
		return storedValue || initialState;
	});

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [value, key]);

	return [value, setValue];
}
