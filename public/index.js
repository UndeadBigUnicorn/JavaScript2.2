window.onload = function() {

    const itemsContainer = document.getElementById('items-container');
    const notBoughtItemsContainer = document.getElementById('not-bought-items-container');
    const notBoughtItems = [];

    $( "#add-button" ).on( "click", function() {
        let productName = document.getElementById('input').value;

        itemsContainer.innerHTML+= ` <div class="item">
        <div class="first-column titles">
            <span class="title">${productName}</span>
        </div>
        <div class="second-column add-buttons">
            <button class="circular-button red-button"><b>-</b></button>
            <span class="amount">1</span>
            <button class="circular-button green-button"><b>+</b></button>
        </div>
        <div class="third-column option-buttons">
            <button class="button-buy">Куплено</button>
            <button class="delete-button">X</button>
        </div>
    </div>`;

        notBoughtItems.push({name: productName, amount: 1});
        RenderNotBoughtItems();

        document.getElementById('input').value='';
      });


      function RenderNotBoughtItems(){
          
        let displayNotBoughtItems = notBoughtItems.map((item)=>{
              return (`<span class="product-item">
              ${item.name}
              <span class="circular-amount">${item.amount}</span>
      </span>`);
          });

        notBoughtItemsContainer.innerHTML=displayNotBoughtItems.join(' ');  
      }
}