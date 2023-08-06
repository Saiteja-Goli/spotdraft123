# spotdraft123
# Asana to Airtable Webhook Integration


## Table of Contents

- [Project Overview](#project-overview)
- [Demo](#demo)
- [Important Routes](#important-routes)
- [Webhook Events](#webhook-events)
- [Installation](#installation)



## Project Overview

The **Asana to Airtable Webhook Integration** project automates the process of transferring task data from Asana to an Airtable database. When Asana task events are triggered, this integration fetches task details and seamlessly adds them to an Airtable table. This enables a streamlined workflow and eliminates the need for manual data entry.

## Demo

Check out the live demo of the project: [Deployed Link](https://spotdraft123.vercel.app/)

## Important Routes

### Webhook Endpoint

- **Route**: `https://spotdraft123.vercel.app/receiveWebhook`
- **Description**: This route receives added data from Asana and seamlessly saves it to the specified Airtable. It performs webhook secret and signature verification to ensure data integrity. Upon successful verification, the integration processes Asana events and fetches associated task data. If the required data fields (name, assignee, due date) are available, they are added to the Airtable database.

## Webhook Events

The integration follows a series of steps when handling webhook events:

1. Webhook secret and signature verification are performed if provided.
2. Successful verification triggers the processing of Asana events.
3. For each event, the associated task data is fetched from the Asana API.
4. If the required data (name, assignee, due date) is available, it is added to the specified Airtable database.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
