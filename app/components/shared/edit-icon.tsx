import { MouseEvent } from "react";

type EditIconProps = {
  onClick?: (e: MouseEvent<any>) => void;
};

const EditIcon = ({ onClick }: EditIconProps) => {
  return (
    <i
      className="fa-solid fa-pen-to-square cursor-pointer text-gray-500 duration-300 ease-in-out hover:text-gray-900"
      onClick={onClick}
    ></i>
  );
};

export default EditIcon;
