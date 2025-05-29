import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './config/routes/routes.route';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
