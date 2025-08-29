import { Layout } from './ui/Layout';
import { BoardView } from '../features/view-board';
import { StoreProvider } from './providers/StoreProvider';

function App() {
  return (
    <StoreProvider>
      <Layout>
        <div className="7xl mx-auto">
          <BoardView boardId="board-1" />
        </div>
      </Layout>
    </StoreProvider>
  );
}

export default App;