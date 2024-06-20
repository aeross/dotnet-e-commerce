using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
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
            Cart cart = await _RetrieveCart(_GetBuyerId());

            if (cart == null) return NotFound();

            return cart.MapCartToDto();
        }

        [HttpPost]
        public async Task<ActionResult<CartDto>> AddToCart(int productId, int qty)
        {
            Cart cart = await _RetrieveCart(_GetBuyerId());
            if (cart == null) cart = _CreateCart();

            Product product = await _RetrieveProduct(productId);
            if (product == null) return BadRequest(new ProblemDetails { Title = "Product not found" });

            cart.AddItem(product, qty);

            // save changes to database
            int result = await _context.SaveChangesAsync();
            if (result > 0) return CreatedAtRoute("GetCart", cart.MapCartToDto());
            return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteFromCart(int productId, int qty)
        {
            Cart cart = await _RetrieveCart(_GetBuyerId());
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

        private async Task<Cart> _RetrieveCart(string buyerId)  // the username of the user, or the cookie value if user isn't logged in
        {
            if (string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }

            return await _context.Carts
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }

        private string _GetBuyerId()
        {
            return User.Identity?.Name ?? Request.Cookies["buyerId"];
        }

        private Cart _CreateCart()
        {
            // get the buyerId, or randomly generate one if user isn't logged in
            var buyerId = User.Identity?.Name;
            if (string.IsNullOrEmpty(buyerId))
                buyerId = Guid.NewGuid().ToString();

            // insert buyerId into the client's cookies
            CookieOptions cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
            Response.Cookies.Append("buyerId", buyerId);

            // create a new cart with BuyerId equals to the newly generated buyerId
            Cart newCart = new Cart { BuyerId = buyerId };
            _context.Carts.Add(newCart);
            return newCart;
        }
    }
}