import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SearchItem from "./SearchItem";
import { type SearchItemData } from "../../types/search";

interface SearchMenuProps {
  id?: string;
  SearchList: SearchItemData[] | null;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  visible: boolean;
}

const SearchMenu: React.FC<SearchMenuProps> = ({
  id,
  SearchList,
  anchorRef,
  visible,
}) => {
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 5,
    left: 20,
  });

  useEffect(() => {
    if (anchorRef.current && visible) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 8, left: rect.left });
    }
  }, [anchorRef, visible]);

  if (!visible || !anchorRef.current) return null;

  let content: React.ReactNode;

  if (SearchList === null || SearchList?.length === 0) {
    content = (
      <div className="flex flex-col justify-center min-h-50 text-sm text-center text-black dark:text-white">
        <p>There is no result matching your search</p>
      </div>
    );
  }

  if (SearchList && SearchList?.length > 0) {
    content = (
      <ul className="flex flex-col gap-3 px-1.5 max-h-50 overflow-auto custom-scrollbar">
        {SearchList.map((item, index) => (
          <SearchItem
            key={`${item.type}-${item._id}`}
            data={item}
            index={index}
          />
        ))}
      </ul>
    );
  }

  return createPortal(
    <menu
      id={id}
      className="absolute left-0 bg-white/80 dark:bg-gray-900/70 backdrop-blur-md shadow-2xl rounded-xl border-t-4 border-indigo-500 p-5 w-[200px] min-w-[240px] xl:min-w-[320px] z-50 text-black dark:text-white transition duration-300"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {content}
    </menu>,
    document.getElementById("search-root")!
  );
};

export default SearchMenu;
