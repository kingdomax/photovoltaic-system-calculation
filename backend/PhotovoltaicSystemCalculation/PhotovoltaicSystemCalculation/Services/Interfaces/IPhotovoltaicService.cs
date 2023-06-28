using PhotovoltaicSystemCalculation.Models;

namespace PhotovoltaicSystemCalculation.Services.Interfaces
{
    public interface IPhotovoltaicService
    {
        public Task<IList<ElectricProduction>> CaculateElectricProduction(ElectricProductionArgs args);
    }
}
