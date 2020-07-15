# Automate booking.com mochaJS e2e tests

Microsoft playwright is a lastest testing framework released by Microsoft on 31st Jan 2020.
This has been used along with `mocha` and `chai` to automate `E2E Tests`

## Scripts

There is 2 playwright scripts in this repository:


* `test/booking.sauna.js` - script that goes to http://booking.com. It searchs hotels 3 months from today for 2 adults/1 night/Sauna

* `test/booking.star.js` - Script that goes to http://booking.com. It searchs hotels 3 months from today for 2 adults/1 night/5 Star 


In order to execute scripts, simply run on:

* Gitbash
```
npm install
npm run test
```

## Tests

Gherkin BDD is being used to describe the test
Page Object Pattern is being used to keep locators and functions together to make the code modular

## Future
I wish to refactor to use:
* Cucumber BDD with TypeScript
* Remove some duplicate code
* Remove unwanted delay

