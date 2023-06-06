using Backend.DbConfigurations;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Backend.Repositories
{
    public class PurchaseRepository
    {
        private ApplicationContext context;

        public PurchaseRepository(ApplicationContext context)
        {
            this.context = context;
        }

        public async Task AddPurchases(IEnumerable<Purchase> purchases)
        {
            foreach(var newPurchase in purchases)
            {
                var oldPurchase = await context.Purchases.FirstOrDefaultAsync(p => p.UserId == newPurchase.UserId && p.TicketId == newPurchase.TicketId);
                if(oldPurchase != null) 
                {
                    oldPurchase.Count += newPurchase.Count;
                }
                else 
                {
                    await context.Purchases.AddAsync(newPurchase);
                }
            }
            await context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Purchase>> GetUserPurchases(int id, string searchPattern)
        {
            IQueryable<Purchase> query = context.Purchases.Include(p => p.Ticket).ThenInclude(p => p.Event).Where(p => p.UserId == id);
            if (!string.IsNullOrWhiteSpace(searchPattern))
            {
                query = query.Where(p => p.Ticket.Event.Name.Contains(searchPattern));
            }
            return await query.Select(p => new Purchase
            {
                Id = p.Id,
                Count = p.Count,
                Ticket = p.Ticket
            }).ToListAsync();
        }
    }
}
