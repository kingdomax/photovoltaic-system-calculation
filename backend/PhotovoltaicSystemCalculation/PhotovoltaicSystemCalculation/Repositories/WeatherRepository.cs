using PhotovoltaicSystemCalculation.Repositories.Models;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;
using Newtonsoft.Json.Linq;

namespace PhotovoltaicSystemCalculation.Repositories
{
    public class WeatherRepository : IWeatherRepository
    {
        public async Task<IList<WeatherDTO>> GetWeatherForecast(float latitude, float longitude, string startDate, string endDate)
        {
            // TODO: This method will be receive list of weather data from API 
            var returnData = new List<WeatherDTO>();

            // Call OpenWeather API to get Clound and Tempurature data
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    HttpResponseMessage response = await client.GetAsync("https://history.openweathermap.org/data/2.5/history/city?lat=" + latitude + "&lon=" + longitude + "&type=hour&start=" + startDate + "&cnt=" + endDate + "&appid=cf5ead8af14c2db62245cc31d7fcf794");

                    if (response.IsSuccessStatusCode)
                    {
                        string responseBody = await response.Content.ReadAsStringAsync();

                        // Parse the response body into a JSON object
                        JObject json = JObject.Parse(responseBody);
                        JArray weatherDataArray = (JArray)json["list"];
                        foreach (JObject weatherData in weatherDataArray)
                        {
                            // Extract "dt" value (timestamp) and convert to DateTime
                            long unixTimestamp = weatherData.Value<long>("dt");
                            DateTime dateTime = DateTimeOffset.FromUnixTimeSeconds(unixTimestamp).DateTime;

                            // Extract "temp" value
                            JObject temperatureObject = (JObject)weatherData["main"];
                            float temperatureValueK = temperatureObject.Value<float>("temp");

                            // Convert temperature Kelvin to Celsius
                            float temperatureValueC = temperatureValueK - 273.15f;

                            // Extract "clouds" value
                            JObject cloudsObject = (JObject)weatherData["clouds"];
                            int cloudsValue = cloudsObject.Value<int>("all");

                            // Create a WeatherDTO object
                            WeatherDTO weatherDTO = new WeatherDTO()
                            {
                                DateTime = dateTime,
                                Temperature = temperatureValueC,
                                CloudCover = cloudsValue
                            };

                            // Add the WeatherDTO object to the result list
                            returnData.Add(weatherDTO);
                        }
                    }
                    else
                    {
                        Console.WriteLine("The API request was not successful. Status code: " + response.StatusCode);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("An error occurred: " + ex.Message);
                }
            }

            // test
            var groupedData = returnData
            .GroupBy(r => r.DateTime.Date)
            .Select(grp => new
            {
                Date = grp.Key,
                AverageTemperature = grp.Average(item => item.Temperature)
            })
            .ToList();



            return returnData;
        }
    }
}
