import { useRef } from 'react';
import { useKey } from '../useKey';

export const Search = ({ query, setQuery }) => {
	const inputEl = useRef(null);
	// zeby korzystać z useRef musimy użyć useEffect źeby zanmonoweć komponent który zawiera element DOM
	useKey('Enter', () => {
		if (document.activeElement === inputEl.current) return;
		inputEl.current.focus();
		setQuery('');
	});

	// useEffect(() => {
	// 	const el = document.querySelector('.search');
	// 	el.focus();
	// }, []);
	return (
		<input
			className='search'
			ref={inputEl}
			type='text'
			placeholder='Search movies...'
			value={query}
			onChange={e => setQuery(e.target.value)}
		/>
	);
};
