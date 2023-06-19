using Backend.DbConfigurations;
using Backend.Models;
using Backend.Models.Updates;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class EventRepository
    {
        private ApplicationContext context;

        public EventRepository(ApplicationContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<Event>> GetEventsWithFilterAsync(string searchPattern, string price, string date, string amount, string city)
        {
            var query = from e in context.Events
                        join t in context.Tickets on e.Id equals t.EventId
                        group t by e into g
                        select new
                        {
                            Event = g.Key,
                            MinPrice = g.Min(t => t.Price)
                        };
            if (!string.IsNullOrEmpty(city)) 
            {
                query = query.Where(e => e.Event.City == city);
            }
            if (!string.IsNullOrWhiteSpace(searchPattern))
            {
                query = query.Where(e => EF.Functions.Like(e.Event.Name!, $"%{searchPattern}%"));
            }
            switch (price) 
            {
                case "asc":
                    query = query.OrderBy(e => e.MinPrice);
                    break;
                case "desc":
                    query = query.OrderByDescending(e => e.MinPrice);
                    break;
            }
            switch (date) 
            {
                case "asc":
                    query = query.OrderBy(e => e.Event.DateTime);
                    break;
                case "desc":
                    query = query.OrderByDescending(e => e.Event.DateTime);
                    break;
            }
            switch (amount)
            {
                case "asc":
                    query = query.OrderBy(e => e.Event.Amount);
                    break;
                case "desc":
                    query = query.OrderByDescending(e => e.Event.Amount);
                    break;
            }
            return await query.Select(e => e.Event).ToListAsync();
        }

        public async Task<IEnumerable<Event>> GetAllEventsAsync(string searchPattern)
        {
            IQueryable<Event> query = context.Events;
            if (!string.IsNullOrWhiteSpace(searchPattern))
            {
                query = query.Where(e =>
                    EF.Functions.Like(e.Id.ToString(), $"%{searchPattern}%") ||
                    EF.Functions.Like(e.Name!, $"%{searchPattern}%") ||
                    EF.Functions.Like(e.Adress!, $"%{searchPattern}%") ||
                    EF.Functions.Like(e.City!, $"%{searchPattern}%") ||
                    EF.Functions.Like(e.DateTime.ToString(), $"%{searchPattern}%") ||
                    EF.Functions.Like(e.Description!, $"%{searchPattern}%") ||
                    EF.Functions.Like(e.Amount.ToString(), $"%{searchPattern}%"));
            }
            return await query.ToListAsync();
        }

        public async Task AddEventAsync(Event newEvent)
        {
            await context.Events.AddAsync(newEvent);
            await context.SaveChangesAsync();
        }

        public async Task<Event> GetEventAsync(int id)
        {
            return await context.Events.FirstAsync(e => e.Id == id);
        }

        public async Task DeleteEventAsync(int id)
        {
            await context.Events.Where(e => e.Id == id).ExecuteDeleteAsync();
            await context.SaveChangesAsync();
        }

        public async Task UpdateEventAsync(int id, EventUpdate eventUpdate)
        {
            var updatingEvent = await context.Events.FirstAsync(e => e.Id == id);

            if (!string.IsNullOrWhiteSpace(eventUpdate.Name))
            {
                updatingEvent.Name = eventUpdate.Name;
            }
            if (!string.IsNullOrWhiteSpace(eventUpdate.Description))
            {
                updatingEvent.Description = eventUpdate.Description;
            }
            if (!string.IsNullOrWhiteSpace(eventUpdate.City))
            {
                updatingEvent.City = eventUpdate.City;
            }
            if (eventUpdate.DateTime > DateTime.Now)
            {
                updatingEvent.DateTime = eventUpdate.DateTime;
            }
            if (!string.IsNullOrWhiteSpace(eventUpdate.Adress))
            {
                updatingEvent.Adress = eventUpdate.Adress;
            }
            if (eventUpdate.Amount >= 0)
            {
                updatingEvent.Amount = eventUpdate.Amount;
            }
            context.SaveChanges();
        }

        public async Task<IEnumerable<Ticket>> GetTicketsAsync(int id) 
        {
            return await context.Tickets.Where(t => t.EventId == id).ToListAsync();
        }

        public async Task DecreaseAmountAsync(int ticketId, int amount) 
        {
            if (amount <= 0) throw new Exception("Некорректное количество билетов");
            var updatingEvent = (await context.Tickets.Include(t => t.Event).FirstAsync(t => t.Id == ticketId)).Event;
            if (updatingEvent == null) throw new Exception("Мероприятие не найдено");
            if(updatingEvent.Amount < amount) 
            {
                throw new Exception("Билеты на мероприятие кончились!");
            }
            updatingEvent.Amount -= amount;
            context.SaveChanges();
        }
    }
}
