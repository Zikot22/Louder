using Backend.Models;
using Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PurchaseController : ControllerBase
    {
        private readonly PurchaseRepository rep;
        private readonly EventRepository eventRep;

        public PurchaseController(PurchaseRepository rep, EventRepository eventRep)
        {
            this.rep = rep;
            this.eventRep = eventRep;
        }

        [HttpPost]
        [ProducesResponseType(204)]
        public async Task<ActionResult> AddPurchases(IEnumerable<Purchase> purchases)
        {
            try 
            {
                foreach(var purchase in purchases)
                {
                    await eventRep.DecreaseAmount(purchase.TicketId, purchase.Count);
                }
            }
            catch (Exception ex) 
            {
                return BadRequest(ex.Message);
            }
            await rep.AddPurchases(purchases);
            return NoContent();
        }

        [HttpGet("user/{id}")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<Purchase>>> GetUserPurchases([FromRoute] int id)
        {
            var searchPattern = Request.Query.FirstOrDefault(p => p.Key == "searchPattern").Value.ToString().Trim();
            var result = await rep.GetUserPurchases(id, searchPattern);
            return Ok(result);
        }
    }
}
