using Backend.Models;
using Backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EventController : ControllerBase
    {
        private readonly EventRepository rep;

        public EventController(EventRepository rep)
        {
            this.rep = rep;
        }

        [HttpPost("{id}/cover")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public async Task<ActionResult> UpdateEventCover([FromRoute] int id, IFormFile cover)
        {
            var editingEvent = await rep.GetEvent(id);
            if (editingEvent == null)
            {
                return NotFound("Мероприятие не найдено");
            }
            if (cover != null && cover.Length > 0)
            {
                var fileName = "wwwroot/images/covers/" + editingEvent.Id.ToString() + ".jpg";
                using (var fileStream = new FileStream(fileName, FileMode.Create))
                {
                    await cover.CopyToAsync(fileStream);
                }
                return NoContent();
            }

            return BadRequest("Invalid cover file.");
        }

        [HttpGet("filter")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<Event>>> GetEventsWithFilter()
        {
            var searchPattern = Request.Query.FirstOrDefault(p => p.Key == "searchPattern").Value.ToString().Trim();
            var price = Request.Query.FirstOrDefault(p => p.Key == "price").Value;
            var date = Request.Query.FirstOrDefault(p => p.Key == "date").Value;
            var amount = Request.Query.FirstOrDefault(p => p.Key == "amount").Value;
            var result = await rep.GetAllEvents(searchPattern, price, date, amount);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<Event>> GetEvent([FromRoute] int id)
        {
            var result = await rep.GetEvent(id);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        public async Task<ActionResult> DeleteEvent([FromRoute] int id)
        {
            await rep.DeleteEvent(id);
            return NoContent();
        }

        [HttpPut]
        [ProducesResponseType(204)]
        public async Task<ActionResult> CreateEvent(Event newEvent)
        {
            await rep.AddEvent(newEvent);
            return NoContent();
        }

        [HttpPost("{id}")]
        [ProducesResponseType(204)]
        public async Task<ActionResult> UpdateEvent([FromRoute] int id, Event eventUpdate)
        {
            await rep.UpdateEvent(id, eventUpdate);
            return NoContent();
        }

        [HttpGet("{id}/tickets")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetTickets([FromRoute] int id) 
        {
            return Ok(await rep.GetTickets(id));
        }
        
        [HttpPost("{id}/amount/decrease")]
        [ProducesResponseType(204)]
        public async Task<ActionResult<IEnumerable<Ticket>>> DecreaseAmount([FromRoute] int id) 
        {
            int.TryParse(Request.Query.FirstOrDefault(p => p.Key == "amount").Value!, out var amount);
            if (amount <= 0) amount = 1;
            try 
            {
                await rep.DecreaseAmount(id, amount);
            }
            catch(Exception ex) 
            {
                return BadRequest(ex.Message);
            }
            return NoContent();
        }
    }
}
