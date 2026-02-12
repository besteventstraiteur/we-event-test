export const PAGE_HEIGHT = 1120; // A4 preview height
export const BLOCK_GAP = 24;

export function splitBlocksIntoPages(
  blocks: string[],
  blockHeights: Record<string, number>
) {
  const pages: string[][] = [];
  let currentPage: string[] = [];
  let height = 0;

  blocks.forEach((id) => {
    const h = blockHeights[id] || 200;

    if (height + h > PAGE_HEIGHT) {
      pages.push(currentPage);
      currentPage = [];
      height = 0;
    }

    currentPage.push(id);
    height += h + BLOCK_GAP;
  });

  if (currentPage.length) pages.push(currentPage);
  return pages;
}
