window.onload = function() {

    const itemsContainer = document.getElementById('items-container');
    const notBoughtItemsContainer = document.getElementById('not-bought-items-container');
    const boughtItemsContainer = document.getElementById('bought-items-container');
    const notBoughtItems = [];
    const boughtItems = [];

    $("#add-button").on( "click", function() {
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
            <button class="button-buy" data-product-name="${productName}" data-product-id="" data-product-amount="1">Куплено</button>
            <button class="delete-button" data-product-name="${productName}" data-product-id="">X</button>
        </div>
    </div>`;

        notBoughtItems.push({name: productName, amount: 1});
        RenderNotBoughtItems();

        document.getElementById('input').value='';
      });

     

      $(document).on('click' , '.button-buy', function(){
        // Еще нужно добалять в список купленых товаров и с кнопоками разобраться
        let _id = $(this).data('product-id');
        let _amount= $(this).closest('.item').find('.amount')[0].innerHTML;
        let _name = $(this).data('product-name');
        $(this).closest('.item')[0].innerHTML=`<div class="item">
        <div class="first-column titles">
            <span class="title crossed">${_name}</span>
        </div>
        <div class="second-column add-buttons">                   
            <span class="amount">${_amount}</span>
        </div>
        <div class="third-column option-buttons">
            <button class="button-buy button-not-bought" data-product-name="${_name}" data-product-id="${_id}" data-product-amount="${_amount}">Не куплено</button>
        </div>
    </div>`;
        
        boughtItems.push({id:_id, amount:_amount, name:_name});
        RenderBoughtItems();
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

      function RenderBoughtItems(){
          
        let displayBoughtItems = boughtItems.map((item)=>{
              return (`<span class="product-item crossed">
              ${item.name}
              <span class="circular-amount crossed">${item.amount}</span>
      </span>`);
          });

        boughtItemsContainer.innerHTML=displayBoughtItems.join(' ');  
      }
}