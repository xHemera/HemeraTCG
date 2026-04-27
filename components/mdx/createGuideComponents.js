import DeckTip from './DeckTip';
import WarningBox from './WarningBox';
import ImageFigure from './ImageFigure';
import MatchupTable from './MatchupTable';
import CardGrid from './CardGrid';
import { withBasePath } from '../../lib/site';

export const createGuideComponents = ({ assetVersion, cacheBustUrl }) => {
  const DeckImage = ({ src = '', alt = '', ...props }) => {
    const resolvedSrc = src.startsWith('http') ? src : cacheBustUrl(withBasePath(src), assetVersion);
    return <img src={resolvedSrc} alt={alt} {...props} />;
  };

  const DeckLink = ({ href = '', ...props }) => {
    if (/^https?:\/\//i.test(href)) {
      return <a href={href} target="_blank" rel="noreferrer" {...props} />;
    }

    return <a href={withBasePath(href)} {...props} />;
  };

  const DeckImageFigure = ({ src = '', ...props }) => {
    const resolvedSrc = src.startsWith('http') ? src : cacheBustUrl(withBasePath(src), assetVersion);
    return <ImageFigure src={resolvedSrc} {...props} />;
  };

  const DeckCardGrid = ({ cards = [] }) => {
    const normalizedCards = cards.map((card) => {
      if (!card || typeof card !== 'object') return card;
      if (!card.image || card.image.startsWith('http')) return card;
      return {
        ...card,
        image: cacheBustUrl(withBasePath(card.image), assetVersion)
      };
    });

    return <CardGrid cards={normalizedCards} />;
  };

  return {
    img: DeckImage,
    a: DeckLink,
    DeckTip,
    WarningBox,
    ImageFigure: DeckImageFigure,
    MatchupTable,
    CardGrid: DeckCardGrid
  };
};
