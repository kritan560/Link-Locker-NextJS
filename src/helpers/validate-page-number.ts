type ValidatePageNumberArgs = {
  page: string;
  totalData: number | null;
};

type ValidatePageNumberReturnType = {
  currentPageNumber: number;
  totalPageNumber: number;
};

/**
 * This helper function will validate and calculate the page number
 *
 * returns the page number based on provided page argument and totalPage
 *
 * @param {Object} args - The arguments for page number validation.
 * @param {string} args.page - The page number as a string.
 * @param {number|null} args.totalData - The total number of pages, or null if not applicable.
 * @returns The current page number
 */
export function ValidatePageNumber(
  args: ValidatePageNumberArgs
): ValidatePageNumberReturnType {
  const { totalData, page } = args;

  const NUM_OF_DATA_DISPLAYED_PER_PAGE = 10;

  // if user manually wrote ?page=-2 making it absolute value
  const pageNumber = Math.abs(parseInt(page));

  // calculate the totalPageNumber based on NUM_OF_DATA_DISPLAYED_PER_PAGE
  const totalNumberOfData = totalData ?? 0;
  const totalPageNumber = Math.ceil(
    totalNumberOfData / NUM_OF_DATA_DISPLAYED_PER_PAGE
  );

  // given page number greater than totalNumberOfData return totalNumberOfData
  if (pageNumber > totalPageNumber) {
    return {
      currentPageNumber: totalPageNumber,
      totalPageNumber: totalPageNumber,
    };
  }

  // if user manually wrote ?page=helloworld return the first page
  if (isNaN(pageNumber)) {
    return { currentPageNumber: 0, totalPageNumber };
  }

  // the main entery point : http://localhost:3000 reutrn 1st page
  if (!page) {
    return { currentPageNumber: 0, totalPageNumber };
  }

  return { currentPageNumber: pageNumber, totalPageNumber: totalPageNumber };
}
