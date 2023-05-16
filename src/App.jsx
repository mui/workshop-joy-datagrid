import CssBaseline from "@mui/joy/CssBaseline";
import Container from "@mui/joy/Container";
import Typography from "@mui/joy/Typography";
import { DataGrid } from "@mui/x-data-grid";
import { unstable_joySlots as joySlots } from "@mui/x-data-grid/joy";

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
            // to learn more, visit: https://mui.com/x/react-data-grid/column-definition/#value-formatter
            valueFormatter: (params) => new Date(params.value).toDateString(),
          },
        ]}
        rows={DATA}
        slots={joySlots} // to learn more about component slots, visit: https://mui.com/x/react-data-grid/components/#component-slots
      />
    </Container>
  );
}

export default App;
