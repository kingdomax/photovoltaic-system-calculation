using Newtonsoft.Json.Linq;
using PhotovoltaicSystemCalculation.Repositories.Models;
using PhotovoltaicSystemCalculation.ExternalAPI.Interfaces;
using System.Text.Json;

namespace PhotovoltaicSystemCalculation.ExternalAPI
{
    public class WeatherForecastAPI : IWeatherForecastAPI
    {
        public async Task<IList<WeatherDTO>> Get30DaysWeatherForecast(float latitude, float longitude, long startDate)
        {
            var returnData = new List<WeatherDTO>();

            // Get data past 30 days
            for (var i = 0; i < 30; i++)
            {
                // Convert the UNIX timestamp to a DateTimeOffset.
                DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds(startDate);

                // Subtract 30 days from the date.
                DateTimeOffset theDaysEarlier = dateTimeOffset.AddDays(-i);

                // Convert the new DateTimeOffset back to a UNIX timestamp.
                long date = theDaysEarlier.ToUnixTimeSeconds();

                var avgWeatherDTO = await GetAverageWeatherForecastPerDay(latitude, longitude, date);

                // Add the WeatherDTO object to the result list
                returnData.Add(avgWeatherDTO);
            }

            return returnData;
        }

        private async Task<WeatherDTO> GetAverageWeatherForecastPerDay(float latitude, float longitude, long date)
        {
            // Call OpenWeather API to get Cloud and Tempurature data from Historical API
            var resultData = new List<WeatherDTO>();

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    HttpResponseMessage response = await client.GetAsync("https://history.openweathermap.org/data/2.5/history/city?lat=" + latitude + "&lon=" + longitude + "&type=hour&start=" + date + "&cnt=24&appid=cf5ead8af14c2db62245cc31d7fcf794");

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
                            DateTime dateTime = DateTimeOffset.FromUnixTimeSeconds(unixTimestamp).DateTime.Date;

                            // Extract "temp" value
                            JObject temperatureObject = (JObject)weatherData["main"];
                            float temperatureValueK = temperatureObject.Value<float>("temp");

                            // Convert temperature Kelvin to Celsius
                            float temperatureValueC = temperatureValueK - 273.15f;

                            // Extract "clouds" value
                            JObject cloudsObject = (JObject)weatherData["clouds"];
                            float cloudsValue = cloudsObject.Value<int>("all") / 100f;

                            // Create a WeatherDTO object
                            WeatherDTO weatherDTO = new WeatherDTO()
                            {
                                Date = dateTime,
                                Temperature = temperatureValueC,
                                CloudCover = cloudsValue
                            };

                            // Add the WeatherDTO object to the result list
                            resultData.Add(weatherDTO);
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

            // Calculating the average temperature
            double averageTemperature = resultData.Average(r => r.Temperature);
            // Calculating the average clouds value
            double averageClouds = resultData.Average(r => r.CloudCover);
            DateTime realDate = resultData[0].Date;

            // Create a WeatherDTO object
            WeatherDTO avgWeatherDTO = new WeatherDTO()
            {
                Date = realDate,
                Temperature = averageTemperature,
                CloudCover = averageClouds
            };
            return avgWeatherDTO;
        }

        public async Task<WeatherDTO> GetDialyWeatherForCronjob(float latitude, float longitude)
        {
            // Call OpenWeather API to get Cloud and Tempurature data from Daily API
            var resultData = new List<WeatherDTO>();
            double tempDayCelsius=0;
            double cloudsClover =0;
            DateTime dt = new DateTime();

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    HttpResponseMessage response = await client.GetAsync("https://api.openweathermap.org/data/2.5/forecast/daily?lat=" + latitude + "&lon=" + longitude + "&cnt=1&appid=cf5ead8af14c2db62245cc31d7fcf794");

                    if (response.IsSuccessStatusCode)
                    {
                        string responseBody = await response.Content.ReadAsStringAsync();

                        // Parse the response body into a JSON object
                        JsonDocument doc = JsonDocument.Parse(responseBody);

                        JsonElement root = doc.RootElement;
                        JsonElement list = root.GetProperty("list");
                        JsonElement firstItem = list[0];

                        long dtUnix = firstItem.GetProperty("dt").GetInt64();
                        dt = DateTimeOffset.FromUnixTimeSeconds(dtUnix).DateTime.Date;

                        double tempDayK = firstItem.GetProperty("temp").GetProperty("day").GetDouble();
                        // Convert temperature Kelvin to Celsius
                        tempDayCelsius = tempDayK - 273.15;

                        double clouds = firstItem.GetProperty("clouds").GetInt32();
                        cloudsClover = clouds / 100;
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

            return new WeatherDTO()
            {
                Latitude = latitude,
                Longitude = longitude,
                Date = dt,
                Temperature = tempDayCelsius,
                CloudCover = cloudsClover
            };
        }
    }
}
