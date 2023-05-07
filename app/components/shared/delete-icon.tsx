import { MouseEvent } from "react";

type DeleteIconProps = {
	onClick?: (e: MouseEvent<any>) => void;
};

const DeleteIcon = ({ onClick }: DeleteIconProps) => {
	return(
		<i className="fa-solid fa-trash cursor-pointer text-gray-500 duration-300 ease-in-out hover:text-gray-900" onClick={onClick}></i>
	);
};

export default DeleteIcon;