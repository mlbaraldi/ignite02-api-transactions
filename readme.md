Project made as exercise for RocketSeat Node Course
Node API using fastify for posting transactions and returning the value accordingly by cookies.

**Routes**
* GET /transactions/:id - returns specific transaction by UUID

* POST /transactions - post new transaction
Ex: {
  "title": "test",
  "amount": 1,
  "type": "debit"
}

* GET /transactions/summary - returns sum of all transactions made by user
* GET /transactions - returns all transactions made by user

- Project uses
  - Sqlite3
  - Knex as Querybuilder
  - tsx as runtime
  - Fastify
  - Zod for validations
  - Vitest
  - superTest