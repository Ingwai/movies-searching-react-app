import { useEffect, useRef, useState } from 'react';
import StarRating from './StarRating';
import { useKey } from '../useKey';
import { Loader } from './Loader';
import { KEY } from '../App';
import { useWebsiteTitle } from '../useWebsiteTitle';

export const MovieDetails = ({ selectedId, onCloseMovie, onAddWatched, watched }) => {
	const [movie, setMovies] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [userRating, setUserRating] = useState('');

	const countRef = useRef(0);

	useEffect(() => {
		if (userRating) countRef.current++;
	}, [userRating]);

	const isWatched = watched.map(movie => movie.imdbID).includes(selectedId);
	const watchedUserRating = watched.find(movie => movie.imdbID === selectedId)?.userRating;

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
			countRatingDecision: countRef.current,
		};
		onAddWatched(newWatchedMovie);
		onCloseMovie();
	};

	useKey('Escape', onCloseMovie);

	useEffect(() => {
		async function getMovieDetails() {
			setIsLoading(true);
			const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);

			const data = await res.json();
			setMovies(data);
			setIsLoading(false);
		}
		getMovieDetails();
	}, [selectedId]);

	useWebsiteTitle(title);

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
