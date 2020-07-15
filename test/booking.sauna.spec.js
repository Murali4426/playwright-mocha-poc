const BookingPage = require("./booking.page")
const playwright = require("playwright");
const chai = require("chai");
const assertArrays = require('chai-arrays');
chai.use(assertArrays);
const expect = chai.expect;
const BASE_URL = "http://booking.com/";

// playwright variables
let page, browser, context, count, bookingPage

describe("booking.com - search hotels 3 months ahread from today for 2 adults/1 night/sauna", async () => {
  before(async () => {
    browser = await playwright["chromium"].launch({ headless: false });
    context = await browser.newContext({
      viewport: {
        width: 1366, 
        height: 768, 
      },
    });
    context.clearCookies();
    page = await context.newPage(BASE_URL);
    bookingPage = new BookingPage(page, context)
  });

  after(async function () {
    await page.screenshot({
      path: `${this.currentTest.title.replace(/\s+/g, "_")}.png`,
    });
    await browser.close();
  });

  it("Given I am on Booking.com webpage", async () => {
    await bookingPage.waitForLogo();
  });

  it("When I search for hotels in Limerick", async () => {
    await bookingPage.waitForDestination()
    await bookingPage.waitForCheckInDate()
    await bookingPage.waitForCheckOutDate()
    await bookingPage.enterLocation("Limerick")
    const checkInDate = await bookingPage.addMonths(3)
    await bookingPage.fillInCheckInDate(checkInDate) // by months
    await bookingPage.fillInCheckOutDate(checkInDate,1) // by days
    await bookingPage.clickSubmit()
    await page.waitFor(5000);
    await bookingPage.SelectCheckBox('Poupular filters', 'Hotels')
    await page.waitFor(5000);
    await bookingPage.SelectCheckBox('Fun things to do', 'Sauna')
    await page.waitFor(1000);
  });

  it("Then I see a list of hotels for my selection on the results table", async () => {
    await bookingPage.waitForResultsHeader()
    const resultsHeader = await bookingPage.getResultsTableHeader()

    // verify Search Results Table Heading
    expect(resultsHeader ).to.equal('Limerick: 5 properties found');

    // Verify a list of hotels from the search results table
    await bookingPage.waitForSearchResultsTable()
    const hotelArray = await bookingPage.getSearchResults()
    console.info('hotelArray', hotelArray)

    expect(hotelArray.some(resultTableHotelName => resultTableHotelName.includes('Limerick Strand Hotel')), ' Limerick Strand Hotel not found').to.be.true;
    expect(hotelArray.some(resultTableHotelName => resultTableHotelName.includes('Pery\'s Hotel')), ' Pery\'s Hotel not found').to.be.true;
    expect(
      hotelArray
  ).not.to.be.containing('George Limerick Hotel', ' should not contain George Limerick Hotel')
  });
  
});


