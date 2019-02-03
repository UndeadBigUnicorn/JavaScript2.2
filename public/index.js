window.onload = function() {

    const itemsContainer = document.getElementById('items-container');
    const notBoughtItemsContainer = document.getElementById('not-bought-items-container');
    const boughtItemsContainer = document.getElementById('bought-items-container');
    const notBoughtItems = [];
    const boughtItems = [];

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
            <button class="button-buy" data-poduct-name="${productName}" data-product-id="" data-product-amount="1">Куплено</button>
            <button class="delete-button" data-poduct-name="${productName}" data-product-id="">X</button>
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

      $(document).on('click' , '.button-buy', function(){
        // Еще нужно добалять в список купленых товаров и с кнопоками разобраться
        let _id = $(this).data('product-id');
        let _amount= $(this).data('product-amount');
        let _name = $(this).data('product-rate');
        let title = $(this).closest('.titles');
        let addButtons = $(this).closest('.add-buttons');
        let optionButtons = $(this).closest('.option-buttons');
        title.innerHTML= `<span class="title crossed">${_name}</span>`;
        addButtons.innerHTML= ` <span class="amount">${_amount}</span>`;
        optionButtons.innerHTML = `<button class="button-buy button-not-bought">Не куплено</button>`;
        
    });
}