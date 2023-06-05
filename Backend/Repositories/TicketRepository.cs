using Backend.DbConfigurations;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class TicketRepository
    {
        private ApplicationContext context;

        public TicketRepository(ApplicationContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<Ticket>> GetAllTickets()
        {
            return await context.Tickets.ToListAsync();
        }

        public async Task AddTicket(Ticket newTicket)
        {
            await context.Tickets.AddAsync(newTicket);
            await context.SaveChangesAsync();
        }

        public async Task<Ticket> GetTicket(int id)
        {
            return await context.Tickets.FirstAsync(t => t.Id == id);
        }

        public async Task DeleteTicket(int id)
        {
            await context.Tickets.Where(t => t.Id == id).ExecuteDeleteAsync();
            await context.SaveChangesAsync();
        }

        public async Task UpdateTicket(int id, Ticket ticketUpdate)
        {
            var updatingTicket = await context.Tickets.FirstAsync(t => t.Id == id);

            if (!string.IsNullOrWhiteSpace(ticketUpdate.TypeName))
            {
                updatingTicket.TypeName = ticketUpdate.TypeName;
            }
            if (!string.IsNullOrWhiteSpace(ticketUpdate.TypeDescription))
            {
                updatingTicket.TypeDescription = ticketUpdate.TypeDescription;
            }
            if (ticketUpdate.Price > 0)
            {
                updatingTicket.Price = ticketUpdate.Price;
            }
            if (ticketUpdate.EventId > 0) 
            {
                updatingTicket.EventId = ticketUpdate.EventId;
            }
            context.SaveChanges();
        }
    }
}
