import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import Autocomplete from "@mui/joy/Autocomplete";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import CssBaseline from "@mui/joy/CssBaseline";
import Container from "@mui/joy/Container";
import Typography from "@mui/joy/Typography";
import {
  DataGrid,
  GridToolbarContainer,
  useGridApiContext,
  GridActionsCellItem,
  GridRenderEditCellParams,
} from "@mui/x-data-grid";
import { unstable_joySlots as joySlots } from "@mui/x-data-grid/joy";
import DeleteIcon from "@mui/icons-material/Delete";
import countries from "./countries.json";
import { Product } from "./mocks/browser";

function EditToolbar() {
  const apiRef = useGridApiContext();
  return (
    <GridToolbarContainer>
      <Button
        color="primary"
        onClick={() => {
          const id = "temporary-id"; // `id` is required to create a new row;
          apiRef.current.updateRows([
            {
              id,
              name: "New",
              manufacturedDate: null,
              manufacturedCountry: null,
              price: 0,
            },
          ]);
          apiRef.current.startRowEditMode({
            id,
            fieldToFocus: "manufacturedCountry",
          });
        }}
      >
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

function App() {
  const [rows, setRows] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    fetch("/products")
      .then((response) => response.json())
      .then((data: Product[]) => {
        setRows(data);
        setIsLoading(false);
      });
  }, []);
  return (
    <Container>
      <CssBaseline />
      <Typography component="h1" level="h3" sx={{ my: 3 }}>
        Joy DataGrid - CRUD Workshop
      </Typography>
      <DataGrid
        loading={isLoading}
        editMode="row"
        processRowUpdate={async (newRow) => {
          const isExistingRow = newRow.id !== "temporary-id"; // check if row is new
          if (isExistingRow) {
            setIsLoading(true);
            await fetch(`/products/${newRow.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newRow),
            });
            setIsLoading(false);
            setRows((prevRows) =>
              prevRows.map((item) => (item.id === newRow.id ? newRow : item))
            );
            return newRow;
          }
          // triggered when user stop editing a row
          // to learn more, visit: https://mui.com/x/react-data-grid/editing/#persistence
          const newId = uuid(); // generate unique id
          const updatedRow = { ...newRow, id: newId };

          setIsLoading(true);
          const res = await fetch(`/products`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedRow),
          });
          if (res.ok) {
            setIsLoading(false);
            setRows((prevRows) => [...prevRows, updatedRow]);
            return updatedRow;
          } else {
            const error = await res.json();
            setIsLoading(false);
            // Reject the promise so that the internal state is not updated and the cell remains in edit mode
            throw error;
          }
        }}
        onProcessRowUpdateError={(error) => {
          alert(error.message ?? "Unknow error");
        }}
        columns={[
          {
            field: "id",
            headerName: "ID",
          },
          {
            field: "manufacturedCountry",
            headerName: "Manufactured country",
            width: 240,
            editable: true,
            renderCell: (params) =>
              params.value ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <img
                    loading="lazy"
                    width="20"
                    src={`https://flagcdn.com/w20/${params.value.code.toLowerCase()}.png`}
                    srcSet={`https://flagcdn.com/w40/${params.value.code.toLowerCase()}.png 2x`}
                    alt=""
                  />
                  {params.value.label}
                </Box>
              ) : null,
            renderEditCell: (
              params: GridRenderEditCellParams<
                {},
                {
                  code: string;
                  label: string;
                  phone: string;
                } | null
              >
            ) => (
              <Autocomplete
                placeholder="Choose a country"
                autoFocus
                openOnFocus
                options={countries}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                  <AutocompleteOption {...props}>
                    <ListItemDecorator>
                      <img
                        loading="lazy"
                        width="20"
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                        alt=""
                      />
                    </ListItemDecorator>
                    <ListItemContent sx={{ fontSize: "sm" }}>
                      {option.label}
                      <Typography level="body3">
                        ({option.code}) +{option.phone}
                      </Typography>
                    </ListItemContent>
                  </AutocompleteOption>
                )}
                // If `code` is not set, it means that the user has not selected any option
                value={params.value?.code ? params.value : null}
                onChange={(event, value) => {
                  params.api.setEditCellValue({
                    field: params.field,
                    id: params.id,
                    value,
                  });
                }}
                variant="plain" // see all the variants at https://mui.com/joy-ui/react-autocomplete/#variants
                sx={{
                  "--Input-focusedHighlight": "transparent", // to remove the focused highlight
                  width: "100%",
                }}
              />
            ),
          },
          {
            field: "name",
            headerName: "Name",
            width: 160,
            editable: true,
          },
          {
            field: "price",
            headerName: "Price",
            width: 160,
            editable: true,
            type: "number",
          },
          {
            field: "manufacturedDate",
            headerName: "Manufactured date",
            width: 160,
            editable: true,
            type: "date",
            // to turn the string value (DATA.manufacturedDate) into a Date object
            // so that the filter and sort function work properly
            // to learn more, visit: https://mui.com/x/react-data-grid/column-definition/#value-getter
            valueGetter: (params) => new Date(params.value),
            // to format the date value from `valueGetter`.
            // to learn more, visit: https://mui.com/x/react-data-grid/column-definition/#value-formatter
            valueFormatter: (params) => new Date(params.value).toDateString(),
          },
          {
            field: "actions",
            type: "actions",
            getActions: (params) => [
              <GridActionsCellItem
                key="delete"
                icon={<DeleteIcon />}
                label="Delete"
                onClick={async () => {
                  setIsLoading(true);
                  await fetch(`/products/${params.row.id}`, {
                    method: "DELETE",
                  });
                  await fetch("/products")
                    .then((response) => response.json())
                    .then((data) => {
                      setRows(data);
                    });
                  setIsLoading(false);
                }}
                color="inherit"
              />,
            ],
          },
        ]}
        rows={rows}
        slots={{ ...joySlots, toolbar: EditToolbar }} // to learn more about component slots, visit: https://mui.com/x/react-data-grid/components/#component-slots
        autoHeight
      />
    </Container>
  );
}

export default App;
