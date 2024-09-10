import { Grid2, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import BasicLineChart from "./components/chart/lineChart";
export default function About() {
  return (
    <Container maxWidth="lg">
      <Grid2 container spacing={2} marginBottom={5} direction={'row'} marginTop={5}>
        <Grid2 size={6} border={2}>
          <BasicLineChart></BasicLineChart>
        </Grid2>

        <Grid2 size={6} border={2}>
          <BasicLineChart></BasicLineChart>
        </Grid2>
      </Grid2>
      <Stack
        direction={"row"}
        spacing={2}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Button color="success" variant="contained">
          Contained
        </Button>
      </Stack>
    </Container>
  );
}
