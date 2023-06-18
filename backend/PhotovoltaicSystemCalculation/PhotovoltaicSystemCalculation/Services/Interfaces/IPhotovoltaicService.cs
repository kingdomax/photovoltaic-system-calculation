using PhotovoltaicSystemCalculation.Models;

namespace PhotovoltaicSystemCalculation.Services.Interfaces
{
    public interface IPhotovoltaicService
    {
        public Task<double> CaculateElectricProduction(ElectricProductionArgs args);
    }
}
