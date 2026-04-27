import DeckExplorer from '../components/DeckExplorer';
import { getDecks } from '../lib/decks';

export default async function HomePage() {
  const decks = await getDecks();
  const assetVersion = new Date().toISOString();

  return <DeckExplorer decks={decks} assetVersion={assetVersion} />;
}
