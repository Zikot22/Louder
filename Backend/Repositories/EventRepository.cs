using Backend.DbConfigurations;
using Backend.Models;
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

        public async Task<IEnumerable<Event>> GetAllEvents(string searchPattern, string price, string date, string amount)
        {
            IQueryable<Event> query = context.Events;
            if (!string.IsNullOrWhiteSpace(searchPattern))
            {
                query = query.Where(e => e.Name.Contains(searchPattern));
            }
            switch (price) 
            {
                //TODO
            }
            switch (date) 
            {
                case "asc":
                    query = query.OrderBy(e => e.DateTime);
                    break;
                case "desc":
                    query = query.OrderByDescending(e => e.DateTime);
                    break;
            }
            switch (amount)
            {
                case "asc":
                    query = query.OrderBy(e => e.Amount);
                    break;
                case "desc":
                    query = query.OrderByDescending(e => e.Amount);
                    break;
            }
            return await query.ToListAsync();
        }

        public async Task AddEvent(Event newEvent)
        {
            await context.Events.AddAsync(newEvent);
            await context.SaveChangesAsync();
        }

        public async Task<Event> GetEvent(int id)
        {
            return await context.Events.FirstAsync(e => e.Id == id);
        }

        public async Task DeleteEvent(int id)
        {
            await context.Events.Where(e => e.Id == id).ExecuteDeleteAsync();
            await context.SaveChangesAsync();
        }

        public async Task UpdateEvent(int id, Event eventUpdate)
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

        public async Task<IEnumerable<Ticket>> GetTickets(int id) 
        {
            return await context.Tickets.Where(t => t.EventId == id).ToListAsync();
        }

        public async Task DecreaseAmount(int ticketId, int amount) 
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
