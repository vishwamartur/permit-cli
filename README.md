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

    $ permit-cli playground build
    Initiates the interactive policy builder with AI suggestions.

    $ permit-cli playground test
    Runs the sandbox testing environment for real-time policy testing and evaluation logs.
```

## AI-Powered Policy Builder and Testing Environment

### Interactive Policy Builder

The `permit playground build` command allows users to create policies through a step-by-step interface, with visual representation and prompts for input. The AI suggests policy structures and rules based on user context to streamline policy creation.

### Testing Environment

The `permit playground test` command enables users to test their policies in real-time by running scenarios to see access results and evaluation logs. This feature enhances usability, reduces the time needed for policy creation, and allows for thorough validation, ensuring more secure and effective authorization strategies.
