using PhotovoltaicSystemCalculation.ExternalAPI.Models;
using PhotovoltaicSystemCalculation.ExternalAPI.Interfaces;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace PhotovoltaicSystemCalculation.ExternalAPI
{
    public class SolarAPI : ISolarAPI
    {
        public async Task<SolarDTO> FetchSolarInformation(float latitude, float longitude, int inclination, int orientation)
        {
            // TODO: This method willcall solar API to get solar information
            List<int> monthlIndexs = new List<int>();
            List<float> monthlyValues = new List<float>();
            // Call PVGIS API to calculate Solar Irradiance
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    HttpResponseMessage response = await client.GetAsync("https://re.jrc.ec.europa.eu/api/v5_2/MRcalc?lat=" + latitude + "&" + "lon=" + longitude + "&selectrad=1&outputformat=json&startyear=2020&endyear=2020&angle=" + inclination + "&aspect=" + orientation);

                    if (response.IsSuccessStatusCode)
                    {
                        string responseBody = await response.Content.ReadAsStringAsync();

                        // Parse the response body into a JSON object
                        JObject json = JObject.Parse(responseBody);

                        // Extract all "month" and "H(i)_m" values
                        JArray monthlyArray = (JArray)json["outputs"]["monthly"];

                        foreach (JObject monthlyData in monthlyArray)
                        {
                            int monthlIndex = monthlyData.Value<int>("month");
                            monthlIndexs.Add(monthlIndex);

                            float monthlyValue = monthlyData.Value<float>("H(i)_m");
                            monthlyValues.Add(monthlyValue);
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

            // Create a dictionary from the lists
            Dictionary<int, float> irradiance = monthlIndexs.Zip(monthlyValues, (key, value) => new { key, value })
                                                            .ToDictionary(pair => pair.key, pair => pair.value);

            var returnData = new SolarDTO
            {
                Irradiance = irradiance
            };
            return returnData;
        }
    }
}
