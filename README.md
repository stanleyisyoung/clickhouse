## Clickhouse take-home by Stanley 
This app follows a standard MVC structure making it easier for many devs to onboard. 

All data is stored in-memory for this exercise and external APIs are mocked in the tests. Product, Customer, and Shipment APIs are mocked under src/utils. We should set up a database and persist data there for a real-world solution.

## Instructions: Setup & Testing
Install dependencies `npm install`
Run the app: `npm run dev`
Run tests: `npm test`

Server runs on port 3000 by default unless the `PORT` env variable is set. 

## Notes & Areas of Improvement
### Balance performance
A customer's balance is calculated from the customer's history of transactions. This can become a bottleneck as the number of transactions increases for a given customer. We should implement caching or snapshotting in the future to improve performance. This will allow us to avoid recalcualting the entire history of a user's transactions. Not storing a customer's balance explicity was done for several reasons.
1. Auditability - We have an audit trail of the user's transactions. We can replay the sequence of events to help with debugging and viewing the state of the account at any point in time.
2. Event driven - this design fits into an event-driven system and we can easily trigger other processes.
3. Flexibility - When we add new features, we can create new types without changing the data model.

### Error handling
We can create more specific errors for each failure case. To save time for this exercise, we return a fairly generic errors.

### Testing
Tests cover the main use cases at the API level but could benefit from more unit tests at deeper layers, especially the service layer.
