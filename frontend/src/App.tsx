import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import "./App.css";
import RoutesComponent from "./RoutesComponent.tsx";
import { DatesProvider } from '@mantine/dates';

function App() {

  return (
    <MantineProvider>
      <DatesProvider settings={{ locale: "pl" }}>
        <RoutesComponent />
      </DatesProvider>
    </MantineProvider>
  );
}

export default App;
