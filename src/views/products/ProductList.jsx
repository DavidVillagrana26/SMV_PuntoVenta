import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  User,
  Checkbox,
} from "@nextui-org/react";
import { statusOptions } from "./data";
import { TbDotsVertical, TbPlus, TbReload } from "react-icons/tb";
import { MdArrowDropDown, MdSearch, MdShoppingCart } from "react-icons/md";
import Header from "../../components/header/headerC/Header";
import ItemsHeader from "../../components/header/ItemsHeader/ItemsHeader";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { RiDashboard2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
const columns = [
  { name: "Imagen", uid: "Imagen", sortable: true },
  { name: "ID", uid: "ID", sortable: true },
  { name: "Cod.Fab.", uid: "CodFab", sortable: true },
  { name: "Cod.Emp.", uid: "CodEmp", sortable: true },
  { name: "Nombre/Descripción", uid: "Nombre" },
  { name: "Marca", uid: "Marca" },
  { name: "Categoría", uid: "Categoria", sortable: true },
  { name: "Cod.SAT", uid: "CodSAT" },
  { name: "Actualizado", uid: "Actualizado", sortable: true },
  { name: "Activo", uid: "Activo", sortable: true },
  { name: "Web", uid: "Web", sortable: true },
  { name: "POS", uid: "POS", sortable: true },
  { name: "Venta", uid: "Venta" },
  { name: "Precio", uid: "Precio" },
  { name: "Acciones", uid: "Actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "Imagen",
  "ID",
  "CodFab",
  "CodEmp",
  "Nombre",
  "Marca",
  "Categoria",
  "CodSAT",
  "Actualizado",
  "Activo",
  "Web",
  "POS",
  "Venta",
  "Precio",
  "Actions",
];

const ProductList = () => {
  const marcaOptions = [];
  function contarmarca(){
    for (let i = 0; i < data.length; i++) {
      marcaOptions.push({ name: data[i].marca, uid: data[i].idproducto });
    }
  }
  
  const [data, setData] = useState([]);
  async function loadTask() {
    try {
      const response = await fetch("http://localhost:4000/Productos");
      const data = await response.json();
      if (response.ok) {
        setData(data);
        contarmarca();
        console.log(marcaOptions);
      }
    } catch {
      toast.error("Error al cargar los datos", {
        position: "bottom-right",
        theme: "colored",
      });
    }
  }
  useEffect(() => {
    loadTask();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function handleClickBreadCrumbs(event) {
    event.preventDefault();
  }
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...data];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((data) =>
        data.nombre.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((data) =>
        Array.from(statusFilter).includes(data.nombre)
      );
    }

    return filteredUsers;
  }, [data, hasSearchFilter, statusFilter, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((data, columnKey) => {
    const cellValue = data[columnKey];

    switch (columnKey) {
      case "name":
        return <User avatarProps={{ radius: "lg", src: data.avatar }} />;
      case "Nombre":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{data.nombre}</p>
          </div>
        );
      case "ID":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{data.idproducto}</p>
          </div>
        );
      case "CodFab":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {data.codigoFabricante}
            </p>
          </div>
        );
      case "CodEmp":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {data.codigoEmpresa}
            </p>
          </div>
        );
      case "Marca":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{data.marca}</p>
          </div>
        );
      case "Categoria":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{data.categoria}</p>
          </div>
        );
      case "CodSAT":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">Aun no se define</p>
          </div>
        );
      case "Actualizado":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">Generico</p>
          </div>
        );
      case "Activo":
        return (
          <div className="flex flex-col">
            <Checkbox defaultSelected radius="sm"></Checkbox>
          </div>
        );
      case "Web":
        return (
          <div className="flex flex-col">
            <Checkbox defaultSelected radius="sm"></Checkbox>
          </div>
        );
      case "POS":
        return (
          <div className="flex flex-col">
            <Checkbox defaultSelected radius="sm"></Checkbox>
          </div>
        );
      case "Venta":
        return (
          <div className="flex flex-col">
            <Checkbox defaultSelected radius="sm"></Checkbox>
          </div>
        );
      case "Precio":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">$ {data.precio}</p>
          </div>
        );
      case "Actions":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <TbDotsVertical className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>View</DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <>
        <Header />
        <ItemsHeader />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div
          role="presentation"
          onClick={handleClickBreadCrumbs}
          className="text-foreground"
        >
          <Breadcrumbs aria-label="breadcrumb" color="foreground">
            <Link
              className="text-foreground"
              underline="hover"
              sx={{ display: "flex", alignItems: "center" }}
              color="foreground"
              href="#"
              onClick={() => navigate(`/Home`)}
            >
              <RiDashboard2Fill sx={{ mr: 0.5 }} fontSize="inherit" />
              Inicio
            </Link>
            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              className="text-foreground"
            >
              <MdShoppingCart sx={{ mr: 0.5 }} fontSize="inherit" />
              Listado de Productos
            </Typography>
          </Breadcrumbs>
        </div>
        <div
          className="flex flex-col gap-4"
          style={{ marginLeft: "10px", marginRight: "10px" }}
        >
          <div className="flex flex-wrap place-content-start space-x-6 space-y-1 ">
            <Input
              isClearable
              size="sm"
              className="w-[450px] sm:max-w-[44%]"
              placeholder="Productos"
              startContent={<MdSearch />}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
            <Dropdown>
              <DropdownTrigger className="w-[300px] sm:max-w-[44%]">
                <Button
                  size="sm"
                  endContent={<MdArrowDropDown className="text-small" />}
                  variant="flat"
                >
                  Marca
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {marcaOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {status.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="w-[300px] sm:max-w-[44%]">
                <Button
                  size="sm"
                  endContent={<MdArrowDropDown className="text-small" />}
                  variant="flat"
                >
                  Categoría
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {status.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="w-[300px] sm:max-w-[44%]">
                <Button
                  size="sm"
                  endContent={<MdArrowDropDown className="text-small" />}
                  variant="flat"
                >
                  Proveedor
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {status.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="flex flex-wrap place-content-end space-x-2">
            <Button size="sm" color="warning" endContent={<TbReload />}>
              Actualizar precios
            </Button>
            <Button size="sm" color="warning" endContent={<TbReload />}>
              Actualizar costos
            </Button>
            <Button size="sm" color="primary" endContent={<TbPlus />}>
              Nuevo Producto
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap text-small space-x-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  size="sm"
                  endContent={<MdArrowDropDown className="text-small" />}
                  variant="flat"
                >
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<MdArrowDropDown className="text-small" />}
                  variant="flat"
                  size="sm"
                >
                  Acciones
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
          <label className="flex items-center text-default-400 text-small">
            Productos por página:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </>
    );
  }, [
    filterValue,
    onSearchChange,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    navigate,
    onClear,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          <span style={{ marginRight: "30px" }}>
            {data.length} productos en total
          </span>
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${data.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [
    selectedKeys,
    filteredItems.length,
    page,
    pages,
    onPreviousPage,
    onNextPage,
  ]);

  return (
    <div style={{ marginLeft: "40px", marginRight: "40px" }}>
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"No se encuentran productos"}
          items={sortedItems}
        >
          {(item) => (
            <TableRow key={item.idproducto}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductList;
