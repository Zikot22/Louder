using Backend.Models;
using Backend.Models.Updates;
using Backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EventController : CurrentUserController
    {
        private readonly EventRepository rep;

        public EventController(EventRepository rep, IConfiguration config): base(config)
        {
            this.rep = rep;
        }

        [HttpPost("{id}/cover")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> UpdateEventCover([FromRoute] int id, IFormFile cover)
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
            var editingEvent = await rep.GetEventAsync(id);
            if (editingEvent == null)
            {
                return NotFound(new { error = "Мероприятие не найдено" });
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

            return BadRequest(new { error = "Невалидное изображение" });
        }

        [HttpGet("filter")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<Event>>> GetEventsWithFilter()
        {
            var searchPattern = Request.Query.FirstOrDefault(p => p.Key == "searchPattern").Value.ToString().Trim();
            var price = Request.Query.FirstOrDefault(p => p.Key == "price").Value;
            var date = Request.Query.FirstOrDefault(p => p.Key == "date").Value;
            var amount = Request.Query.FirstOrDefault(p => p.Key == "amount").Value;
            var city = Request.Query.FirstOrDefault(p => p.Key == "city").Value;
            var result = await rep.GetEventsWithFilterAsync(searchPattern, price!, date!, amount!, city!);
            return Ok(result);
        }

        [HttpGet]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
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
            var result = await rep.GetAllEventsAsync(searchPattern);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<Event>> GetEvent([FromRoute] int id)
        {
            var result = await rep.GetEventAsync(id);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> DeleteEvent([FromRoute] int id)
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
            var deletingEvent = await rep.GetEventAsync(id);
            if (deletingEvent == null) return NotFound(new { error = "Мероприятие не найдено" });
            await rep.DeleteEventAsync(id);
            return NoContent();
        }

        [HttpPut]
        [ProducesResponseType(204)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public async Task<ActionResult> CreateEvent(Event newEvent)
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
            await rep.AddEventAsync(newEvent);
            return NoContent();
        }

        [HttpPost("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> UpdateEvent([FromRoute] int id, EventUpdate eventUpdate)
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
            var updatingEvent = await rep.GetEventAsync(id);
            if (updatingEvent == null) return NotFound(new { error = "Мероприятие не найдено" });
            await rep.UpdateEventAsync(id, eventUpdate);
            return NoContent();
        }

        [HttpGet("{id}/tickets")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetTickets([FromRoute] int id) 
        {
            var currentEvent = await rep.GetEventAsync(id);
            if (currentEvent == null) return NotFound(new { error = "Мероприятие не найдено" });
            return Ok(await rep.GetTicketsAsync(id));
        }
    }
}
