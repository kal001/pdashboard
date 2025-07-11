I want to create a project to serve html pages, that are supposed to be shown in a big TV screen in a factory.
The pages are dashboards, aimed at giving the workers information abaout the performance of the operation.
The pages shall be html5, and all in Portugueses (from Portugal).

The project should be completly dockerized (webserver, database,...) to be easily deployed.
The server runs locally, so no need for authentication, or https.

The technology stack can be Flask, plus a frontend in Javascript.
All css code shall be kept in a separate css file, for easy updrade of the look and feel.
The name of the company is "Jayme da Costa. The logo is in assets/logo.png
There is also a secondary logo in the same folder getsitelogo.jpeg to also use.
In the docs folder there is a dashboard_rules with guidelines.

The dashboard should show a corrossel of pages, that turn in a cycle every 10s.
Each page shall be configured as active/inactive in a admin backoffice.

