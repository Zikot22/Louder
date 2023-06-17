using Backend.Models;
using Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PurchaseController : CurrentUserController
    {
        private readonly PurchaseRepository rep;
        private readonly EventRepository eventRep;
        private readonly UserRepository userRep;

        public PurchaseController(PurchaseRepository rep, EventRepository eventRep, UserRepository userRep, IConfiguration config): base(config)
        {
            this.rep = rep;
            this.eventRep = eventRep;
            this.userRep = userRep;
        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public async Task<ActionResult> AddPurchases(IEnumerable<Purchase> purchases)
        {
            var currentUser = GetCurrentUser();
            if (currentUser == null)
            {
                return Unauthorized();
            }
            if (!currentUser.AdminPermissions)
            {
                return Forbid();
            }
            try 
            {
                foreach(var purchase in purchases)
                {
                    await eventRep.DecreaseAmountAsync(purchase.TicketId, purchase.Count);
                }
            }
            catch (Exception ex) 
            {
                return BadRequest(new { error = ex.Message });
            }
            await rep.AddPurchasesAsync(purchases);
            return NoContent();
        }

        [HttpGet("user/{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<IEnumerable<Purchase>>> GetUserPurchases([FromRoute] int id)
        {
            var currentUser = GetCurrentUser();
            if (currentUser == null)
            {
                return Unauthorized();
            }
            if (currentUser.Id != id && !currentUser.AdminPermissions)
            {
                return Forbid();
            }
            var user = await userRep.GetUserAsync(id);
            if (user == null) 
            {
                return NotFound(new { error = "Пользователь не найден" });
            }
            var searchPattern = Request.Query.FirstOrDefault(p => p.Key == "searchPattern").Value.ToString().Trim();
            var result = await rep.GetUserPurchasesAsync(id, searchPattern);
            return Ok(result);
        }
    }
}
