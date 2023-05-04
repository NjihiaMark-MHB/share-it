const DeleteIcon = ({ onClick }: { onClick?: Function }) => {
	return(
		<i className="fa-solid fa-trash cursor-pointer text-gray-500 duration-300 ease-in-out hover:text-gray-900" onClick={() => (onClick as Function)()}></i>
	);
};

export default DeleteIcon;