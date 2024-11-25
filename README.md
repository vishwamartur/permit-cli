![permit CLI](https://github.com/user-attachments/assets/89dbb075-6d88-4fd7-8d19-9490177248fc)

# Permit CLI

A command line utility from Permit.io to work with everything IAM and Authorization.
A one-stop-shop to manage all your Authorization tools (OPA, OPAL, CEDAR, AVP, openFGA, ...) as well as the Permit Service.

- Manage the Permit PDP and perform permissions checks directly from the CLI
- Manage the Permit API
- Interact with OPA (Open Policy Agent)
- Coming Soon: Interact with OPAL
- Coming Soon: Interact with Cedar-Agent
- Coming Soon: Interact with OpenFGA

### This tool is in early stages of development

Give this Repo a ⭐ to support and stay updated

Based on [Pastel](https://github.com/vadimdemedes/create-pastel-app)

## Run for development

- Checkout this repo
- run `npm install`
- run `npx tsx ./source/cli.tsx`

## CLI

```
$ permit-cli --help

  Usage
    $ permit-cli

  Examples
    $ permit-cli pdp check -u filip@permit.io -a create -r task
    Checking user="filip@permit.io" action=create resource=task at tenant=default
    ALLOWED

    $ permit-cli api-key permit_key_..........
    Key saved to './permit.key'
```

## Running Tests

To run the tests locally, use the following command:

```
npm test
```

This will run all the tests and generate a coverage report in the `coverage` directory.

## Writing Tests

When writing new tests, follow these guidelines:

1. Create a new test file in the appropriate directory (e.g., `source/commands` or `source/components`).
2. Use the existing test files as examples for writing your tests.
3. Ensure that your tests cover edge cases and different scenarios.
4. Run the tests locally to ensure they pass before committing your changes.
