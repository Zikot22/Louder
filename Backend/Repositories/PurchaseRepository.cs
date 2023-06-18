using Backend.DbConfigurations;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace Backend.Repositories
{
    public class PurchaseRepository
    {
        private ApplicationContext context;
        private HttpClient client;

        public PurchaseRepository(ApplicationContext context, IConfiguration config)
        {
            this.context = context;
            client = new HttpClient();
            var plainTextBytes = Encoding.UTF8.GetBytes(config["Api:Key"]!);
            var apiKey = Convert.ToBase64String(plainTextBytes);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", apiKey);
        }

        public async Task AddPurchasesAsync(IEnumerable<Purchase> purchases)
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

        public async Task<IEnumerable<Purchase>> GetUserPurchasesAsync(int id, string searchPattern)
        {
            IQueryable<Purchase> query = context.Purchases.Include(p => p.Ticket).ThenInclude(p => p!.Event).Where(p => p.UserId == id);
            if (!string.IsNullOrWhiteSpace(searchPattern))
            {
                query = query.Where(p => p.Ticket!.Event!.Name!.Contains(searchPattern) || p.Ticket!.Event!.City!.Contains(searchPattern));
            }
            return await query.Select(p => new Purchase
            {
                Id = p.Id,
                Count = p.Count,
                Ticket = p.Ticket
            }).ToListAsync();
        }

        public async Task<Purchase> GetPurchaseAsync(int id)
        {
            return await context.Purchases.FirstAsync(p => p.Id == id);
        }

        public async Task<string> DownloadAsync(int id)
        {
            var purchase = await context.Purchases.Include(p => p.Ticket).ThenInclude(p => p!.Event).Where(p => p.Id == id).FirstOrDefaultAsync();

            var result = new List<String>();

            for(var i = 0; i < purchase!.Count; i++)
            {
                var uniqueId = purchase.TicketId.ToString()! + ";" + purchase.Id.ToString() + ";" + i.ToString();
                var reportParams = new Dictionary<string, string>()
                {
                    { "Id", uniqueId },
                    { "City", purchase.Ticket!.Event!.City! },
                    { "Adress", purchase.Ticket.Event.Adress! },
                    { "DateTime", purchase.Ticket.Event.DateTime.ToString() },
                    { "Type", purchase.Ticket.TypeName! },
                    { "TypeDescription", purchase.Ticket.TypeDescription! },
                };

                var values = new Dictionary<string, object>
                {
                    { "fileName", $"Билет {uniqueId}" },
                    { "folderId", "648eef6ee601e07d556ae3dd" },
                    { "locale", "Ru-ru"},
                    { "format", "Pdf" },
                    { "reportParameters", reportParams}
                };

                var content = JsonContent.Create(values);
                var response = await client.PostAsync($"https://облако.моиотчеты.рф/api/rp/v1/Templates/File/{purchase.Ticket.TemplateId}/Export", content);
                var file = await response.Content.ReadAsStringAsync();

                JsonDocument jsonDocument = JsonDocument.Parse(file);

                if (jsonDocument.RootElement.TryGetProperty("id", out JsonElement idElement))
                {
                    string fileId = idElement.GetString()!;
                    result.Add(fileId);
                }
            }
            var downloadString = "https://xn--80ab2acne.xn--e1aflibyb2b0b.xn--p1ai/download/es/files_2.zip?ids=";
            foreach (var fileId in result)
            {
                if (result[0] != fileId) downloadString += ",";
                downloadString += fileId;
            }
            return downloadString;
        }
    }
}
