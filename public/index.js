window.onload = function() {

    const itemsContainer = document.getElementById('items-container');
    const notBoughtItemsContainer = document.getElementById('not-bought-items-container');
    const boughtItemsContainer = document.getElementById('bought-items-container');
    let productList = [];
    let notBoughtItems = [];
    let boughtItems = [];

    $("#add-button").on( "click", function() {
        let productName = document.getElementById('input').value;
        $.post({
			url: "/addProduct",
			contentType: "application/json",
			data: JSON.stringify({name:productName}),
			success: function (response) {
                let _id = response.id;
                let _amount = response.amount;
                let _name = response.name;
                productList.push({id: _id, name: _name, amount: _amount});
                RenderProductList();
        
                notBoughtItems.push({id:_id,name: _name, amount: _amount});
                RenderNotBoughtItems();
        
                document.getElementById('input').value='';
			   }
		});    
    });

    $(document).on('click' , '.increment', function(){
        let _id = $(this).data('product-id');
        console.log(_id)
        let _amount= $(this).closest('.second-column').find('.amount')[0];
        let amount = Number(_amount.innerHTML);
        $(this).closest('.second-column').find('.amount')[0].innerHTML=++amount;
        notBoughtItems[GetElementPos(notBoughtItems, _id)].amount = amount;
        RenderNotBoughtItems();
    });

    $(document).on('click' , '.decrement', function(){
        let _id = $(this).data('product-id');
        let _amount= $(this).closest('.second-column').find('.amount')[0];
        let amount = Number(_amount.innerHTML);
        if(amount==1)
            return;
        $(this).closest('.second-column').find('.amount')[0].innerHTML=--amount;
        notBoughtItems[GetElementPos(notBoughtItems, _id)].amount = amount;
        RenderNotBoughtItems();
    });

      $(document).on('click' , '.button-buy', function(){
        let _id = $(this).data('product-id');
        let _amount= $(this).closest('.item').find('.amount')[0].innerHTML;
        let _name = $(this).data('product-name');
        $(this).closest('.item')[0].innerHTML=`
        <div class="first-column titles">
            <span class="title crossed">${_name}</span>
        </div>
        <div class="second-column add-buttons">                   
            <span class="amount">${_amount}</span>
        </div>
        <div class="third-column option-buttons">
            <button class="button-not-bought" data-product-name="${_name}" data-product-id="${_id}" data-product-amount="${_amount}">Не куплено</button>
        </div>`;
        
        notBoughtItems = notBoughtItems.filter(item => item._id!=_id);
        RenderNotBoughtItems();
        boughtItems.push({id:_id, amount:_amount, name:_name});
        RenderBoughtItems();
    });
    
    $(document).on('click' , '.button-not-bought', function(){
        let _id = $(this).data('product-id');
        let _amount= $(this).closest('.item').find('.amount')[0].innerHTML;
        let _name = $(this).data('product-name');
        $(this).closest('.item')[0].innerHTML= `
        <div class="first-column titles">
            <span class="title">${_name}</span>
        </div>
        <div class="second-column add-buttons">
            <button class="decrement circular-button red-button" data-product-id="${_id}"><b>-</b></button>
            <span class="amount">${_amount}</span>
            <button class="increment circular-button green-button" data-product-id="${_id}"><b>+</b></button>
        </div>
        <div class="third-column option-buttons">
            <button class="button-buy" data-product-name="${_name}" data-product-id="${_id}" data-product-amount="${_amount}">Куплено</button>
            <button class="delete-button" data-product-name="${_name}" data-product-id="${_id}">X</button>
        </div>`;
        
        boughtItems = boughtItems.filter(item => item._id!=_id);
        RenderBoughtItems();
        notBoughtItems.push({id:_id, amount:_amount, name:_name});
        RenderNotBoughtItems();
    });

    $(document).on('click' , '.delete-button', function(){
        let _id = $(this).data('product-id');      
        notBoughtItems = notBoughtItems.filter(item => item._id!=_id);
        RenderNotBoughtItems();
        productList = productList.filter(item => item._id!=_id);
        RenderProductList();
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

    function RenderProductList(){
        let displayItems = productList.map((item)=>{
              return (` <div class="item">
              <div class="first-column titles">
                  <span class="title">${item.name}</span>
              </div>
              <div class="second-column add-buttons">
                  <button class="decrement circular-button red-button" data-product-id="${item._id}"><b>-</b></button>
                  <span class="amount">${item.amount}</span>
                  <button class="increment circular-button green-button" data-product-id="${item._id}"><b>+</b></button>
              </div>
              <div class="third-column option-buttons">
                  <button class="button-buy" data-product-name="${item.name}" data-product-id="${item._id}" data-product-amount="${item.amount}">Куплено</button>
                  <button class="delete-button" data-product-name="${item.name}" data-product-id="${item._id}">X</button>
              </div>
              </div>`);
          });

        itemsContainer.innerHTML=displayItems.join(' ');  
    }

    function GetElementPos(_array, _id){
        for(let i =0; i<_array.length;i++){
            if(_array[i]._id==_id)
                return i;
        }
    }

    function GetProductList(){
        $.get({
			url: "/allProducts",
			contentType: "application/json",
			data: '',
			success: function (response) {
                if(response.length==0)
                    return;
                productList=response;
                productList.forEach(element => {
                    notBoughtItems.push(element);
                });
                RenderProductList();
                RenderNotBoughtItems();
			   }
		});
    }
    
    GetProductList();
}