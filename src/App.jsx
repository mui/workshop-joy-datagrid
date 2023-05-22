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
} from "@mui/x-data-grid";
import { unstable_joySlots as joySlots } from "@mui/x-data-grid/joy";
import DeleteIcon from "@mui/icons-material/Delete";
import countries from "./countries.json";

const DATA = [
  {
    id: "1",
    name: "spray",
    manufacturedDate: new Date().toString(),
    price: 200,
  },
  {
    id: "2",
    name: "foam",
    manufacturedDate: new Date("2021-05-22").toString(),
    price: 120,
  },
];

function App() {
  return (
    <Container>
      <CssBaseline />
      <Typography component="h1" level="h3" sx={{ my: 3 }}>
        Joy DataGrid - CRUD Workshop
      </Typography>
      <DataGrid
        columns={[
          {
            field: "id",
            headerName: "ID",
          },
        ]}
        rows={DATA}
      />
    </Container>
  );
}

export default App;
