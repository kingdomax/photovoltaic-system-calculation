# Photovoltaic System Calculator
In today's digital era, planning efficiently using digital tools provides an invaluable advantage. This is particularly true for business and private electricity planning such as the utilization of photovoltaic systems (PV/PS). This project aims to address the challenges associated with calculating and determining the effectiveness and feasibility of photovoltaic systems. We have developed a prototype web-based calculation system for a photovoltaic system, specifically tailored to a particular manufacturer and product. The application considers the current weather data and local conditions at the specific location on the planet, assisting in accurately calculating and specifying the photovoltaic system's potential. The website comprises four essential components: Frontend, External Webservice API, Backend, and Database.

## Getting Started

To get the application up and running on your local machine, there are some prerequisites which need to be installed:

1. Download and install [Node.js](https://nodejs.org/de/download)
2. Download and install [.NET core SDK 6.0](https://dotnet.microsoft.com/en-us/download/dotnet)

## Setup Database

To setup the database for the application:

1. Copy the file `./backend/PhotovoltaicSystemCalculation/PhotovoltaicSystemCalculation/psc-backup.db` and rename it to "psc.db"

*Optional*: To easily check the database, you can use [DB Browser for SQLite](https://sqlitebrowser.org/dl/)

## Start the Application

To start the backend:
1. Navigate to the backend directory with `cd backend/PhotovoltaicSystemCalculation/PhotovoltaicSystemCalculation`
2. Run the backend with `dotnet run`

*Optional*: For debugging, you can use [Visual Studio 2022](https://visualstudio.microsoft.com/vs/)

To start the frontend:
1. Navigate to the frontend directory with `cd frontend`
2. Install the dependencies with `npm install`
3. Start the application with `npm start`

## Accessing the Web Application

You can access the application through the following URLs:

- Application: http://localhost:8080/
- Swagger: http://localhost:7070/swagger/index.html
- Hangfire Dashboard: http://localhost:7070/hangfire/recurring

For testing, you can use the following account details:

- Username: admin
- Password: 1234

## Run Tests

To run xUnit:
1. Navigate to test directory with `cd backend/PhotovoltaicSystemCalculation/UnitTest`
2. Start test suits with `dotnet test`

## Application Dependencies

The application relies on the following libraries and APIs:

- [Vite.js](https://vitejs.dev/)
- [Bootstrap](https://getbootstrap.com/)
- [D3.js](https://d3js.org/)
- [Leaflet.js](https://leafletjs.com/)
- [PVGIS API](https://ec.europa.eu/jrc/en/pvgis)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [EPPlus lib](https://github.com/EPPlusSoftware/EPPlus)
- [HangFire lib](https://www.hangfire.io/)
- [Swashbuckle lib](https://github.com/domaindrivendev/Swashbuckle)
- [Microsoft SQLite lib](https://docs.microsoft.com/en-us/dotnet/standard/data/sqlite/)

