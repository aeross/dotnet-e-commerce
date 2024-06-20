namespace API.DTOs
{
    public class UserDto
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public string BuyerId { get; set; }
        public CartDto Cart { get; set; }
    }
}