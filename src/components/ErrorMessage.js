export const ErrorMessage = ({ message }) => {
	return (
		<p className='error'>
			<span>⛔</span>
			{message}
		</p>
	);
};
