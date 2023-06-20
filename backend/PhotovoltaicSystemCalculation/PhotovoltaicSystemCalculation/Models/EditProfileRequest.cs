namespace PhotovoltaicSystemCalculation.Models
{
    public class EditProfileRequest
    {
        public UserInfo UserInfo { get; set; }
        public string NewPassword { get; set; }
    }
}
