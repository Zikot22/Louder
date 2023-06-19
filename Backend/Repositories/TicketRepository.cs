using Backend.DbConfigurations;
using Backend.Models;
using Backend.Models.Updates;
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

        public async Task<IEnumerable<Ticket>> GetAllTicketsAsync(string searchPattern)
        {
            IQueryable<Ticket> query = context.Tickets;
            if (!string.IsNullOrWhiteSpace(searchPattern))
            {
                query = query.Where(t =>
                    EF.Functions.Like(t.Id.ToString(), $"%{searchPattern}%") ||
                    EF.Functions.Like(t.TypeName!, $"%{searchPattern}%") ||
                    EF.Functions.Like(t.TypeDescription!, $"%{searchPattern}%") ||
                    EF.Functions.Like(t.EventId!, $"%{searchPattern}%") ||
                    EF.Functions.Like(t.Price.ToString(), $"%{searchPattern}%"));
            }
            return await query.ToListAsync();
        }

        public async Task AddTicketAsync(Ticket newTicket)
        {
            await context.Tickets.AddAsync(newTicket);
            await context.SaveChangesAsync();
        }

        public async Task<Ticket> GetTicketAsync(int id)
        {
            return await context.Tickets.FirstAsync(t => t.Id == id);
        }

        public async Task DeleteTicketAsync(int id)
        {
            await context.Tickets.Where(t => t.Id == id).ExecuteDeleteAsync();
            await context.SaveChangesAsync();
        }

        public async Task UpdateTicketAsync(int id, TicketUpdate ticketUpdate)
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
            if (!string.IsNullOrWhiteSpace(ticketUpdate.TemplateId))
            {
                updatingTicket.TemplateId = ticketUpdate.TemplateId;
            }
            context.SaveChanges();
        }
    }
}
