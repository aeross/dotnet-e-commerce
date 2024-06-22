using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Cart
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public List<CartItem> Items { get; set; } = [];

        public void AddItem(Product product, int qty)
        {
            // check if product is not already in cart
            if (Items.All(item => item.ProductId != product.Id))
            {
                // add product to cart
                Items.Add(new CartItem { Product = product, Qty = qty });
            }
            else
            {
                var item = Items.FirstOrDefault(item => item.ProductId == product.Id);
                if (item != null) item.Qty += qty;
            }
        }

        public void RemoveItem(int productId, int qty)
        {
            var item = Items.FirstOrDefault(item => item.ProductId == productId);
            if (item == null) return;

            item.Qty -= qty;
            if (item.Qty <= 0) Items.Remove(item);
        }


        public override string ToString()
        {
            return "{ Id: " + this.Id + ", BuyerId: " + this.BuyerId + ", + Items: " +
            this.Items.Count + "}";
        }
    }
}