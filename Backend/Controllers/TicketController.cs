using Backend.Models;
using Backend.Models.Updates;
using Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TicketController : CurrentUserController
    {
        private readonly TicketRepository rep;

        public TicketController(TicketRepository rep, IConfiguration config): base(config)
        {
            this.rep = rep;
        }

        [HttpGet]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetTickets()
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
            var searchPattern = Request.Query.FirstOrDefault(p => p.Key == "searchPattern").Value.ToString().Trim();
            var result = await rep.GetAllTicketsAsync(searchPattern);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> DeleteTicket([FromRoute] int id)
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
            var ticket = await rep.GetTicketAsync(id);
            if (ticket == null) 
            {
                return NotFound(new { error = "Билет не найден" });
            }
            await rep.DeleteTicketAsync(id);
            return NoContent();
        }

        [HttpPut]
        [ProducesResponseType(204)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public async Task<ActionResult> CreateTicket(Ticket newTicket)
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
            await rep.AddTicketAsync(newTicket);
            return NoContent();
        }

        [HttpPost("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> UpdateTicket([FromRoute] int id, TicketUpdate ticketUpdate)
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
            var ticket = await rep.GetTicketAsync(id);
            if (ticket == null)
            {
                return NotFound(new { error = "Билет не найден" });
            }
            await rep.UpdateTicketAsync(id, ticketUpdate);
            return NoContent();
        }
    }
}
