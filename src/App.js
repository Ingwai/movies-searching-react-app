import { useState } from 'react';
import { useMovies } from './useMovies';
import { useLocalStorage } from './useLocalStorage';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { NavBar } from './components/NavBar';
import { Logo } from './components/Logo';
import { Search } from './components/Search';
import { NumResults } from './components/NumResults';
import { Main } from './components/Main';
import { Box } from './components/Box';
import { MovieList } from './components/MovieList';
import { MovieDetails } from './components/MovieDetails';
import { WatchedSummary } from './components/WatchedSummary';
import { WatchedMovieList } from './components/WatchedMovieList';

export const average = arr => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = '1315b1c1';

export default function App() {
	const [query, setQuery] = useState('');
	const [selectedId, setSelectedId] = useState(null);

	const { movies, isLoading, error } = useMovies(query, handleCloseMovie);

	const [watched, setWatched] = useLocalStorage([], 'watched');

	const handleSelectMovie = id => {
		setSelectedId(selectedId => (id === selectedId ? null : id));
	};

	function handleCloseMovie() {
		setSelectedId(null);
	}

	const handleAddWatched = movie => {
		setWatched(watched => [...watched, movie]);
		// localStorage.setItem('watched', JSON.stringify([...watched, movie]));
	};

	const handleDeleteWatched = id => {
		setWatched(watched => watched.filter(movie => movie.imdbID !== id));
	};

	return (
		<>
			<NavBar>
				<Logo />
				<Search query={query} setQuery={setQuery} />
				<NumResults>{movies.length}</NumResults>
			</NavBar>
			<Main>
				<Box>
					{isLoading && <Loader />}
					{!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
					{error && <ErrorMessage message={error} />}
				</Box>
				<Box>
					{selectedId ? (
						<MovieDetails
							selectedId={selectedId}
							onCloseMovie={handleCloseMovie}
							onAddWatched={handleAddWatched}
							watched={watched}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedMovieList watched={watched} onDeleteWatched={handleDeleteWatched} />
						</>
					)}
				</Box>
			</Main>
		</>
	);
}
