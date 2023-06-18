using PhotovoltaicSystemCalculation.Models;

namespace PhotovoltaicSystemCalculation.Services.Interfaces
{
    public interface IPhotovoltaicService
    {
        public Task<float> CaculateElectricProduction(ElectricProductionArgs args);
    }
}
