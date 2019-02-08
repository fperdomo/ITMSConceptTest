namespace Social.Logins.Web.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;

    [Route("readme")]
    public class ReadmeController : Controller
    {
        [Route("")]
       
        public IActionResult Index()
        {
            return View();
        }
    }
}
