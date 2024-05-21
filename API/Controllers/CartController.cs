using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class CartController : BaseApiController
    {
        private readonly StoreContext _context;

        public CartController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet(Name = "GetCart")]
        public async Task<ActionResult<CartDto>> GetCart()
        {
            Cart cart = await _RetrieveCart();

            if (cart == null) return NotFound();

            return _MapCartToDto(cart);
        }

        [HttpPost]
        public async Task<ActionResult<CartDto>> AddToCart(int productId, int qty)
        {
            Cart cart = await _RetrieveCart();
            if (cart == null) cart = _CreateCart();

            Product product = await _RetrieveProduct(productId);
            if (product == null) return NotFound();

            cart.AddItem(product, qty);

            // save changes to database
            int result = await _context.SaveChangesAsync();
            if (result > 0) return CreatedAtRoute("GetCart", _MapCartToDto(cart));
            return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteFromCart(int productId, int qty)
        {
            Cart cart = await _RetrieveCart();
            if (cart == null) return NotFound();

            cart.RemoveItem(productId, qty);

            int result = await _context.SaveChangesAsync();
            if (result > 0) return Ok();
            return BadRequest(new ProblemDetails { Title = "Problem deleting item from basket" });
        }

        // ------------------------------------------------------------------------------

        private async Task<Product> _RetrieveProduct(int productId)
        {
            return await _context.Products.FirstOrDefaultAsync(x => x.Id == productId);
        }

        private async Task<Cart> _RetrieveCart()
        {
            return await _context.Carts
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
        }

        private Cart _CreateCart()
        {
            // randomly generate a new buyerId, as we haven't implemented the users table and the login system yet
            string buyerId = Guid.NewGuid().ToString();

            // insert buyerId into the client's cookies
            CookieOptions cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
            Response.Cookies.Append("buyerId", buyerId);

            // create a new cart with BuyerId equals to the newly generated buyerId
            Cart newCart = new Cart { BuyerId = buyerId };
            _context.Carts.Add(newCart);
            return newCart;
        }

        private static CartDto _MapCartToDto(Cart cart)
        {
            return new CartDto
            {
                Id = cart.Id,
                BuyerId = cart.BuyerId,
                Items = cart.Items.Select(item => new CartItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Qty
                }).ToList()
            };
        }
    }
}