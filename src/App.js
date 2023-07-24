import { useEffect, useState } from 'react';
import StarRating from './StarRating';

const average = arr => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = '1315b1c1';

export default function App() {
	const [query, setQuery] = useState('');
	const [movies, setMovies] = useState([]);
	const [watched, setWatched] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [selectedId, setSelectedId] = useState(null);

	// useEffect(() => {
	// 	console.log('Only first render');
	// }, []);

	// useEffect(() => {
	// 	console.log('After render');
	// });

	// useEffect(() => {
	// 	console.log('D');
	// }, [query]);

	// console.log('During render');

	const handleSelectMovie = id => {
		setSelectedId(selectedId => (id === selectedId ? null : id));
	};

	const handleCloseMovie = () => {
		setSelectedId(null);
	};

	const handleAddWatched = movie => {
		setWatched(watched => [...watched, movie]);
	};

	const handleDeleteWatched = id => {
		setWatched(watched => watched.filter(movie => movie.imdbID !== id));
	};

	useEffect(() => {
		async function fetchMovies() {
			try {
				setError('');
				setIsLoading(true);
				const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`);

				if (!res.ok) {
					throw new Error('Something went wrong.');
				}

				const data = await res.json();

				if (data.Response === 'False') throw new Error('Movie not found!');
				setMovies(data.Search);
			} catch (err) {
				console.error(err.message);
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		}
		if (query.length < 3) {
			setMovies([]);
			setError('');
			return;
		}
		fetchMovies();
	}, [query]);

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

const Loader = () => {
	return <p className='loader'>Loading...</p>;
};

const ErrorMessage = ({ message }) => {
	return (
		<p className='error'>
			<span>⛔</span>
			{message}
		</p>
	);
};

const NavBar = ({ children }) => {
	return <nav className='nav-bar'>{children}</nav>;
};

const Logo = () => {
	return (
		<div className='logo'>
			<span role='img'>🍿</span>
			<h1>usePopcorn</h1>
		</div>
	);
};

const Search = ({ query, setQuery }) => {
	return (
		<input
			className='search'
			type='text'
			placeholder='Search movies...'
			value={query}
			onChange={e => setQuery(e.target.value)}
		/>
	);
};

const NumResults = ({ children }) => {
	return (
		<p className='num-results'>
			Found <strong>{children}</strong> results
		</p>
	);
};

const Main = ({ children }) => {
	return <main className='main'>{children}</main>;
};

const Box = ({ children }) => {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<div className='box'>
			<button className='btn-toggle' onClick={() => setIsOpen(open => !open)}>
				{isOpen ? '–' : '+'}
			</button>
			{isOpen && children}
		</div>
	);
};

// const WatchedBox = () => {
// 	const [isOpen2, setIsOpen2] = useState(true);
// 	const [watched, setWatched] = useState(tempWatchedData);
// 	return (
// 		<div className='box'>
// 			<button className='btn-toggle' onClick={() => setIsOpen2(open => !open)}>
// 				{isOpen2 ? '–' : '+'}
// 			</button>
// 			{isOpen2 && (
// 				<>
// 					<WatchedSummary watched={watched} />
// 					<WatchedMovieList watched={watched} />
// 				</>
// 			)}
// 		</div>
// 	);
// };

const MovieList = ({ movies, onSelectMovie }) => {
	return (
		<ul className='list list-movies'>
			{movies?.map(movie => (
				<Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
			))}
		</ul>
	);
};

const Movie = ({ movie, onSelectMovie }) => {
	return (
		<li onClick={() => onSelectMovie(movie.imdbID)}>
			<img src={movie.Poster} alt={`${movie.Title} poster`} />
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>🗓</span>
					<span>{movie.Year}</span>
				</p>
			</div>
		</li>
	);
};

const MovieDetails = ({ selectedId, onCloseMovie, onAddWatched, watched }) => {
	const [movie, setMovies] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [userRating, setUserRating] = useState('');

	const isWatched = watched.map(movie => movie.imdbID).includes(selectedId);
	const watchedUserRating = watched.find(movie => movie.imdbID === selectedId)?.userRating;
	console.log(watchedUserRating);
	const {
		Title: title,
		Year: year,
		Poster: poster,
		Runtime: runtime,
		imdbRating,
		Plot: plot,
		Released: released,
		Actors: actors,
		Director: director,
		Genre: genre,
	} = movie;

	const handleAdd = () => {
		const newWatchedMovie = {
			imdbID: selectedId,
			title,
			year,
			poster,
			imdbRating: Number(imdbRating),
			runtime: Number(runtime.split(' ').at(0)),
			userRating,
		};
		onAddWatched(newWatchedMovie);
		onCloseMovie();
	};

	useEffect(() => {
		setIsLoading(true);

		async function getMovieDetails() {
			const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);

			const data = await res.json();
			setMovies(data);
			setIsLoading(false);
		}
		getMovieDetails();
	}, [selectedId]);

	return (
		<div className='details'>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<header>
						<button className='btn-back' onClick={onCloseMovie}>
							&larr;
						</button>
						<img src={poster} alt={`Poster of ${title} movie`} />
						<div className='details-overview'>
							<h2>{title}</h2>
							<p>
								{released} &bull; {runtime}
							</p>
							<p>{genre}</p>
							<p>
								<span>⭐</span>
								{imdbRating} IMDb rating
							</p>
						</div>
					</header>
					<section>
						<div className='rating'>
							{!isWatched ? (
								<>
									<StarRating maxRating={10} size={24} onSetRating={setUserRating} />
									{userRating > 0 && (
										<button className='btn-add' onClick={handleAdd}>
											Add to list
										</button>
									)}
								</>
							) : (
								<p>
									You rated with movie {watchedUserRating}
									<span>⭐</span>
								</p>
							)}
						</div>
						<p>
							<em>{plot}</em>
						</p>
						<p>Starring: {actors}</p>
						<p>Directed by {director}</p>
					</section>
				</>
			)}
		</div>
	);
};

const WatchedSummary = ({ watched }) => {
	const avgImdbRating = average(watched.map(movie => movie.imdbRating));
	const avgUserRating = average(watched.map(movie => movie.userRating));
	const avgRuntime = average(watched.map(movie => movie.runtime));
	return (
		<div className='summary'>
			<h2>Movies you watched</h2>
			<div>
				<p>
					<span>#️⃣</span>
					<span>{watched.length} movies</span>
				</p>
				<p>
					<span>⭐️</span>
					<span>{avgImdbRating.toFixed(1)}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{avgUserRating.toFixed(1)}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{avgRuntime} min</span>
				</p>
			</div>
		</div>
	);
};

const WatchedMovieList = ({ watched, onDeleteWatched }) => {
	return (
		<ul className='list'>
			{watched.map(movie => (
				<WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />
			))}
		</ul>
	);
};

const WatchedMovie = ({ movie, onDeleteWatched }) => {
	return (
		<li>
			<img src={movie.poster} alt={`${movie.title} poster`} />
			<h3>{movie.title}</h3>
			<div>
				<p>
					<span>⭐️</span>
					<span>{movie.imdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{movie.userRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{movie.runtime} min</span>
				</p>
				<button className='btn-delete' onClick={() => onDeleteWatched(movie.imdbID)}>
					x
				</button>
			</div>
		</li>
	);
};
