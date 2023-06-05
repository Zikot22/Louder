using Backend.Models;
using Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TicketController : ControllerBase
    {
        private readonly TicketRepository rep;

        public TicketController(TicketRepository rep)
        {
            this.rep = rep;
        }

        [HttpGet("all")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetTickets()
        {
            var result = await rep.GetAllTickets();
            return Ok(result);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<Ticket>> GetTicket([FromRoute] int id)
        {
            var result = await rep.GetTicket(id);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        public async Task<ActionResult> DeleteTicket([FromRoute] int id)
        {
            await rep.DeleteTicket(id);
            return NoContent();
        }

        [HttpPut]
        [ProducesResponseType(204)]
        public async Task<ActionResult> CreateTicket(Ticket newTicket)
        {
            await rep.AddTicket(newTicket);
            return NoContent();
        }

        [HttpPost("{id}")]
        [ProducesResponseType(204)]
        public async Task<ActionResult> UpdateTicket([FromRoute] int id, Ticket ticketUpdate)
        {
            await rep.UpdateTicket(id, ticketUpdate);
            return NoContent();
        }
    }
}
