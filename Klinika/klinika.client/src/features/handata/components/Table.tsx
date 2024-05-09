import {ArrowsDownUp, Check, NotePencil, X} from "@phosphor-icons/react";
import Skeleton from "./skeleton/Table";
import {zForm, zHandler, zPagination} from "../__handata";
import {ChangeEvent, CSSProperties, Fragment, useState} from "react";
import Swal from "sweetalert2";
import Pagination from "./Pagination";
import {useQuery} from "react-query";
import {useConditionalEffect} from "../hooks/useConditionalEffect";

interface Item {
    id: string | number;
    creationDate: string;
    birthDate: string;

    [key: string]: string | number;
}

interface ResponseData {
    data: Item[];
    totalPages: number;
}

interface TableProps {
    headers: string[];
    all: (currentPage: number, pageSize: number, search: string) => Promise<Item[]>;
    delete: (id: string | number) => Promise<void>;
    dataField: string[];
}

export default function Table({
                                  headers,
                                  all,
                                  delete: getDeleted,
                                  dataField,
                              }: TableProps) {
    const HEADER_COLUMN = headers.length + 3;
    const {openEdit: edit, refetch_data: handler} = zHandler();
    const {setTotalPages, currentPage, itemsPerPage, totalPages} =
        zPagination();
    const [loading, setLoading] = useState<boolean>(true);
    const {
        search: searchValue,
        selectedItems,
        selectItem,
        deselectItem,
        selectAll,
        deselectAll,
        setSelectedItem,
    } = zForm();
    const {data, isLoading, refetch} = useQuery(
        ["paginate", handler, searchValue, currentPage],
        () => all(currentPage, itemsPerPage, searchValue),
        {
            onSuccess: (data: ResponseData) => {
                setTotalPages(data.totalPages);
                console.log(data.totalPages)
            },
            onSettled: () => {
                setLoading(false);
            },

        }
    );


    useConditionalEffect(
        () => {
            return () => deselectAll();
        },
        selectedItems.length > 0,
        []
    );

    const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked && data) {
            const allIds = data.data.map((item: { id: number | string }) => String(item.id));
            selectAll(allIds);
        } else {
            deselectAll();
        }
    };

    const handleSelectItem = (
        id: string | number,
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const stringId = String(id);
        if (event.target.checked) {
            selectItem(stringId);
        } else {
            deselectItem(stringId);
        }
    };

    const handleItem = (id: number | string) => {
        const stringId = String(id);
        return selectedItems.includes(stringId);
    };

    const deleteItem = async (id: string | number) => {
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
                            text: "Successfully deleted",
                        }).then(() => {
                            refetch();
                        });
                    });
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const styles: CSSProperties = {
        display: "grid",
        gap: "12px",
        gridTemplateColumns: `repeat(${HEADER_COLUMN}, minmax(0, 1fr))`,
    };

    if (isLoading || loading) {
        return <Skeleton style={styles} headers={headers}/>;
    }

    return (
        <Fragment>
            <div className="overflow-y-auto">
                <div className="min-w-[700px] w-full overflow-y-clip h-[717px] mt-6 rounded-sm">
                    <ul className={`py-2 px-2 border-b-2 text-compact/40`} style={styles}>
                        <li>
                            <label
                                className={`flex truncate justify-center items-center border border-zinc-200 hover:border-zinc-300 overflow-hidden w-5 h-5 rounded-md relative cursor-pointer`}
                            >
                                <input
                                    title="Select all items"
                                    type="checkbox"
                                    name="selectAll"
                                    id="selectAll"
                                    // checked={allItemsSelected}
                                    onChange={handleSelectAll}
                                    className={`relative appearance-none bg-white w-full h-full checked:bg-black`}
                                />
                                <span
                                    className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                  <Check size={14} weight="bold" className="text-white"/>
                </span>
                            </label>
                        </li>
                        {headers.map((header) => (
                            <li
                                key={header}
                                className="flex truncate flex-row items-center group cursor-pointer"
                            >
                                {header}
                                <ArrowsDownUp size={20} className="group-hover:block hidden"/>
                            </li>
                        ))}
                        <li className="truncate">Edit item</li>
                        <li className="truncate">Remove item</li>
                    </ul>
                    <div className="h-full bg-zinc-50">
                        {data?.data.map((item: Item) => (
                            <ul
                                key={item.id}
                                style={styles}
                                className={`group bg-white hover:bg-zinc-50 transition-colors items-center px-2 border-b text-xs py-2.5`}
                            >
                                <li>
                                    <label
                                        className={`flex justify-center items-center border border-transparent group-hover:border-zinc-100 overflow-hidden w-5 h-5 rounded-md relative cursor-pointer`}
                                    >
                                        <input
                                            title="Select item"
                                            type="checkbox"
                                            name="selectItem"
                                            id="selectItem"
                                            checked={handleItem(item.id)}
                                            onChange={(event) => handleSelectItem(item.id, event)}
                                            className={`relative appearance-none bg-white w-full h-full checked:bg-black`}
                                        />
                                        <span
                                            className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                      <Check size={14} weight="bold" className=" text-white"/>
                    </span>
                                    </label>
                                </li>
                                {dataField.map((key: string | number) => {
                                    const itemKey = (typeof item[key] === "number" ? item[key].toString() : item[key]) as string;
                                    return (
                                        <li title={itemKey} key={key} className="line-clamp-1">
                                            {key === "creationDate" || key === "birthDate"
                                                ? new Date(item[key]).toLocaleString("en-US", {
                                                    month: "short",
                                                    day: "2-digit",
                                                    year: "numeric",
                                                })
                                                : item[key]}
                                        </li>
                                    )
                                })}
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
                                        <NotePencil size={14}/>
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
                                        <X size={14}/>
                                        Remove
                                    </button>
                                </li>
                            </ul>
                        ))}
                    </div>
                </div>
            </div>
            <Pagination/>
        </Fragment>
    );
}
