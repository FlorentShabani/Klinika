import { NotePencil, X, Check } from "@phosphor-icons/react";
import Skeleton from "./skeleton/Table";
import { useHandler, usePagination } from "../__handata";
import { useFormStore } from "../store/FormStore";
import { ChangeEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";
import Pagination from "./Pagination";

interface TableProps<T> {
  headers: string[];
  all: () => Promise<T[]>;
  delete: (id: string) => Promise<void>;
  dataField: string[];
}

interface ResponseType<T> {
  [key: string]: T[];
}

export default function Table<T>({
  headers,
  all,
  delete: getDeleted,
  dataField,
}: TableProps<T>) {
  const HEADER_COLUMN = headers.length + 3;
  const { openEdit: edit, refetch_data: handler } = useHandler();
  const { loading, startIndex, endIndex, setDataLength, setLoading } =
    usePagination();
  const {
    selectedItems,
    selectItem,
    deselectItem,
    selectAll,
    deselectAll,
    setSelectedItem,
  } = useFormStore();
  const [data, setData] = useState<T[] | undefined>([]);
  const fetchData = async () => {
    try {
      const response: ResponseType<T> = await all();
      setData(response);
      setDataLength(response.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Selecting all
  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      selectAll();
    } else {
      deselectAll();
    }
  };

  // For "select 1 item"
  const handleSelectItem = (
    id: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const stringId = String(id); // Convert id to string
    if (event.target.checked) {
      selectItem(stringId);
    } else {
      deselectItem(stringId);
    }
  };

  const handleItem = (id: number) => {
    const stringId = String(id);
    if (selectedItems.includes(stringId)) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    fetchData();
  }, [handler]);

  const deleteItem = async (id: string) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          getDeleted(id).then(() => {
            Swal.fire({
              icon: "success",
              title: "Deleted",
              text: "Succesfuly deleted",
            }).then(() => {
              fetchData();
            });
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  const refined_data = data ? data.slice(startIndex, endIndex) : [];
  const allItemsSelected = selectedItems.length === refined_data.length;

  if (loading) {
    return <Skeleton column={HEADER_COLUMN} headers={headers} />;
  }

  return (
    <div className="w-full h-[675px] mt-6 rounded-sm">
      <ul className={`grid grid-cols-7 py-2 px-2 border-b-2 text-compact/40`}>
        <li>
          <label
            className={`flex justify-center items-center border border-zinc-200 hover:border-zinc-300 overflow-hidden w-5 h-5 rounded-md relative cursor-pointer`}
          >
            <input
              title="Select all items"
              type="checkbox"
              checked={allItemsSelected}
              onChange={handleSelectAll}
              className={`relative appearance-none bg-white w-full h-full checked:bg-black`}
            />
            <span className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
              <Check size={14} weight="bold" className="text-white" />
            </span>
          </label>
        </li>
        {headers.map((header) => (
          <li key={header}>{header}</li>
        ))}
        <li>Edit item</li>
        <li>Remove item</li>
      </ul>
      <div className="h-full overflow-x-auto bg-zinc-50">
        {refined_data.map((item) => (
          <ul
            key={item.id}
            className={`grid group bg-white grid-cols-7 hover:bg-zinc-50 transition-colors items-center px-2 border-b text-xs py-2.5`}
          >
            <li>
              <label
                className={`flex justify-center items-center border border-transparent group-hover:border-zinc-100 overflow-hidden w-5 h-5 rounded-md relative cursor-pointer`}
              >
                <input
                  title="Select item"
                  type="checkbox"
                  checked={handleItem(item.id)}
                  onChange={(event) => handleSelectItem(item.id, event)}
                  className={`relative appearance-none bg-white w-full h-full checked:bg-black`}
                />
                <span className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                  <Check size={14} weight="bold" className=" text-white" />
                </span>
              </label>
            </li>
            {dataField.map((key) => (
              <li title={item[key]} key={key} className="line-clamp-1">
                {key === "creationDate"
                  ? new Date(item[key]).toLocaleString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : item[key]}
              </li>
            ))}
            <li>
              <button
                title="Edit item"
                type="button"
                onClick={() => {
                  setSelectedItem(item.id);
                  edit();
                }}
                className="flex items-center gap-1 px-4 py-1 rounded-lg bg-blue-200 text-blue-950 hover:bg-blue-300"
              >
                <NotePencil size={14} />
                Edit
              </button>
            </li>
            <li>
              <button
                title="Remove item"
                type="button"
                onClick={() => deleteItem(item.id)}
                className="flex items-center gap-1 px-4 py-1 rounded-lg bg-red-200 text-red-950 hover:bg-red-300"
              >
                <X size={14} />
                Remove
              </button>
            </li>
          </ul>
        ))}
      </div>
      <Pagination />
    </div>
  );
}
