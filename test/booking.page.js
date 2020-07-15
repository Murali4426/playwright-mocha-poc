const playwright = require("playwright");
const moment = require("moment");

module.exports =class BookingPage {
  constructor(page, context) {
    this.page = page;
    this.context = context;
  }

  logo = '#logo_no_globe_new_logo'
  search = 'input[type="search"]';
  checkIn = '.b-datepicker[data-mode="checkin"]';
  checkOut = '.b-datepicker[data-mode="checkout"]';
  calendarControl = ".bui-calendar__control";
  submitBtn = 'button[type="submit"]';
  popularActivities = '#filter_popular_activities .bui-checkbox'
  header = '.sr_header'
  searchResultTable = '#search_results_table'
  searchHotelTitle = '.sr-hotel__title'
  calendarTable = '.bui-calendar__dates tr td[data-date="%s"]';
  pupularFilter = '#filter_filter-suggestions .bui-checkbox';
  funFilter = '#filter_popular_activities .bui-checkbox';
  starFilter = '.filteroptions .bui-checkbox';
  filterLabel = '.filter_label'
  hotelTitle = '.sr-hotel__title'
  hotelName = '.sr-hotel__name'

  async waitForLogo() {
  
      await this.page.waitForSelector(this.logo, { timeout: 1500 });
   
  }

  async enterLocation(location) {
    await this.page.waitForSelector(this.search);
    const $search = await this.page.$(this.search);
    await $search.type(location);
  }

  async waitForDestination() {
    await this.page.waitForSelector(this.search, {
      timeout: 2 * 1000,
      state: "visible",
    });
  }

  async waitForCheckInDate() {
    await this.page.waitForSelector(this.checkIn, {
      timeout: 2 * 1000,
      state: "visible",
    });
  }

  async waitForCheckOutDate() {
    await this.page.waitForSelector(this.checkOut, {
      timeout: 2 * 1000,
      state: "visible",
    });
  }

  async fillInCheckInDate(checkInDate) {
    console.info("selectDate ", checkInDate);

    /*
	Fill up Check-in
	*/
    const $checkIn = await this.page.$(this.checkIn);
    $checkIn.click();

    // Foward 3 months
    const $calendarControl = await this.page.$$(this.calendarControl);
    await $calendarControl[1].click();
    await $calendarControl[1].click();
    await $calendarControl[1].click();

    // select date from datepicker
    let loc =  this.calendarTable.replace("%s", checkInDate);
    const $calendarDate = await this.page.$(loc);
    await $calendarDate.click();
  }

  async fillInCheckOutDate(checkInDate, noOfDays) {
	
    const checkOutDate = moment(checkInDate)
      .add(noOfDays, "day")
      .format("YYYY-MM-DD");
    let loc = this.calendarTable.replace("%s", checkOutDate);
    const $calendarCheckOutDate = await this.page.$(loc);
    await $calendarCheckOutDate.click();
  }

  async clickSubmit() {
    const $submit = await this.page.$(this.submitBtn);
    await $submit.click();
  }

  async SelectCheckBox(filterBy, option) {
    let loc, count;
    if (filterBy === "Poupular filters") {
      loc = this.pupularFilter;
    } else if (filterBy === "Fun things to do") {
      loc = this.funFilter;
    } else if (filterBy === "Star rating") {
      loc = this.starFilter;
    }
    console.info('select category', loc)
    const popularElementHandles = await this.page.$$(loc);

    for (let elementHandle of popularElementHandles) {
      let text = await elementHandle.$eval(
        this.filterLabel,
        (element) => element.textContent
      );
      count++;
      text = text.replace(/(\r\n|\n|\r)/gm, "");
      console.log("text", text);
      if (text.includes(option)) {
        console.info(`${option} found`);
        await elementHandle.dblclick();
        console.info("count ", count);
        break;
      }
    }
  }

  async waitForResultsHeader() {
    await this.page.waitForSelector(this.header, {
      timeout: 2 * 1000,
      state: "visible",
    });
  }

  async getResultsTableHeader() {
    const headerElementHandle = await this.page.$(this.header);
    let text = await headerElementHandle.$eval(
      "h1",
      (element) => element.textContent
    );

    text = text.replace(/(\r\n|\n|\r)/gm, "");
    console.log("text", text);
    return text;
  }

  async waitForSearchResultsTable() {
    await this.page.waitForSelector(this.searchResultTable, {
      timeout: 2 * 1000,
      state: "visible",
    });
  }

  async getSearchResults() {
    const resultElementHandles = await this.page.$$(this.hotelTitle);
    console.info("result handler length", resultElementHandles.length);
    let count = 0;

    let hotelArray = [];
    let hotelName;
    for (let elementHandle of resultElementHandles) {
      hotelName = await elementHandle.$eval(
        ".sr-hotel__name",
        (element) => element.textContent
      );
      count++;
      hotelName = hotelName.replace(/(\r\n|\n|\r)/gm, "");
      console.log("hotel name", hotelName);
      hotelArray.push(hotelName);
    }

    return hotelArray;
  }

  async addMonths(noOfMonths) {
    const checkInDate = moment().add(noOfMonths, "month").format("YYYY-MM-DD");
    return checkInDate;
  }
}