import Image from "next/image";
import React from "react";
import Trash from "../../../../assets/trash.png";
import Plus from "../../../../assets/plus-green.png";
import Edit from "../../../../assets/edit.png";

type Props = {
  add: () => void;
  edit: () => void;
  remove: () => void;
};

export default function Actions({ add, edit, remove }: Props) {

  const makeAction = (action: () => void) => {
    action();
  }

  return (
    <div className="flex items-center justify-end gap-3 self-start mt-1">
      <Image
        className="w-6 h-6 cursor-pointer"
        src={Plus}
        alt="add button car"
        onClick={() => makeAction(add)}
      />
      {/* <Image
        className="w-6 h-6 cursor-pointer"
        src={Edit}
        alt="edit button car"
        onClick={edit}
      /> */}
      <Image
        className="w-6 h-6 cursor-pointer"
        src={Trash}
        alt="delete button car"
        onClick={remove}
      />
    </div>
  );
}
